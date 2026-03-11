import React, { useState, useEffect } from "react";
import {
  openService,
  matchService,
  playerService,
} from "../../services/dataService";

const MatchRow = ({ match, players, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Local state for editing
  const [editData, setEditData] = useState({
    player1: match.player1,
    player2: match.player2,
    wins1: match.wins1,
    wins2: match.wins2,
    game_date: match.game_date || "",
    result: match.result || "", // For the "6-0, 6-3" details
    tournament_id: match.tournament_id || null,
  });

  const handleSave = async () => {
    await onSave(match.id, editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="bg-alabaster_grey-800">
        <td colSpan="5" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold text-prussian_blue uppercase">Pelaaja 1</label>
              <select
                className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                value={editData.player1}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    player1: parseInt(e.target.value),
                  })
                }
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-prussian_blue uppercase">Erät</label>
              <input
                type="number"
                className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                placeholder="Wins"
                value={editData.wins1}
                onChange={(e) =>
                  setEditData({ ...editData, wins1: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="md:col-span-5 space-y-2">
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

            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold text-prussian_blue uppercase">Pelaaja 2</label>
              <select
                className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                value={editData.player2}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    player2: parseInt(e.target.value),
                  })
                }
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-prussian_blue uppercase">Erät</label>
              <input
                type="number"
                className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                placeholder="Wins"
                value={editData.wins2}
                onChange={(e) =>
                  setEditData({ ...editData, wins2: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-prussian_blue uppercase">Tarkka tulos</label>
              <input
                type="text"
                className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md text-sm"
                placeholder="Esim. 6-0, 6-3"
                value={editData.result}
                onChange={(e) =>
                  setEditData({ ...editData, result: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-colors"
              >
                Tallenna
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 bg-alabaster_grey-400 text-black text-sm font-bold rounded hover:bg-alabaster_grey-500 transition-colors"
              >
                X
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  // Normal View Mode
  return (
    <tr className="hover:bg-alabaster_grey-800 transition-colors border-b border-alabaster_grey-200">
      <td className="px-4 py-3 text-black-700 text-sm">
        {match.game_date}
      </td>
      <td className="px-4 py-3">
        <div className="font-bold text-black">{match.homename}</div>
        <div className="text-black-700 text-sm">{match.awayname}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center justify-center bg-prussian_blue text-white text-xs font-bold px-2 py-0.5 rounded w-6">
            {match.wins1}
          </span>
          <span className="inline-flex items-center justify-center bg-alabaster_grey-500 text-black text-xs font-bold px-2 py-0.5 rounded w-6 border border-alabaster_grey-400">
            {match.wins2}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-black-700 italic">
        {match.result?.split("\\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => setIsEditing(true)}
          className="text-prussian_blue hover:text-orange text-sm font-bold transition-colors"
        >
          Muokkaa
        </button>
      </td>
    </tr>
  );
};

// --- MAIN COMPONENT ---
const AdminOpens = () => {
  const [opens, setOpens] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedOpenId, setSelectedOpenId] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    year: 2025,
    active: false,
    ended: false,
  });
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [tournamentGames, setTournamentGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);

  const years = [2024, 2025, 2026, 2027];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [o, p] = await Promise.all([
        openService.getAll(),
        playerService.getAll(),
      ]);
      setOpens(o || []);
      setPlayers(p || []);
    } catch (err) {
      console.error("Datan haku epäonnistui:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const val = e.target.value;
    setSelectedOpenId(val);
    const selected = opens.find((o) => o.id.toString() === val);
    if (selected) {
      setFormData({
        ...selected,
        active: !!selected.active,
        ended: !!selected.ended,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        year: 2025,
        active: false,
        ended: false,
      });
    }
  };

  const fetchTournamentGames = async () => {
    if (!selectedOpenId) return;
    setGamesLoading(true);
    try {
      const data = await openService.getMatches(selectedOpenId);
      const gamesArray = data.matches || [];
      setTournamentGames(gamesArray);
    } catch (err) {
      console.error("Haku epäonnistui:", err);
      setTournamentGames([]);
    } finally {
      setGamesLoading(false);
    }
  };

  const handleSaveMatch = async (matchId, updatedData) => {
    try {
      await matchService.update(matchId, updatedData);
      fetchTournamentGames();
    } catch {
      alert("Tallennus epäonnistui.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <svg className="animate-spin h-8 w-8 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-lg border border-alabaster_grey-400 shadow-sm space-y-4">
            <label className="block text-sm font-bold text-prussian_blue">Valitse turnaus</label>
            <select 
              className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange sm:text-sm"
              value={selectedOpenId} 
              onChange={handleSelectChange}
            >
              <option value="">+ Luo uusi...</option>
              {opens.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.year} - {o.name}
                </option>
              ))}
            </select>
            {selectedOpenId && (
              <button
                className="w-full mt-4 px-4 py-3 bg-prussian_blue text-orange font-bold rounded-md hover:bg-prussian_blue-600 transition-colors shadow-md"
                onClick={() => {
                  fetchTournamentGames();
                  setShowGamesModal(true);
                }}
              >
                Muokkaa ottelukaaviota
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg border border-alabaster_grey-400 shadow-sm overflow-hidden">
            <div className={`px-6 py-4 text-white font-bold ${formData.id ? "bg-prussian_blue" : "bg-green-600"}`}>
              {formData.id ? "Muokkaa turnausta" : "Uusi turnaus"}
            </div>
            <div className="p-6">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  formData.id
                    ? await openService.update(formData.id, formData)
                    : await openService.create(formData);
                  fetchInitialData();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-prussian_blue mb-2">Nimi</label>
                  <input
                    className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange sm:text-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-prussian_blue mb-2">Vuosi</label>
                  <select
                    className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange sm:text-sm"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-6 py-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-orange border-alabaster_grey-400 rounded"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                    />
                    <span className="ml-2 text-sm font-medium text-black">Käynnissä</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-orange border-alabaster_grey-400 rounded"
                      checked={formData.ended}
                      onChange={(e) =>
                        setFormData({ ...formData, ended: e.target.checked })
                      }
                    />
                    <span className="ml-2 text-sm font-medium text-black">Päätetty</span>
                  </label>
                </div>
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 bg-orange text-prussian_blue font-bold rounded-md hover:bg-orange-600 transition-colors shadow-md mt-4"
                >
                  Tallenna turnaus
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Modal for Games */}
      {showGamesModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowGamesModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-prussian_blue px-6 py-4 flex justify-between items-center border-b border-orange">
                <h3 className="text-xl font-bold text-white" id="modal-title">Ottelut: {formData.name}</h3>
                <button onClick={() => setShowGamesModal(false)} className="text-white hover:text-orange text-2xl font-bold">&times;</button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
                {gamesLoading ? (
                  <div className="flex justify-center p-12">
                    <svg className="animate-spin h-8 w-8 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-alabaster_grey-300">
                      <thead className="bg-alabaster_grey-800">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-bold text-prussian_blue uppercase tracking-wider">Pvm</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-prussian_blue uppercase tracking-wider">Pelaajat</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-prussian_blue uppercase tracking-wider">Tulos</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-prussian_blue uppercase tracking-wider">Lisätiedot</th>
                          <th className="px-4 py-2 text-right text-xs font-bold text-prussian_blue uppercase tracking-wider">Toiminnot</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-alabaster_grey-200">
                        {tournamentGames?.map((g) => (
                          <MatchRow
                            key={g.id}
                            match={g}
                            players={players}
                            onSave={handleSaveMatch}
                          />
                        ))}
                        {tournamentGames?.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-alabaster_grey-300 italic">Ei otteluita löydetty.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="bg-alabaster_grey-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-alabaster_grey-400">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-alabaster_grey-400 shadow-sm px-4 py-2 bg-white text-base font-medium text-black hover:bg-alabaster_grey-500 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowGamesModal(false)}
                >
                  Sulje
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOpens;
