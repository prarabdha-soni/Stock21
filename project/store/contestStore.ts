// store/contestStore.ts
import { create } from 'zustand';

interface Contest {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  totalSpots: number;
  spotsLeft: number;
  startTime: string;
  guaranteed: boolean;
  maxTeams: number;
  firstPrize: number;
  winnerPercentage: number;
}

interface ContestStore {
  joinedContests: Contest[];
  joinContest: (contest: Contest) => void;
}

export const useContestStore = create<ContestStore>((set) => ({
  joinedContests: [],
  joinContest: (contest) => set((state) => ({
    joinedContests: [...state.joinedContests, contest]
  })),
}));