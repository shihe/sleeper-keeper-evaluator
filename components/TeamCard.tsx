
import React, { useState, useMemo } from 'react';
import { TeamData, DraftPick } from '../types';
import { PlayerItem, calculatePlayerValueDelta } from './PlayerItem';
import { DraftPickItem } from './DraftPickItem';
import { TeamAnalysis } from './TeamAnalysis';

interface TeamCardProps {
  team: TeamData;
  keeperCost: number;
  undraftedPenalty: number;
  adpType: string;
  sortBy: 'position' | 'value';
  playerPercentiles: Record<string, number>;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, keeperCost, undraftedPenalty, adpType, sortBy, playerPercentiles }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const defaultAvatar = `https://sleepercdn.com/avatars/default_avatar.png`;

  const draftPicksByYear = team.draft_picks.reduce((acc, pick) => {
    if (!acc[pick.year]) {
      acc[pick.year] = [];
    }
    acc[pick.year].push(pick);
    return acc;
  }, {} as Record<string, DraftPick[]>);

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
        <div className="flex items-center gap-4 mb-4">
          <img
            src={team.owner?.avatar ? `https://sleepercdn.com/avatars/${team.owner.avatar}` : defaultAvatar}
            alt={team.owner?.display_name || 'Owner'}
            className="w-16 h-16 rounded-full border-2 border-slate-600"
          />
          <div>
            <h3 className="text-xl font-bold text-slate-100">{team.owner?.display_name || 'Unknown Owner'}</h3>
            <p className="text-sm text-slate-400">@{team.owner?.username || 'N/A'}</p>
          </div>
        </div>

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
      </div>
      <div className="bg-slate-900/50 px-5 py-3">
        {showAnalysis ? (
           <TeamAnalysis roster={team.roster} picks={team.draft_picks} onCollapse={() => setShowAnalysis(false)} />
        ) : (
          <button 
            onClick={() => setShowAnalysis(true)}
            className="w-full text-center text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
          >
            Show AI Analysis ✨
          </button>
        )}
      </div>
    </div>
  );
};
