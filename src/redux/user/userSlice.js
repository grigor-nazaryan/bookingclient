import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
	error: null,
	loading: false,
	token: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const accessToken = action.payload
			state.token = accessToken
		},
		signUpStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		signUpSuccess: (state) => {
			state.loading = false;
			state.error = null;
		},
		signUpFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		loginStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		loginSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		loginFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		updateStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		updateSuccess: (state, action) => {
			state.currentUser = { ...state.currentUser, ...action.payload };
			state.loading = false;
			state.error = null;
		},
		updateFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		signoutSuccess: (state) => {
			state.currentUser = null;
			state.token = null
			state.error = null;
			state.loading = false;
		},
		checkAuthStart: (state) => {
			state.isCheckingAuth = true
			state.error = null
		},
		checkAuthSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.isCheckingAuth = false
			state.isAuthenticated = true
		},
		checkAuthFailure: (state) => {
			state.isCheckingAuth = false
			state.isAuthenticated = false
			state.error = null
		},
		forgotPasswordStart: (state) => {
			state.isSubmitted = false
			state.loading = true;
			state.error = null;
		},
		forgotPasswordSuccess: (state) => {
			state.isSubmitted = true
			state.loading = false;
			state.error = null;
		},
		forgotPasswordFailure: (state, action) => {
			state.isSubmitted = false
			state.loading = false;
			state.error = action.payload;
		},
		resetPasswordStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		resetPasswordSuccess: (state) => {
			state.loading = false;
			state.error = null;
		},
		resetPasswordFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const {
	signUpStart,
	signUpSuccess,
	signUpFailure,
	loginStart,
	loginSuccess,
	loginFailure,
	setCredentials,
	updateStart,
	updateSuccess,
	updateFailure,
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
	signoutSuccess,
	checkAuthStart,
	checkAuthSuccess,
	checkAuthFailure,
	forgotPasswordStart,
	forgotPasswordSuccess,
	forgotPasswordFailure,
	resetPasswordStart,
	resetPasswordSuccess,
	resetPasswordFailure,
} = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentToken = (state) => state.user.token