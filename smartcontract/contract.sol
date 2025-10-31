// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleRaceEvent {
    struct EventRoom {
        uint256 roomId;          // Unique room ID
        address sponsor;         // Sponsor address
        uint256 prizePool;       // Total prize pool (in wei)
        address[] participants;  // List of player addresses
        bool exists;             // To check if the room exists
    }

    // Mapping of roomId → EventRoom
    mapping(uint256 => EventRoom) public rooms;

    // Events for logging
    event EventCreated(uint256 indexed roomId, address indexed sponsor, uint256 prizePool);
    event PlayerJoined(uint256 indexed roomId, address indexed player);
    event PrizeTransferred(uint256 indexed roomId, address indexed to, uint256 amount);

    /// @notice Sponsor creates an event room with a prize pool
    /// @param roomId The unique ID for the event
    /// @param prizePool The total prize pool amount (in wei)
    function createEvent(uint256 roomId, uint256 prizePool) external payable {
        require(!rooms[roomId].exists, "Room already exists");
        require(prizePool > 0, "Prize pool must be greater than zero");
        require(msg.value == prizePool, "Sent ETH must equal the declared prize pool");

        EventRoom storage newRoom = rooms[roomId];
        newRoom.roomId = roomId;
        newRoom.sponsor = msg.sender;
        newRoom.prizePool = prizePool;
        newRoom.exists = true;

        emit EventCreated(roomId, msg.sender, prizePool);
    }

    /// @notice Player joins an existing event room
    /// @param roomId The ID of the room to join
    function joinEvent(uint256 roomId) external {
        require(rooms[roomId].exists, "Room does not exist");

        EventRoom storage room = rooms[roomId];
        room.participants.push(msg.sender);

        emit PlayerJoined(roomId, msg.sender);
    }

    /// @notice Get all participants for a given room
    /// @param roomId The ID of the room
    function getParticipants(uint256 roomId) external view returns (address[] memory) {
        require(rooms[roomId].exists, "Room does not exist");
        return rooms[roomId].participants;
    }

    /// @notice Transfer a portion of the prize pool to specific participants
    /// @param roomId The ID of the room
    /// @param recipients Array of participant addresses to pay
    /// @param amountPerRecipient Amount in wei to send to each recipient
    function distributePrizes(uint256 roomId, address[] calldata recipients, uint256 amountPerRecipient) external {
        EventRoom storage room = rooms[roomId];
        require(room.exists, "Room does not exist");
        require(msg.sender == room.sponsor, "Only sponsor can distribute prizes");

        uint256 totalAmount = amountPerRecipient * recipients.length;
        require(room.prizePool >= totalAmount, "Not enough prize pool balance");

        // Transfer to each recipient
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool sent, ) = payable(recipients[i]).call{value: amountPerRecipient}("");
            require(sent, "Transfer failed");
            emit PrizeTransferred(roomId, recipients[i], amountPerRecipient);
        }

        room.prizePool -= totalAmount;
    }

    /// @notice Check if a room exists
    function isRoomHosted(uint256 roomId) external view returns (bool) {
        return rooms[roomId].exists;
    }

    /// @notice Get remaining prize pool for a room
    function getPrizePool(uint256 roomId) external view returns (uint256) {
        require(rooms[roomId].exists, "Room does not exist");
        return rooms[roomId].prizePool;
    }

    // Prevent direct ETH deposits outside of createEvent
    receive() external payable {
        revert("Send ETH only through createEvent");
    }
}
