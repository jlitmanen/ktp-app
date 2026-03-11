import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { matchService, playerService } from "../services/dataService";

const Results = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page) || 1;

  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedPid, setSelectedPid] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await playerService.getAll();
        setPlayers(data || []);
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await matchService.getResults(currentPage, selectedPid, showAll);
        setResults(data.items || []);
        setTotalPages(data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Tulosten haku epäonnistui. Tarkista yhteys palvelimeen.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [currentPage, selectedPid, showAll]);

  const handlePlayerChange = (e) => {
    setSelectedPid(e.target.value);
    navigate("/results/1");
  };

  const handleShowAllChange = (e) => {
    setShowAll(e.target.checked);
    navigate("/results/1");
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      navigate(`/results/${pageNumber}`);
    }
  };

  const renderPagination = () => {
    const items = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // First
    items.push(
      <button
        key="first"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-alabaster_grey-400 bg-white text-sm font-medium text-black-700 hover:bg-alabaster_grey-500 disabled:opacity-50"
      >
        «
      </button>,
    );

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`relative inline-flex items-center px-4 py-2 border border-alabaster_grey-400 text-sm font-medium transition-colors ${
            number === currentPage
              ? "z-10 bg-orange border-orange text-prussian_blue"
              : "bg-white text-black-700 hover:bg-alabaster_grey-500"
          }`}
        >
          {number}
        </button>,
      );
    }

    // Last
    items.push(
      <button
        key="last"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-alabaster_grey-400 bg-white text-sm font-medium text-black-700 hover:bg-alabaster_grey-500 disabled:opacity-50"
      >
        »
      </button>,
    );

    return items;
  };

  if (loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <svg
          className="animate-spin h-10 w-10 text-orange"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-prussian_blue font-medium">
          Ladataan tuloksia...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-prussian_blue">
        Ottelutulokset
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6 items-end">
        <div className="w-full max-w-md">
          <label
            htmlFor="player-filter"
            className="block text-sm font-bold text-prussian_blue mb-2"
          >
            Suodata pelaajan mukaan
          </label>
          <select
            id="player-filter"
            className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange sm:text-sm"
            value={selectedPid}
            onChange={handlePlayerChange}
          >
            <option value="">Kaikki pelaajat</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center mb-2">
          <input
            id="show-all"
            type="checkbox"
            className="h-4 w-4 text-orange border-alabaster_grey-400 rounded focus:ring-orange"
            checked={showAll}
            onChange={handleShowAllChange}
          />
          <label
            htmlFor="show-all"
            className="ml-2 block text-sm font-bold text-prussian_blue"
          >
            Näytä kaikki ottelut
          </label>
        </div>
      </div>

      <div className="overflow-x-auto border border-alabaster_grey-400 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-alabaster_grey-300">
          <thead className="bg-prussian_blue">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">
                Päivämäärä
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">
                Ottelu
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">
                Tulos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-alabaster_grey-200">
            {results.length > 0 ? (
              results.map((c, index) => (
                <React.Fragment key={c.id || index}>
                  <tr
                    onClick={() => toggleRow(c.id || index)}
                    className="hover:bg-alabaster_grey-800 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700">
                      {c.date || c.game_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {c.homename} - {c.awayname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-prussian_blue">
                      {c.res || `${c.wins1}-${c.wins2}`}
                    </td>
                  </tr>
                  {expandedRow === (c.id || index) && (
                    <tr className="bg-alabaster_grey-900 fade-in">
                      <td colSpan="3" className="px-6 py-4">
                        <div className="text-sm">
                          <strong className="text-prussian_blue">
                            Lisätiedot:
                          </strong>
                          <div
                            className="mt-2 text-black prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: c.result || "Ei lisätietoja",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-10 text-center text-alabaster_grey-300 italic"
                >
                  Ei tuloksia löytynyt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {renderPagination()}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Results;
