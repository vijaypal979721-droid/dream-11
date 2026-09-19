import React, { useState } from 'react';
import { calculateFantasyPoints } from './utils/pointsCalculator';

const MatchDetails = ({ matchData, userBalance, onJoinSuccess }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Player Select / Deselect Handler
  const togglePlayerSelect = (player) => {
    if (selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      if (selectedPlayers.length >= 11) {
        setErrorMsg('Aap maximum 11 players hi select kar sakte hain.');
        return;
      }
      setSelectedPlayers([...selectedPlayers, player]);
      setErrorMsg('');
    }
  };

  // Total Points Update Handler
  const getUpdatedTeamWithPoints = () => {
    return selectedPlayers.map((player) => {
      const isCaptain = captain === player.id;
      const isViceCaptain = viceCaptain === player.id;
      
      const totalPoints = calculateFantasyPoints({
        ...player.stats,
        isCaptain,
        isViceCaptain,
      });

      return {
        ...player,
        calculatedPoints: totalPoints,
        roleInTeam: isCaptain ? 'C' : isViceCaptain ? 'VC' : 'PLAYER',
      };
    });
  };

  // "Okay / Submit / Join Contest" Click Handler
  const handleConfirmSelection = () => {
    // 11 Players Check
    if (selectedPlayers.length !== 11) {
      setErrorMsg('Kripya puri 11 players ki team banayein.');
      return;
    }

    // Captain / Vice-Captain Check
    if (!captain || !viceCaptain) {
      setErrorMsg('Captain aur Vice-Captain dono select karna zaroori hai.');
      return;
    }

    const finalTeam = getUpdatedTeamWithPoints();
    const totalTeamPoints = finalTeam.reduce((acc, curr) => acc + curr.calculatedPoints, 0);

    const payload = {
      matchId: matchData.id,
      team: finalTeam,
      totalPoints: totalTeamPoints,
      createdAt: new Date().toISOString(),
    };

    console.log('Team Successfully Joined:', payload);
    setErrorMsg('');
    
    if (onJoinSuccess) {
      onJoinSuccess(payload);
    } else {
      alert('Contest successfully join ho gaya hai! Total Points: ' + totalTeamPoints);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-slate-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-2">{matchData?.title || "Match Details"}</h2>
      
      {errorMsg && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Selected Players Count Header */}
      <div className="flex justify-between items-center mb-4 bg-slate-800 p-3 rounded">
        <span>Selected Players: <strong>{selectedPlayers.length} / 11</strong></span>
        <span>Available Balance: ₹{userBalance}</span>
      </div>

      {/* Players List */}
      <div className="space-y-2 mb-6 max-h-80 overflow-y-auto">
        {matchData?.players?.map((player) => {
          const isSelected = selectedPlayers.some((p) => p.id === player.id);
          return (
            <div
              key={player.id}
              onClick={() => togglePlayerSelect(player)}
              className={`flex justify-between items-center p-3 rounded cursor-pointer border ${
                isSelected ? 'bg-indigo-900 border-indigo-500' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div>
                <p className="font-semibold">{player.name}</p>
                <p className="text-xs text-gray-400">{player.team} | {player.role}</p>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {isSelected && (
                  <>
                    <button
                      onClick={() => setCaptain(player.id)}
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        captain === player.id ? 'bg-yellow-500 text-black' : 'bg-slate-700'
                      }`}
                    >
                      C
                    </button>
                    <button
                      onClick={() => setViceCaptain(player.id)}
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        viceCaptain === player.id ? 'bg-blue-500 text-white' : 'bg-slate-700'
                      }`}
                    >
                      VC
                    </button>
                  </>
                )}
                <span className="text-sm font-bold text-green-400">
                  {calculateFantasyPoints(player.stats || {})} Pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Options Activated Submit / OK Button */}
      <button
        onClick={handleConfirmSelection}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
      >
        OK / SAVE TEAM & JOIN CONTEST
      </button>
    </div>
  );
};

export default MatchDetails;
