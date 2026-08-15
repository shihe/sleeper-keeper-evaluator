
import React from 'react';
import { Player } from '../types';

interface PlayerItemProps {
  player: Player;
  totalTeams?: number;
  totalDraftRounds?: number;
  keeperCost?: number;
  undraftedPenalty?: number;
  adpType?: string;
  percentile?: number;
}

export function calculatePlayerValueDelta(
  player: Player,
  totalTeams: number | undefined,
  totalDraftRounds: number | undefined,
  keeperCost: number,
  undraftedPenalty: number,
  adpType: string
): number {
  const currentAdp = player.adps ? player.adps[adpType as keyof typeof player.adps] : player.adp;
  
  if (!currentAdp || !totalTeams) return -9999; // Missing ADP gets pushed to the bottom

  let effectiveDraftRound = player.draftRound;
  let isUndrafted = !effectiveDraftRound;
  
  // Treat undrafted players as one round after the draft concludes
  if (isUndrafted && totalDraftRounds) {
    effectiveDraftRound = totalDraftRounds + 1;
  }

  if (!effectiveDraftRound) return -9999;

  const penaltyToApply = isUndrafted ? undraftedPenalty : keeperCost;
  const keeperDraftRound = effectiveDraftRound - penaltyToApply;
  if (keeperDraftRound <= 0) return -9999; // Ineligible players get pushed to bottom

  const firstPick = (keeperDraftRound - 1) * totalTeams + 1;
  const lastPick = keeperDraftRound * totalTeams;
  const draftPos = (firstPick + lastPick) / 2;
  
  return Math.sqrt(draftPos) - Math.sqrt(currentAdp);
}

export const PlayerItem: React.FC<PlayerItemProps> = ({ player, totalTeams, totalDraftRounds, keeperCost = 0, undraftedPenalty = 0, adpType = 'half_ppr', percentile }) => {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-500/20 text-red-300';
      case 'RB': return 'bg-green-500/20 text-green-300';
      case 'WR': return 'bg-blue-500/20 text-blue-300';
      case 'TE': return 'bg-orange-500/20 text-orange-300';
      case 'DEF': return 'bg-purple-500/20 text-purple-300';
      case 'K': return 'bg-teal-500/20 text-teal-300';
      default: return 'bg-slate-600 text-slate-300';
    }
  }

  let bgColor = 'bg-slate-700/50';
  let isKeepable = true;
  let keeperDraftRound = player.draftRound;
  
  const currentAdp = player.adps ? player.adps[adpType as keyof typeof player.adps] : player.adp;
  
  let effectiveDraftRound = player.draftRound;
  let isUndrafted = !effectiveDraftRound;
  
  // Treat undrafted players as one round after the draft concludes
  if (isUndrafted && totalDraftRounds) {
    effectiveDraftRound = totalDraftRounds + 1;
  }

  const penaltyToApply = isUndrafted ? undraftedPenalty : keeperCost;

  if (effectiveDraftRound) {
    keeperDraftRound = effectiveDraftRound - penaltyToApply;
    if (keeperDraftRound <= 0) {
      isKeepable = false;
      bgColor = 'bg-slate-800/30 opacity-50 border-slate-700/30 grayscale';
    }
  }

  if (!currentAdp) {
    bgColor = 'bg-slate-800/30 opacity-50 border-slate-700/30 grayscale';
  } else if (isKeepable && totalTeams && keeperDraftRound && keeperDraftRound > 0) {
    const diff = calculatePlayerValueDelta(player, totalTeams, totalDraftRounds, keeperCost, undraftedPenalty, adpType);
    
    // Color gradient based on value delta
    if (diff >= 2.0) {
      bgColor = 'bg-green-600/20 border-green-600/40'; // Green
    } else if (diff >= 0.75) {
      bgColor = 'bg-lime-600/20 border-lime-600/40'; // Green-Yellow (Lime)
    } else if (diff >= -0.25) {
      bgColor = 'bg-yellow-600/20 border-yellow-600/40'; // Yellow
    } else if (diff >= -1.25) {
      bgColor = 'bg-orange-600/20 border-orange-600/40'; // Orange
    } else {
      bgColor = 'bg-red-600/20 border-red-600/40'; // Red
    }
  }

  return (
    <div className={`flex items-center justify-between p-2 rounded-md text-sm border border-transparent transition-all ${bgColor}`}>
      <div className="flex min-w-0 items-center gap-2">
         <span className={`flex-shrink-0 w-8 text-center text-xs font-bold rounded-sm py-0.5 ${getPositionColor(player.position)}`}>
           {player.position}
         </span>
        <span className="font-medium text-slate-200 truncate">{player.name}</span>
        {player.draftRound ? (
            <span
              className="flex-shrink-0 text-xs text-cyan-400/80 font-mono"
              title={keeperCost > 0 ? `Original Draft Round ${player.draftRound} - Penalty ${keeperCost}` : `Drafted Round ${player.draftRound}`}
            >
              (R{player.draftRound}{keeperCost > 0 ? `→${keeperDraftRound}` : ''})
            </span>
        ) : (
            <span
              className="flex-shrink-0 text-xs text-slate-400 font-mono"
              title={undraftedPenalty > 0 ? `Undrafted (treated as R${totalDraftRounds ? totalDraftRounds + 1 : 'N/A'}) - Penalty ${undraftedPenalty}` : `Undrafted`}
            >
              (UD{undraftedPenalty > 0 ? `→${keeperDraftRound}` : ''})
            </span>
        )}
        {!isKeepable && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400/80 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-900/50 ml-1">
            INELIGIBLE
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {currentAdp ? (
          <span className="text-xs text-slate-400 font-mono" title="Current ADP">
            ADP: {currentAdp.toFixed(1)}
          </span>
        ) : null}
        <span className="pl-1 text-slate-400 text-sm mr-1">{player.team}</span>
        {percentile !== undefined && (
          <span 
            className="flex items-center justify-center min-w-[32px] h-6 px-1.5 rounded bg-slate-900/60 border border-slate-700/50 text-[11px] font-bold text-slate-300"
            title="Overall Value Percentile"
          >
            {percentile}%
          </span>
        )}
      </div>
    </div>
  );
};
