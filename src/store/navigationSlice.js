import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeItem: localStorage.getItem('lastVisitedPage') || 'dashboard',
  lastVisitedPage: localStorage.getItem('lastVisitedPage') || 'dashboard',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      state.activeItem = action.payload;
      state.lastVisitedPage = action.payload;
      localStorage.setItem('lastVisitedPage', action.payload);
    },
    restoreLastVisitedPage: (state) => {
      const lastPage = localStorage.getItem('lastVisitedPage') || 'dashboard';
      state.activeItem = lastPage;
      state.lastVisitedPage = lastPage;
    },
  },
});

export const { setActivePage, restoreLastVisitedPage } = navigationSlice.actions;
export default navigationSlice.reducer;