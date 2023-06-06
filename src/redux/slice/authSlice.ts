import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkLoginStatus } from '../../helpers/auth';

const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        token: localStorage.getItem('token'),
        isAuthenticated: checkLoginStatus(),
    },
    reducers: {
        setAuthentication(state) {
            state.isAuthenticated = true;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token =  action.payload;
        },
        removeAuthentication(state) {
            state.isAuthenticated = false;
        },
        removeTokenFromState(state) {
            state.token =  '';
        },
    }
});

export default authSlice.reducer;
export const {
    setAuthentication,
    setToken,
    removeAuthentication,
    removeTokenFromState,
} = authSlice.actions;
