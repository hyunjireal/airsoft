import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  joinedMatchIds: string[]
  followedCreatorIds: string[]
  toggleMatchJoin: (matchId: string) => void
  toggleCreatorFollow: (creatorId: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      joinedMatchIds: ['match-001'],
      followedCreatorIds: ['creator-001'],
      toggleMatchJoin: (matchId) =>
        set((state) => ({
          joinedMatchIds: state.joinedMatchIds.includes(matchId)
            ? state.joinedMatchIds.filter((id) => id !== matchId)
            : [...state.joinedMatchIds, matchId],
        })),
      toggleCreatorFollow: (creatorId) =>
        set((state) => ({
          followedCreatorIds: state.followedCreatorIds.includes(creatorId)
            ? state.followedCreatorIds.filter((id) => id !== creatorId)
            : [...state.followedCreatorIds, creatorId],
        })),
    }),
    {
      name: 'airsoft-wireframe-store',
    },
  ),
)
