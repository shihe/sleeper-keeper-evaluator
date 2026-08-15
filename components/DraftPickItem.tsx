
import React from 'react';
import { DraftPick } from '../types';

interface DraftPickItemProps {
  pick: DraftPick;
}

const getRoundOrdinal = (round: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = round % 100;
    return round + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const DraftPickItem: React.FC<DraftPickItemProps> = ({ pick }) => {
  return (
    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs font-medium rounded-full">
      {getRoundOrdinal(pick.round)}
    </span>
  );
};
