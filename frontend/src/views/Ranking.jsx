import React, { useState, useEffect } from "react";
import { playerService } from "../services/dataService";

const Ranking = () => {
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState("yleinen"); // "yleinen" or "ktp"
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        setPlayers([]);
        let data;
        if (activeTab === "yleinen") {
          data = await playerService.getRanking();
          const sorted = (data || []).sort((a, b) => {
            const groupA = a.Ryhma || 0;
            const groupB = b.Ryhma || 0;
            if (groupA !== groupB) return groupA - groupB;
            return (b.Pisteet || 0) - (a.Pisteet || 0);
          });
          setPlayers(sorted);
        } else {
          data = await playerService.getKtpFinalRanking();
          setPlayers(data || []);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching ranking:", err);
        setError("Haku epäonnistui.");
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [activeTab]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading && players.length === 0) {
    return (
      <div className="flex justify-center p-12">
        <svg className="animate-spin h-8 w-8 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  let lastRyhma = null;

  return (
    <div className="space-y-6">
      <div className="flex border-b border-alabaster_grey-400">
        <button
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "yleinen"
              ? "border-orange text-prussian_blue bg-alabaster_grey-800"
              : "border-transparent text-alabaster_grey-300 hover:text-prussian_blue"
          }`}
          onClick={() => setActiveTab("yleinen")}
        >
          Yleinen ranking
        </button>
        <button
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "ktp"
              ? "border-orange text-prussian_blue bg-alabaster_grey-800"
              : "border-transparent text-alabaster_grey-300 hover:text-prussian_blue"
          }`}
          onClick={() => setActiveTab("ktp")}
        >
          KTP Finals
        </button>
      </div>

      <div className="overflow-x-auto">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <table className="min-w-full divide-y divide-alabaster_grey-300">
          <thead>
            <tr className="text-prussian_blue-700 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 text-left font-bold" style={{ width: "50px" }}>#</th>
              <th className="px-6 py-3 text-left font-bold">Nimi</th>
              {activeTab === "ktp" ? (
                <>
                  <th className="px-6 py-3 text-center font-bold">V-H</th>
                  <th className="px-6 py-3 text-center font-bold">Pisteet</th>
                  <th className="px-6 py-3 text-right font-bold">Rankingpisteet</th>
                </>
              ) : (
                <th className="px-6 py-3 text-right font-bold">Pisteet</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-alabaster_grey-200">
            {players.map((player, index) => {
              const currentRyhma = player.Ryhma || 0;
              const isNewGroup = activeTab === "yleinen" && lastRyhma !== null && lastRyhma !== currentRyhma;
              lastRyhma = currentRyhma;

              return (
                <React.Fragment key={player.player_id || player.id || index}>
                  {isNewGroup && (
                    <tr>
                      <td colSpan="3" className="bg-alabaster_grey-600 py-1 px-6 border-t border-b border-alabaster_grey-400"></td>
                    </tr>
                  )}

                  <tr
                    onClick={() => toggleRow(player.player_id || player.id || index)}
                    className="hover:bg-alabaster_grey-800 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700">
                      {activeTab === "ktp" ? player.current_rank : (index + 1)}.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {player.player_name || player.Nimi || player.name}
                    </td>
                    {activeTab === "ktp" ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-black-700">
                          {player.wins}-{player.losses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-black-700">
                          {player.ktp_points_match + player.ktp_points_set}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-orange">
                          {player.final_ranking_points}
                        </td>
                      </>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-prussian_blue">
                        {player.Pisteet || 0}
                      </td>
                    )}
                  </tr>

                  {expandedRow === (player.player_id || player.id || index) && (
                    <tr className="bg-alabaster_grey-900">
                      <td colSpan={activeTab === "ktp" ? 5 : 3} className="px-12 py-3">
                        <div className="flex gap-8 text-xs text-black-700">
                          <div>
                            Pelatut ottelut: <span className="font-bold text-prussian_blue">{player.played_matches || player.Pelatut_Ottelut || 0}</span>
                          </div>
                          {activeTab === "ktp" && (
                            <>
                              <div>Ottelupisteet: <span className="font-bold text-prussian_blue">{player.ktp_points_match}</span></div>
                              <div>Eräpisteet: <span className="font-bold text-prussian_blue">{player.ktp_points_set}</span></div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;
