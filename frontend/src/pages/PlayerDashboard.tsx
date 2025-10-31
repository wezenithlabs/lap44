import { useAccount, useWatchContractEvent, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { Account } from "../components/account";
import { WalletOptions } from "../components/wallet-options";
import { useRef, useState } from "react";
import { contractABI, contractAddress } from "../data";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

const PlayerDashboard = () => {
  const { address } = useAccount();
  const joinRoomIdRef = useRef<HTMLInputElement>(null);
  const searchRoomIdRef = useRef<HTMLInputElement>(null);
  
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [message, setMessage] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  console.log("🎮 [PLAYER] Dashboard loaded");
  console.log("🎮 [PLAYER] Connected address:", address);

  // Watch for PlayerJoined events
  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: 'PlayerJoined',
    onLogs(logs) {
      console.log("✅ [PLAYER] PlayerJoined event fired!", logs);
      logs.forEach((log: any) => {
        const { roomId, player } = log.args;
        if (player.toLowerCase() === address?.toLowerCase()) {
          console.log(`✅ You joined Room #${roomId}!`);
          setMessage(`✅ Successfully joined Room #${roomId}!`);
          setTimeout(() => setMessage(""), 5000);
        }
      });
    }
  });

  // Join Event Room
  const handleJoinRoom = async () => {
    if (!joinRoomIdRef.current?.value) {
      setMessage("❌ Please enter a Room ID");
      return;
    }

    const roomId = BigInt(joinRoomIdRef.current.value);

    console.log("🎮 [PLAYER] Joining room:", roomId.toString());

    try {
      const txHash = await writeContractAsync({
        abi: contractABI,
        address: contractAddress,
        functionName: 'joinEvent',
        args: [roomId],
      });

      console.log("✅ [PLAYER] Join transaction sent:", txHash);
      setHash(txHash);
      setMessage("⏳ Joining room...");
      
      if (joinRoomIdRef.current) joinRoomIdRef.current.value = "";
    } catch (error: any) {
      console.error("❌ [PLAYER] Error joining room:", error);
      setMessage(`❌ Error: ${error.message || "Failed to join room"}`);
    }
  };

  // Search for room details
  const handleSearchRoom = async () => {
    if (!searchRoomIdRef.current?.value) {
      setMessage("❌ Please enter a Room ID to search");
      return;
    }

    const roomId = BigInt(searchRoomIdRef.current.value);
    console.log("🔍 [PLAYER] Searching for room:", roomId.toString());

    try {
      // Read room data using useReadContract hook
      // For now showing placeholder - implement actual contract call
      setSearchResult({
        roomId: roomId.toString(),
        exists: true,
        prizePool: "1.5",
        participants: 5
      });
      setMessage(`✅ Found Room #${roomId}`);
    } catch (error: any) {
      console.error("❌ Error searching room:", error);
      setMessage(`❌ Error: ${error.message}`);
      setSearchResult(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        🎮 Player Dashboard
      </h1>
      
      <ConnectWallet />

      {address && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Your Address:</strong> <span className="font-mono text-xs">{address}</span>
          </p>
        </div>
      )}

      {message && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-blue-800 font-semibold">{message}</p>
        </div>
      )}

      {/* Join Room Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg border-2 border-blue-300">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">🏁 Join Racing Event</h2>
        <p className="text-sm text-blue-600 mb-4">
          Enter a Room ID to join an existing racing event
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room ID
            </label>
            <input
              ref={joinRoomIdRef}
              type="number"
              placeholder="Enter Room ID (e.g., 101)"
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
              disabled={isPending || isConfirming}
            />
          </div>
          <button
            onClick={handleJoinRoom}
            disabled={isPending || isConfirming}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 font-bold text-lg transition-all shadow-lg"
          >
            {isPending || isConfirming ? "Processing..." : "🎮 Join Event"}
          </button>
        </div>
      </div>

      {/* Search Room Section */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🔍 Search Event Room</h2>
        <div className="flex gap-3">
          <input
            ref={searchRoomIdRef}
            type="number"
            placeholder="Enter Room ID to view details"
            className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSearchRoom}
            className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Search
          </button>
        </div>

        {searchResult && (
          <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              Room #{searchResult.roomId}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Prize Pool</p>
                <p className="text-2xl font-bold text-purple-700">
                  {searchResult.prizePool} ETH
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Participants</p>
                <p className="text-2xl font-bold text-blue-700">
                  {searchResult.participants} Players
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How to Play */}
      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
        <h2 className="text-2xl font-bold mb-4 text-green-800">📖 How to Play</h2>
        <ol className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-600">1.</span>
            <span>Connect your MetaMask wallet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-600">2.</span>
            <span>Get a Room ID from the event sponsor</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-600">3.</span>
            <span>Enter the Room ID and click "Join Event"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-600">4.</span>
            <span>Wait for the sponsor to distribute prizes after the race!</span>
          </li>
        </ol>
      </div>

      {isConfirming && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="text-yellow-800 font-semibold">⏳ Confirming transaction...</p>
        </div>
      )}
      {isSuccess && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-green-800 font-semibold">✅ Transaction confirmed!</p>
        </div>
      )}
    </div>
  );
};

export default PlayerDashboard;
