import React, { useState, useEffect } from "react";
import { openService } from "../services/dataService";

const Match = ({ match }) => {
  const homeName = match.home || "N/A";
  const awayName = match.away || "N/A";

  return (
    <div className="bg-white border border-alabaster_grey-400 rounded-md shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between border-b border-alabaster_grey-200 p-2">
        <span className="text-sm font-medium text-black truncate flex-grow mr-2" title={homeName}>{homeName}</span>
        <span className="bg-prussian_blue text-white text-xs font-bold px-2 py-1 rounded min-w-[1.5rem] text-center">{match.wins1 ?? 0}</span>
      </div>
      <div className="flex items-center justify-between p-2">
        <span className="text-sm font-medium text-black truncate flex-grow mr-2" title={awayName}>{awayName}</span>
        <span className="bg-prussian_blue text-white text-xs font-bold px-2 py-1 rounded min-w-[1.5rem] text-center">{match.wins2 ?? 0}</span>
      </div>
    </div>
  );
};

const Open = () => {
  const [opens, setOpens] = useState([]);
  const [selectedOpenId, setSelectedOpenId] = useState("");
  const [currentOpen, setCurrentOpen] = useState(null);
  const [openMatches, setOpenMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpens = async () => {
      try {
        setLoading(true);
        const data = await openService.getAll();
        setOpens(data || []);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Turnausten haku epäonnistui.");
      } finally {
        setLoading(false);
      }
    };
    fetchOpens();
  }, []);

  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!selectedOpenId) {
        setCurrentOpen(null);
        setOpenMatches([]);
        return;
      }

      try {
        setMatchesLoading(true);
        const data = await openService.getMatches(selectedOpenId);
        setCurrentOpen(data.tournament);
        setOpenMatches(data.matches || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching tournament matches:", err);
        setError("Turnauksen tietojen haku epäonnistui.");
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchTournamentData();
  }, [selectedOpenId]);

  const handleOpenChange = (e) => {
    setSelectedOpenId(e.target.value);
  };

  const years = [2026, 2025, 2024, 2023, 2022];

  const getRounds = () => {
    const rounds = {
      1: [], // 1/4 Final (matches 0-3)
      2: [], // Semifinal (matches 4-5)
      3: [], // Final (matches 6+)
    };

    openMatches.forEach((match, idx) => {
      if (idx < 4) rounds[1].push(match);
      else if (idx < 6) rounds[2].push(match);
      else rounds[3].push(match);
    });

    return rounds;
  };

  const rounds = getRounds();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <svg className="animate-spin h-10 w-10 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-prussian_blue font-medium">Ladataan turnauksia...</p>
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

      <div className="w-full max-w-md">
        <label htmlFor="tournament-select" className="block text-sm font-bold text-prussian_blue mb-2">Valitse turnaus</label>
        <select
          id="tournament-select"
          className="block w-full px-3 py-2 bg-white border border-alabaster_grey-400 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange sm:text-sm"
          value={selectedOpenId}
          onChange={handleOpenChange}
        >
          <option value="" disabled={selectedOpenId !== ""}>
            Valitse turnaus...
          </option>
          {years.map((year) => {
            const yearOpens = opens.filter((open) => open.year === year);
            if (yearOpens.length === 0) return null;
            return (
              <optgroup key={year} label={year.toString()} className="font-bold">
                {yearOpens.map((open) => (
                  <option key={open.id} value={open.id}>
                    {open.name} {open.year}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>

      {matchesLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <svg className="animate-spin h-8 w-8 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-prussian_blue">Ladataan kaaviota...</p>
        </div>
      ) : openMatches.length > 0 ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold text-prussian_blue text-center">
            {currentOpen?.name} {currentOpen?.year}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {Object.keys(rounds).map((roundKey) => (
              <div key={roundKey} className="flex flex-col">
                <div className="bg-prussian_blue text-orange text-center py-3 rounded-t-lg shadow-md border-b-2 border-orange font-bold uppercase tracking-wider">
                  {roundKey === "1" && "1/4 Finaali"}
                  {roundKey === "2" && "Semifinaali"}
                  {roundKey === "3" && "Finaali"}
                </div>
                <div className="bg-alabaster_grey-800 p-4 rounded-b-lg flex-grow flex flex-col justify-around min-h-[10rem] shadow-sm">
                  {rounds[roundKey].length > 0 ? (
                    rounds[roundKey].map((match) => (
                      <Match key={match.id} match={match} />
                    ))
                  ) : (
                    <div className="text-center text-alabaster_grey-300 italic p-3 text-sm">
                      Ei otteluita tässä vaiheessa
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedOpenId === "" ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Info</p>
          <p>Valitse turnaus nähdäksesi kaavion.</p>
        </div>
      ) : (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
          <p className="font-bold">Huomio</p>
          <p>Turnaus ei ole vielä alkanut tai otteluita ei ole asetettu.</p>
        </div>
      )}
    </div>
  );
};

export default Open;
