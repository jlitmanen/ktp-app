import React, { useState, useEffect } from "react";
import { playerService } from "../../services/dataService";

const AdminRanking = () => {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await playerService.getAll();
      setPlayers(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Pelaajien haku epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = () => {
    setEditingPlayer({ name: "" });
    setIsEditing(true);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer({ ...player });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingPlayer.id) {
        await playerService.update(editingPlayer.id, editingPlayer);
      } else {
        await playerService.create(editingPlayer);
      }
      setIsEditing(false);
      setEditingPlayer(null);
      fetchPlayers(); // Refresh list
    } catch (err) {
      console.error("Error saving player:", err);
      setError("Tallennus epäonnistui.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Haluatko varmasti poistaa pelaajan?")) {
      try {
        await playerService.delete(id);
        fetchPlayers();
      } catch (err) {
        console.error("Error deleting player:", err);
        setError("Poisto epäonnistui.");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPlayer(null);
  };

  if (loading && !isEditing) {
    return (
      <div className="flex justify-center p-12">
        <svg className="animate-spin h-8 w-8 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-lg border border-alabaster_grey-400 shadow-sm overflow-hidden">
          <div className="bg-prussian_blue px-6 py-4 border-b border-orange">
            <h3 className="text-xl font-bold text-white">
              {editingPlayer?.id ? "Muokkaa pelaajaa" : "Luo uusi pelaaja"}
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-prussian_blue mb-2">Nimi</label>
                <input
                  type="text"
                  className="block w-full px-4 py-3 bg-white border border-alabaster_grey-400 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange text-lg"
                  placeholder="Syötä nimi"
                  value={editingPlayer?.name || ""}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-3 mt-8">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-orange text-prussian_blue font-bold rounded-md hover:bg-orange-600 transition-colors shadow-md"
                >
                  Tallenna
                </button>
                <button
                  type="button"
                  className="w-full px-6 py-3 border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 transition-colors"
                  onClick={handleCancel}
                >
                  Peruuta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
        </div>
      )}

      <div className="overflow-x-auto border border-alabaster_grey-400 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-alabaster_grey-300">
          <thead className="bg-prussian_blue">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">Nimi</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-orange uppercase tracking-wider" style={{ width: "150px" }}>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded text-xs transition-colors"
                  onClick={handleAddPlayer}
                >
                  Lisää uusi
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-alabaster_grey-200">
            {players.length > 0 ? (
              players.map((player) => (
                <tr key={player.id} className="hover:bg-alabaster_grey-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{player.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-prussian_blue hover:text-orange transition-colors font-bold"
                        onClick={() => handleEditPlayer(player)}
                      >
                        Muokkaa
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors font-bold"
                        onClick={() => handleDelete(player.id)}
                      >
                        Poista
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-10 text-center text-alabaster_grey-300 italic">
                  Ei pelaajia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRanking;
