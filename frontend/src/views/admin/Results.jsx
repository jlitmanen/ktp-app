import React, { useState, useEffect } from "react";
import {
  matchService,
  playerService,
  openService,
} from "../../services/dataService";

// --- SUB-COMPONENT: INLINE EDITOR ---
const ResultRow = ({ result, players, opens, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...result });

  // Sync internal state if props change
  useEffect(() => {
    setEditData({
      ...result,
      home: result.player1 || result.home_id || result.home,
      away: result.player2 || result.away_id || result.away,
      game_date:
        result.game_date?.substring(0, 10) ||
        result.date?.substring(0, 10) ||
        "",
    });
  }, [result]);

  const handleLocalSave = async () => {
    await onSave(editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="bg-alabaster_grey-800">
        <td colSpan="6" className="p-4 shadow-inner">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-prussian_blue uppercase">Koti</label>
                <select
                  className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                  value={editData.home}
                  onChange={(e) =>
                    setEditData({ ...editData, home: e.target.value })
                  }
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-prussian_blue uppercase">W1</label>
                <input
                  type="number"
                  className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                  value={editData.wins1}
                  onChange={(e) =>
                    setEditData({ ...editData, wins1: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-prussian_blue uppercase">Päivämäärä</label>
                <input
                  type="date"
                  className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                  value={editData.game_date}
                  onChange={(e) =>
                    setEditData({ ...editData, game_date: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={handleLocalSave}
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-colors shadow-sm"
                >
                  OK
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-prussian_blue uppercase">Vieras</label>
                <select
                  className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                  value={editData.away}
                  onChange={(e) =>
                    setEditData({ ...editData, away: e.target.value })
                  }
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-prussian_blue uppercase">W2</label>
                <input
                  type="number"
                  className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                  value={editData.wins2}
                  onChange={(e) =>
                    setEditData({ ...editData, wins2: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-prussian_blue uppercase">Lisätiedot</label>
                <input
                  type="text"
                  className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                  placeholder="Details (6-0, 6-2)"
                  value={editData.result}
                  onChange={(e) =>
                    setEditData({ ...editData, result: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full px-4 py-2 bg-alabaster_grey-400 text-black text-sm font-bold rounded hover:bg-alabaster_grey-500 transition-colors shadow-sm"
                >
                  Peruuta
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-alabaster_grey-800 transition-colors border-b border-alabaster_grey-200">
      <td className="px-4 py-4 whitespace-nowrap text-sm text-black-700">
        {result.game_date?.substring(0, 10) || result.date}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-black">{result.homename || result.home}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-black">{result.awayname || result.away}</td>
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-prussian_blue text-white shadow-sm">
          {result.wins1} - {result.wins2}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-xs text-black-700 italic">
        {result.tournament_name || "Ranking"}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-3">
          <button
            className="text-prussian_blue hover:text-orange transition-colors font-bold"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors font-bold"
            onClick={() => onDelete(result.id)}
          >
            X
          </button>
        </div>
      </td>
    </tr>
  );
};

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [players, setPlayers] = useState([]);
  const [opens, setOpens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- NEW STATE FOR ADDING ---
  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({
    home: "",
    away: "",
    wins1: 0,
    wins2: 0,
    game_date: new Date().toISOString().split("T")[0],
    result: "",
    tournament_id: "",
  });

  useEffect(() => {
    fetchStaticData();
  }, []);
  useEffect(() => {
    fetchResults(currentPage);
  }, [currentPage]);

  const fetchStaticData = async () => {
    try {
      const [p, o] = await Promise.all([
        playerService.getAll(),
        openService.getAll(),
      ]);
      setPlayers(p || []);
      setOpens(o || []);
    } catch (err) {
      setError("Datan haku epäonnistui.");
    }
  };

  const fetchResults = async (page) => {
    try {
      setLoading(true);
      const data = await matchService.getResults(page);
      setResults(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Tulosten haku epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async () => {
    if (!newData.home || !newData.away) return alert("Valitse pelaajat!");
    try {
      const payload = {
        ...newData,
        player1: newData.home,
        player2: newData.away,
        wins1: parseInt(newData.wins1),
        wins2: parseInt(newData.wins2),
        played: 1,
        reported: 1,
      };
      await matchService.create(payload);
      setIsAdding(false);
      fetchResults(1); // Back to first page to see the new entry
    } catch (err) {
      setError("Lisäys epäonnistui.");
    }
  };

  const handleSaveResult = async (data) => {
    try {
      const payload = {
        ...data,
        wins1: parseInt(data.wins1),
        wins2: parseInt(data.wins2),
        player1: data.home,
        player2: data.away,
      };
      await matchService.update(data.id, payload);
      fetchResults(currentPage);
    } catch (err) {
      setError("Tallennus epäonnistui.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Poistetaanko ottelu?")) {
      await matchService.delete(id);
      fetchResults(currentPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!isAdding && (
          <button 
            className="px-6 py-3 bg-orange text-prussian_blue font-bold rounded-md hover:bg-orange-600 transition-colors shadow-md"
            onClick={() => setIsAdding(true)}
          >
            + Lisää uusi ottelu
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <svg className="animate-spin h-8 w-8 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-alabaster_grey-400 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-alabaster_grey-300">
              <thead className="bg-prussian_blue">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">Pvm</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">Koti</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">Vieras</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-orange uppercase tracking-wider">Tulos</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">Turnaus</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-orange uppercase tracking-wider">Toiminnot</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-alabaster_grey-200">
                {/* --- NEW MATCH INLINE FORM --- */}
                {isAdding && (
                  <tr className="bg-green-50 border-b-2 border-green-200 shadow-inner">
                    <td colSpan="6" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h6 className="text-lg font-bold text-green-700">Uusi ottelu</h6>
                        <button onClick={() => setIsAdding(false)} className="text-green-700 hover:text-red-600 font-bold text-xl">&times;</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 space-y-2">
                          <label className="text-xs font-bold text-prussian_blue uppercase">Koti</label>
                          <select
                            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                            value={newData.home}
                            onChange={(e) =>
                              setNewData({ ...newData, home: e.target.value })
                            }
                          >
                            <option value="">Valitse...</option>
                            {players.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-prussian_blue uppercase">W1</label>
                          <input
                            type="number"
                            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                            value={newData.wins1}
                            onChange={(e) =>
                              setNewData({ ...newData, wins1: e.target.value })
                            }
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-xs font-bold text-prussian_blue uppercase">Päivämäärä</label>
                          <input
                            type="date"
                            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                            value={newData.game_date}
                            onChange={(e) =>
                              setNewData({
                                ...newData,
                                game_date: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-xs font-bold text-prussian_blue uppercase">Turnaus</label>
                          <select
                            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                            value={newData.tournament_id}
                            onChange={(e) =>
                              setNewData({
                                ...newData,
                                tournament_id: e.target.value,
                              })
                            }
                          >
                            <option value="">Ranking</option>
                            {opens.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-4 space-y-2">
                          <label className="text-xs font-bold text-prussian_blue uppercase">Vieras</label>
                          <select
                            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                            value={newData.away}
                            onChange={(e) =>
                              setNewData({ ...newData, away: e.target.value })
                            }
                          >
                            <option value="">Valitse...</option>
                            {players.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-prussian_blue uppercase">W2</label>
                          <input
                            type="number"
                            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                            value={newData.wins2}
                            onChange={(e) =>
                              setNewData({ ...newData, wins2: e.target.value })
                            }
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-xs font-bold text-prussian_blue uppercase">Lisätiedot</label>
                          <input
                            type="text"
                            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                            placeholder="6-0, 6-2"
                            value={newData.result}
                            onChange={(e) =>
                              setNewData({ ...newData, result: e.target.value })
                            }
                          />
                        </div>
                        <div className="md:col-span-3 flex items-end">
                          <button
                            onClick={handleCreateMatch}
                            className="w-full px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors shadow-md"
                          >
                            Tallenna ottelu
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* --- EXISTING RESULTS --- */}
                {results.map((r) => (
                  <ResultRow
                    key={r.id}
                    result={r}
                    players={players}
                    opens={opens}
                    onSave={handleSaveResult}
                    onDelete={handleDelete}
                  />
                ))}
                {results.length === 0 && !isAdding && (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-alabaster_grey-300 italic">Ei tuloksia löydetty.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-alabaster_grey-400 bg-white text-sm font-medium text-black-700 hover:bg-alabaster_grey-500 disabled:opacity-50"
                >
                  «
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => setCurrentPage(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-alabaster_grey-400 text-sm font-medium transition-colors ${
                      page + 1 === currentPage
                        ? "z-10 bg-orange border-orange text-prussian_blue"
                        : "bg-white text-black-700 hover:bg-alabaster_grey-500"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-alabaster_grey-400 bg-white text-sm font-medium text-black-700 hover:bg-alabaster_grey-500 disabled:opacity-50"
                >
                  »
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminResults;
