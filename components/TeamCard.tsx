
import React, { useState, useMemo } from 'react';
import { TeamData, DraftPick } from '../types';
import { PlayerItem, calculatePlayerValueDelta } from './PlayerItem';
import { DraftPickItem } from './DraftPickItem';

interface TeamCardProps {
  team: TeamData;
  keeperCost: number;
  undraftedPenalty: number;
  adpType: string;
  sortBy: 'position' | 'value';
  playerPercentiles: Record<string, number>;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, keeperCost, undraftedPenalty, adpType, sortBy, playerPercentiles }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < 768);
  const defaultAvatar = `https://sleepercdn.com/avatars/default_avatar.png`;

  const draftPicksByYear = team.draft_picks.reduce((acc, pick) => {
    if (!acc[pick.year]) {
      acc[pick.year] = [];
    }
    acc[pick.year].push(pick);
    return acc;
  }, {} as Record<string, DraftPick[]>);

  const previewKeepers = useMemo(() => {
    return [...team.roster].sort((a, b) => {
      const deltaA = calculatePlayerValueDelta(a, team.totalTeams, team.totalDraftRounds, keeperCost, undraftedPenalty, adpType);
      const deltaB = calculatePlayerValueDelta(b, team.totalTeams, team.totalDraftRounds, keeperCost, undraftedPenalty, adpType);
      
      if (deltaA !== deltaB) {
        return deltaB - deltaA; // highest value first
      }
      
      const adpA = a.adps ? a.adps[adpType as keyof typeof a.adps] : a.adp;
      const adpB = b.adps ? b.adps[adpType as keyof typeof b.adps] : b.adp;
      return (adpA || 9999) - (adpB || 9999);
    }).slice(0, 4);
  }, [team.roster, team.totalTeams, team.totalDraftRounds, keeperCost, undraftedPenalty, adpType]);

  const top3AverageValue = useMemo(() => {
    if (previewKeepers.length === 0) return 0;
    const top3 = previewKeepers.slice(0, 3);
    const sum = top3.reduce((total, player) => {
       const percentile = playerPercentiles[player.id];
       return total + (percentile !== undefined ? percentile : 0);
    }, 0);
    return sum / top3.length;
  }, [previewKeepers, playerPercentiles]);

  const sortedRoster = useMemo(() => {
    if (sortBy === 'position') {
      return team.roster;
    }
    
    return [...team.roster].sort((a, b) => {
      const deltaA = calculatePlayerValueDelta(a, team.totalTeams, team.totalDraftRounds, keeperCost, undraftedPenalty, adpType);
      const deltaB = calculatePlayerValueDelta(b, team.totalTeams, team.totalDraftRounds, keeperCost, undraftedPenalty, adpType);
      
      if (deltaA !== deltaB) {
        return deltaB - deltaA; // highest value first
      }
      
      // Tie breaker: overall ADP
      const adpA = a.adps ? a.adps[adpType as keyof typeof a.adps] : a.adp;
      const adpB = b.adps ? b.adps[adpType as keyof typeof b.adps] : b.adp;
      return (adpA || 9999) - (adpB || 9999);
    });
  }, [team.roster, team.totalTeams, team.totalDraftRounds, sortBy, keeperCost, undraftedPenalty, adpType]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-teal-500/50 hover:shadow-teal-500/10">
      <div className="p-5">
        <div 
          className="flex items-center justify-between cursor-pointer group select-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-4">
            <img
              src={team.owner?.avatar ? `https://sleepercdn.com/avatars/${team.owner.avatar}` : defaultAvatar}
              alt={team.owner?.display_name || 'Owner'}
              className="w-16 h-16 rounded-full border-2 border-slate-600"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-300 transition-colors">{team.owner?.display_name || 'Unknown Owner'}</h3>
              <p className="text-sm text-slate-400">@{team.owner?.username || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center mr-2 bg-slate-700/50 rounded-lg px-3 py-1.5 shadow-inner">
              <span className={`text-lg font-bold ${top3AverageValue >= 80 ? 'text-green-400' : top3AverageValue >= 50 ? 'text-teal-400' : top3AverageValue >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {top3AverageValue.toFixed(1)}
              </span>
            </div>
            <button 
              className="text-slate-400 group-hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-700/50 flex-shrink-0" 
              aria-label="Toggle Team Card"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {isCollapsed && previewKeepers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 relative">
             <div className="flex items-center justify-between mb-2 px-1">
                 <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Keepers Preview</h5>
             </div>
             <div className="space-y-1 relative">
                 {previewKeepers.map(player => (
                    <PlayerItem key={player.id} player={player} totalTeams={team.totalTeams} totalDraftRounds={team.totalDraftRounds} keeperCost={keeperCost} undraftedPenalty={undraftedPenalty} adpType={adpType} percentile={playerPercentiles[player.id]} />
                 ))}
                 {team.roster.length > 4 && (
                   <div 
                     className="absolute -bottom-2 left-0 w-full h-24 pointer-events-none z-10 flex items-end justify-center pb-2"
                     style={{ 
                       backdropFilter: 'blur(8px)',
                       WebkitBackdropFilter: 'blur(8px)',
                       WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 80%)',
                       maskImage: 'linear-gradient(to bottom, transparent 10%, black 80%)'
                     }}
                   >
                     <button 
                        className="flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors pointer-events-auto px-4 py-2 rounded-full bg-slate-800/80 shadow-sm border border-slate-700/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCollapsed(false);
                        }}
                      >
                       <span>Expand Roster</span>
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <polyline points="6 9 12 15 18 9"></polyline>
                       </svg>
                     </button>
                   </div>
                 )}
             </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="space-y-5 mt-6">
            <div>
              <h4 className="font-semibold text-teal-400 mb-2">Roster</h4>
              <div className="max-h-150 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
                {sortedRoster.length > 0 ? (
                  sortedRoster.map(player => <PlayerItem key={player.id} player={player} totalTeams={team.totalTeams} totalDraftRounds={team.totalDraftRounds} keeperCost={keeperCost} undraftedPenalty={undraftedPenalty} adpType={adpType} percentile={playerPercentiles[player.id]} />)
                ) : (
                  <p className="text-sm text-slate-500">No players on roster.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">Draft Capital</h4>
              <div className="space-y-2">
                {Object.keys(draftPicksByYear).length > 0 ? (
                  Object.entries(draftPicksByYear).map(([year, picks]) => (
                    <div key={year}>
                      <p className="text-sm font-medium text-slate-300">{year} Picks</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {picks.map((pick, index) => (
                          <DraftPickItem key={`${pick.year}-${pick.round}-${pick.original_owner_id}-${index}`} pick={pick} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No future draft picks.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
