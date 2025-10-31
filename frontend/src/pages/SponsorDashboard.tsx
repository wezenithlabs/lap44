import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../data";

// ✅ Connect Wallet Component (MetaMask)
function ConnectWallet({ onConnected }: { onConnected: (address: string) => void }) {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setConnectedAddress(address);
      onConnected(address);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return connectedAddress ? (
    <div className="p-4 bg-green-500/10 rounded-lg text-white font-semibold">
      ✅ Connected: {connectedAddress}
    </div>
  ) : (
    <button
      onClick={connectWallet}
      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-lg"
    >
      🔗 Connect Wallet
    </button>
  );
}

// ✅ RoomCard component (reads contract data)
//@ts-ignore
function RoomCard({ roomId, sponsorAddress, contract, onDistribute }: any) {
  const [roomData, setRoomData] = useState<any>(null);
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (!contract) return;

    const fetchRoom = async () => {
      try {
        const data = await contract.rooms(roomId);
        const exists = data[3];
        const sponsor = data[1];
        if (!exists || sponsor.toLowerCase() !== sponsorAddress.toLowerCase()) return;

        const participantList = await contract.getParticipants(roomId);
        setRoomData(data);
        setParticipants(participantList);
      } catch (err) {
        console.error("Error reading room:", err);
      }
    };

    fetchRoom();
  }, [contract, roomId, sponsorAddress]);

  if (!roomData) return null;

  const prizePool = ethers.formatEther(roomData[2]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border-2 border-white/20">
      <h3 className="text-2xl font-bold text-white mb-2">Room #{roomId.toString()}</h3>
      <p className="text-white/80 mb-2">Prize Pool: {prizePool} ETH</p>
      <p className="text-white/80 mb-4">Participants: {participants.length}</p>
      <button
        onClick={() => onDistribute(roomId)}
        className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 font-semibold transition-colors"
      >
        💰 Distribute Prizes
      </button>
    </div>
  );
}

// ✅ Main Dashboard
export default function SponsorDashboard() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [address, setAddress] = useState<string>("");
  const [roomsToCheck, setRoomsToCheck] = useState<bigint[]>([]);
  const [selectedRoomForPrize, setSelectedRoomForPrize] = useState<bigint | null>(null);
  const [message, setMessage] = useState("");

  console.log(provider);
  console.log(signer);

  // Form refs
  const roomIdRef = useRef<HTMLInputElement>(null);
  const prizePoolRef = useRef<HTMLInputElement>(null);
  const manualRoomIdRef = useRef<HTMLInputElement>(null);
  const recipientsRef = useRef<HTMLTextAreaElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Connect Wallet and Setup Contract
  const handleWalletConnected = async (addr: string) => {
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer = await _provider.getSigner();
    const _contract = new ethers.Contract(contractAddress, contractABI, _signer);
    setProvider(_provider);
    setSigner(_signer);
    setContract(_contract);
    setAddress(addr);
  };

  // Watch for events
  useEffect(() => {
    if (!contract) return;

    const handleEventCreated = (roomId: bigint, sponsor: string) => {
      console.log(`EventCreated → Room ${roomId.toString()} by ${sponsor}`);
      if (sponsor.toLowerCase() === address.toLowerCase()) {
        setRoomsToCheck(prev => [...new Set([...prev, roomId])]);
        setMessage(`✅ New event created! Room #${roomId}`);
      }
    };

    const handlePlayerJoined = (roomId: bigint, player: string) => {
      console.log(`PlayerJoined → ${player} joined Room #${roomId}`);
      setRoomsToCheck(prev => [...prev]); // trigger refresh
    };

    contract.on("EventCreated", handleEventCreated);
    contract.on("PlayerJoined", handlePlayerJoined);

    return () => {
      contract.off("EventCreated", handleEventCreated);
      contract.off("PlayerJoined", handlePlayerJoined);
    };
  }, [contract, address]);

  // Create Event
  const handleCreateEvent = async () => {
    if (!roomIdRef.current?.value || !prizePoolRef.current?.value)
      return setMessage("⚠️ Enter Room ID and Prize Pool");

    const roomId = BigInt(roomIdRef.current.value);
    const prize = prizePoolRef.current.value;
    try {
      const tx = await contract?.createEvent(roomId, ethers.parseEther(prize), {
        value: ethers.parseEther(prize),
      });
      setMessage(`⏳ Transaction sent... waiting confirmation`);
      await tx.wait();
      setMessage(`✅ Event Room #${roomId} created`);
      setRoomsToCheck(prev => [...prev, roomId]);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.reason || err.message}`);
    }
  };

  // Manual Add Room
  const handleAddRoom = () => {
    if (!manualRoomIdRef.current?.value) return;
    const roomId = BigInt(manualRoomIdRef.current.value);
    setRoomsToCheck(prev => [...new Set([...prev, roomId])]);
  };

  // Distribute Prizes
  const handleDistributePrizes = async () => {
    if (!selectedRoomForPrize || !recipientsRef.current?.value || !amountRef.current?.value) {
      setMessage("⚠️ Fill all fields");
      return;
    }

    const recipients = recipientsRef.current.value
      .split("\n")
      .map(a => a.trim())
      .filter(Boolean);
    const amount = ethers.parseEther(amountRef.current.value);

    try {
      const tx = await contract?.distributePrizes(selectedRoomForPrize, recipients, amount);
      setMessage("⏳ Sending prizes...");
      await tx.wait();
      setMessage("✅ Prizes distributed successfully!");
      setSelectedRoomForPrize(null);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.reason || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 to-pink-800 p-8">
      <h1 className="text-5xl font-bold text-white mb-8">🏆 Sponsor Dashboard</h1>

      <ConnectWallet onConnected={handleWalletConnected} />

      {message && (
        <div className="mt-4 p-4 bg-blue-500/20 border-l-4 border-blue-400 text-white rounded">
          {message}
        </div>
      )}

      {address && <div className="mt-4 text-white text-sm">Connected as: {address}</div>}

      {/* Create Event */}
      <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
        <h2 className="text-2xl text-white font-bold mb-4">🎮 Create Racing Event</h2>
        <input
          ref={roomIdRef}
          type="number"
          placeholder="Room ID"
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white"
        />
        <input
          ref={prizePoolRef}
          type="number"
          placeholder="Prize Pool (ETH)"
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white"
        />
        <button
          onClick={handleCreateEvent}
          className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold"
        >
          🏁 Create Event
        </button>
      </div>

      {/* Manual Room Add */}
      <div className="mt-6 p-6 bg-yellow-500/10 rounded-xl border border-yellow-400/30">
        <h3 className="text-xl text-yellow-200 mb-3">🔍 Add Room Manually</h3>
        <div className="flex gap-3">
          <input
            ref={manualRoomIdRef}
            type="number"
            placeholder="Enter Room ID"
            className="flex-1 p-3 rounded-lg bg-white/20 text-white"
          />
          <button
            onClick={handleAddRoom}
            className="px-6 bg-yellow-500 text-white rounded-lg font-bold"
          >
            ➕ Add
          </button>
        </div>
      </div>

      {/* My Rooms */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-white mb-6">📊 Your Rooms</h2>
        {roomsToCheck.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsToCheck.map(roomId => (
              <RoomCard
                key={roomId.toString()}
                roomId={roomId}
                sponsorAddress={address}
                contract={contract}
                onDistribute={setSelectedRoomForPrize}
              />
            ))}
          </div>
        ) : (
          <div className="text-white/80">📭 No rooms yet.</div>
        )}
      </div>

      {/* Prize Distribution Modal */}
      {selectedRoomForPrize && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-purple-900 p-6 rounded-xl max-w-xl w-full border border-white/30 text-white">
            <h2 className="text-2xl font-bold mb-4">
              💰 Distribute Prizes - Room #{selectedRoomForPrize.toString()}
            </h2>
            <textarea
              ref={recipientsRef}
              rows={5}
              placeholder="0xabc...\n0xdef..."
              className="w-full p-3 mb-3 bg-white/20 rounded-lg text-white font-mono"
            />
            <input
              ref={amountRef}
              type="number"
              step="0.001"
              placeholder="Amount per recipient (ETH)"
              className="w-full p-3 mb-4 bg-white/20 rounded-lg text-white"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDistributePrizes}
                className="flex-1 bg-yellow-500 py-3 rounded-lg font-bold"
              >
                💸 Send Prizes
              </button>
              <button
                onClick={() => setSelectedRoomForPrize(null)}
                className="px-6 bg-white/20 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
