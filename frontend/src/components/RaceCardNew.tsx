import { formatEther } from "viem";
import { useState } from "react";

interface Race {
  raceId: bigint;
  raceName: string;
  organiser: string;
  entryFee: bigint;
  prizePool: bigint;
  startTime: bigint;
  status: number;
  winner: string;
  racers: string[];
}

interface RaceCardProps {
  race: Race;
  userType: 'organiser' | 'racer' | 'viewer' | 'sponsor';
  currentAddress?: string;
  onRegister?: (raceId: bigint, entryFee: bigint) => void;
  onPlaceBet?: (raceId: bigint) => void;
  onSponsor?: (raceId: bigint) => void;
  onEndRace?: (raceId: bigint) => void;
}

export const RaceCardNew = ({ race, userType, currentAddress, onRegister, onPlaceBet, onSponsor, onEndRace }: RaceCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const statusLabels = ["Created", "Active", "Ended"];
  const statusColors = [
    "bg-yellow-100 text-yellow-800 border-yellow-300",
    "bg-green-100 text-green-800 border-green-300",
    "bg-gray-100 text-gray-800 border-gray-300"
  ];

  const themeConfig = {
    organiser: {
      gradient: "from-purple-50 to-pink-50",
      border: "border-purple-300",
      button: "bg-purple-600 hover:bg-purple-700",
      accent: "text-purple-700"
    },
    racer: {
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-300",
      button: "bg-blue-600 hover:bg-blue-700",
      accent: "text-blue-700"
    },
    viewer: {
      gradient: "from-green-50 to-emerald-50",
      border: "border-green-300",
      button: "bg-green-600 hover:bg-green-700",
      accent: "text-green-700"
    },
    sponsor: {
      gradient: "from-orange-50 to-amber-50",
      border: "border-orange-300",
      button: "bg-orange-600 hover:bg-orange-700",
      accent: "text-orange-700"
    }
  };

  const theme = themeConfig[userType];
  const isOrganiser = currentAddress?.toLowerCase() === race.organiser.toLowerCase();
  const isRegistered = race.racers.some(r => r.toLowerCase() === currentAddress?.toLowerCase());
  const startDate = new Date(Number(race.startTime) * 1000);

  return (
    <div className={`p-6 bg-linear-to-br ${theme.gradient} rounded-xl shadow-lg border-2 ${theme.border} transition-all hover:shadow-xl`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${theme.accent} mb-1`}>{race.raceName}</h3>
          <p className="text-sm text-gray-600">Race ID: #{race.raceId.toString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[race.status]}`}>
          {statusLabels[race.status]}
        </span>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 uppercase mb-1">Entry Fee</p>
          <p className="text-lg font-bold text-purple-600">{formatEther(race.entryFee)} ETH</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 uppercase mb-1">Prize Pool</p>
          <p className="text-lg font-bold text-green-600">{formatEther(race.prizePool)} ETH</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 uppercase mb-1">Racers</p>
          <p className="text-lg font-bold text-blue-600">{race.racers.length}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 uppercase mb-1">Start Time</p>
          <p className="text-sm font-semibold text-gray-700">{startDate.toLocaleString()}</p>
        </div>
      </div>

      {/* Organiser Info */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
        <p className="text-xs text-gray-500 uppercase mb-1">Organiser</p>
        <p className="text-xs font-mono text-gray-700 break-all">
          {race.organiser}
          {isOrganiser && <span className="ml-2 text-purple-600 font-bold">(You)</span>}
        </p>
      </div>

      {/* Winner Info (if race ended) */}
      {race.status === 2 && race.winner !== "0x0000000000000000000000000000000000000000" && (
        <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300 mb-4">
          <p className="text-xs text-yellow-700 uppercase mb-1 font-bold">🏆 Winner</p>
          <p className="text-xs font-mono text-yellow-900 break-all">{race.winner}</p>
        </div>
      )}

      {/* Expandable Racers List */}
      {race.racers.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-700">
              👥 Registered Racers ({race.racers.length}) {expanded ? "▼" : "▶"}
            </p>
          </button>
          {expanded && (
            <div className="mt-2 bg-white p-3 rounded-lg shadow-sm max-h-40 overflow-y-auto">
              {race.racers.map((racer, idx) => (
                <div key={idx} className="py-1 border-b last:border-b-0">
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {idx + 1}. {racer}
                    {racer.toLowerCase() === currentAddress?.toLowerCase() && (
                      <span className="ml-2 text-blue-600 font-bold">(You)</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {userType === 'organiser' && isOrganiser && race.status === 1 && (
          <button
            onClick={() => onEndRace?.(race.raceId)}
            className={`w-full ${theme.button} text-white py-3 rounded-lg font-semibold transition-colors`}
          >
            🏁 End Race & Declare Winner
          </button>
        )}

        {userType === 'racer' && race.status === 1 && !isRegistered && (
          <button
            onClick={() => onRegister?.(race.raceId, race.entryFee)}
            className={`w-full ${theme.button} text-white py-3 rounded-lg font-semibold transition-colors`}
          >
            🏎️ Register for Race ({formatEther(race.entryFee)} ETH)
          </button>
        )}

        {userType === 'racer' && isRegistered && (
          <div className="bg-blue-100 text-blue-800 py-3 px-4 rounded-lg text-center font-semibold border-2 border-blue-300">
            ✅ You're Registered!
          </div>
        )}

        {userType === 'viewer' && race.status === 1 && race.racers.length > 0 && (
          <button
            onClick={() => onPlaceBet?.(race.raceId)}
            className={`w-full ${theme.button} text-white py-3 rounded-lg font-semibold transition-colors`}
          >
            💰 Place Bet on Racer
          </button>
        )}

        {userType === 'sponsor' && (race.status === 0 || race.status === 1) && (
          <button
            onClick={() => onSponsor?.(race.raceId)}
            className={`w-full ${theme.button} text-white py-3 rounded-lg font-semibold transition-colors`}
          >
            🎬 Sponsor This Race
          </button>
        )}
      </div>
    </div>
  );
};
