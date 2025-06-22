import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";

export default function main() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route element={<RedirectAuthenticatedUser />}>
					<Route path="/login" element={<Login />} />
				</Route>
				<Route element={<RedirectAuthenticatedUser />}>
					<Route path="/sign-up" element={<SignUp />} />
				</Route>
				<Route path="/forgot-password" element={<ForgotPassword />}></Route>
				<Route path="/reset-password/:token" element={<ResetPassword />}></Route>
				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
			</Routes>
			<Toaster />
		</BrowserRouter>
	);
}
