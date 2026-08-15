
export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  players: string[] | null;
}

export interface TradedPick {
  season: string;
  round: number;
  roster_id: number; // original owner
  previous_owner_id: number;
  owner_id: number; // new owner
}

export interface SleeperPlayer {
  player_id: string;
  full_name: string;
  position: string;
  team: string | null;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  team: string | null;
  draftRound?: number;
  adp?: number;
  adps?: {
    std?: number;
    half_ppr?: number;
    ppr?: number;
    superflex?: number;
  };
}

export interface DraftPick {
  year: string;
  round: number;
  original_owner_id: number;
}

export interface TeamData {
  id: number;
  owner: SleeperUser | null;
  roster: Player[];
  draft_picks: DraftPick[];
  totalTeams: number;
  totalDraftRounds?: number;
}

export interface PlayerMap {
  [key: string]: SleeperPlayer;
}
