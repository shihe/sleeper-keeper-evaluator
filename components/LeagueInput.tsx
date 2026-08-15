
import React from 'react';

interface LeagueInputProps {
  leagueId: string;
  setLeagueId: (id: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  recentLeagues?: string[];
  keeperCost: number;
  setKeeperCost: (cost: number) => void;
  undraftedPenalty: number;
  setUndraftedPenalty: (cost: number) => void;
  adpType: string;
  setAdpType: (type: string) => void;
  sortBy: 'position' | 'value';
  setSortBy: (sort: 'position' | 'value') => void;
}

export const LeagueInput: React.FC<LeagueInputProps> = ({ 
  leagueId, 
  setLeagueId, 
  onFetch, 
  isLoading, 
  recentLeagues = [],
  keeperCost,
  setKeeperCost,
  undraftedPenalty,
  setUndraftedPenalty,
  adpType,
  setAdpType,
  sortBy,
  setSortBy
}) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetch();
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
            placeholder="Enter Sleeper League ID..."
            disabled={isLoading}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-200 placeholder-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-md hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? 'Loading...' : 'Fetch Rosters'}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-sm text-slate-300 font-medium whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'position' | 'value')}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-200 text-sm"
            >
              <option value="value">Value</option>
              <option value="position">Position</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="adpType" className="text-sm text-slate-300 font-medium whitespace-nowrap">
              ADP Type:
            </label>
            <select
              id="adpType"
              value={adpType}
              onChange={(e) => setAdpType(e.target.value)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-200 text-sm"
            >
              <option value="ppr">PPR</option>
              <option value="half_ppr">Half PPR</option>
              <option value="std">Standard</option>
              <option value="superflex">Superflex (2QB)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="keeperCost" className="text-sm text-slate-300 font-medium whitespace-nowrap">
              Keeper Penalty:
            </label>
            <input
              id="keeperCost"
              type="number"
              min="0"
              max="10"
              value={keeperCost}
              onChange={(e) => setKeeperCost(parseInt(e.target.value) || 0)}
              disabled={isLoading}
              className="w-16 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-200 text-sm text-center"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="undraftedPenalty" className="text-sm text-slate-300 font-medium whitespace-nowrap">
              Undrafted Penalty:
            </label>
            <input
              id="undraftedPenalty"
              type="number"
              min="0"
              max="10"
              value={undraftedPenalty}
              onChange={(e) => setUndraftedPenalty(parseInt(e.target.value) || 0)}
              disabled={isLoading}
              className="w-16 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-200 text-sm text-center"
            />
          </div>
        </div>
      </form>

      {recentLeagues.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm justify-center sm:justify-start">
          <span className="text-slate-400">Recent:</span>
          {recentLeagues.map((id) => (
            <button
              key={id}
              onClick={() => {
                setLeagueId(id);
                // We'll let the user click fetch, or we could auto-fetch
              }}
              disabled={isLoading}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-full border border-slate-700 hover:border-cyan-500/50 transition-colors disabled:opacity-50"
            >
              {id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
