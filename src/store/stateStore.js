import { create } from 'zustand'

export const useStateStore = create((set) => ({
  onDashBoard: false,
  setOnDashboard: () => set((state) => ({ onDashBoard: !state.onDashBoard })),
  //removeAllBears: () => set({ bears: 0 }),
//   set: (newBears) => set({ bears: newBears }),
}))
