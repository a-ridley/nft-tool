import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { clientSlice } from '../components/clientReducer';

// config the store 
export const store = configureStore({
  reducer: {
    hederaClient: clientSlice.reducer
  }
});

export type AppStore = ReturnType<typeof store.getState>;

export const actions = {
  hederaClient: clientSlice.actions
};
