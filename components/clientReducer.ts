import { createSlice } from "@reduxjs/toolkit"

// create a slice 
export const clientSlice = createSlice({
  name: "clientCredentials",
  initialState: {
    network: 'mainnet',
    accountId: '',
    privateKey: ''
  },
  reducers: {
    setNetwork: (state, action) => {
      state.network = action.payload;
    },
    setAccountId: (state, action) => {
      state.accountId = action.payload;
    },
    setPrivateKey: (state, action) => {
      state.privateKey = action.payload;
    },
  }
});
