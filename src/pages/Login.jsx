import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure, setCredentials } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import axios from "../api/axios";
import loginValidation from "../helpers/validation/loginValidation";
import showErrorMessage from "../helpers/showErrorMessage";
import toast from "react-hot-toast";

const Login = () => {
	const { loading, error: errorMessage } = useSelector((state) => state.user);

	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(loginFailure(null));
	}, [dispatch]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleValidation = () => {
		const validationErrors = loginValidation(formData);
		setErrors(validationErrors);
		return validationErrors;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		const validationErrors = handleValidation(event);

		if (Object.keys(validationErrors).some(key => validationErrors?.[key]?.length > 0)) {
			console.log("validationErrors: ", validationErrors);
			return;
		}

		try {
			dispatch(loginStart());

			const res = await axios.post("/api/auth/login", formData, { withCredentials: true });
			const data = res.data;
			console.log("data: ", data);

			const { user, accessToken } = data.data;
			console.log("user: ", user);
			console.log("accessToken: ", accessToken);

			dispatch(loginSuccess(user));
			dispatch(setCredentials(accessToken));
			navigate("/dashboard?tab=overview");
		} catch (error) {
			const message = showErrorMessage(error);
			toast.error(message, { position: 'bottom-center', style: { fontSize: '1.2rem', color: '#FF0000', backgroundColor: '#ffe6e6', border: '1px solid #FF0000' } });

			dispatch(loginFailure(message));
		}
	};
	return (
		<div className="mt-32 mb-64">
			<div className="flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-24">
				{/* left */}
				<div className="flex-1 md:max-w-xl">
					<Link to="/" className="font-bold dark:text-white text-6xl">
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-lg text-white">
							Booking
						</span>
						Hub
					</Link>
					<p className="mt-8 text-xl">
						Login now to access your personalized dashboard and manage your bookings with ease. Stay organized
						and in control of your schedule.
					</p>
					<p className="mt-8 text-xl">
						<b>Efficient Management:</b> Keep track of all your bookings in one place.
					</p>
				</div>

				{/* right */}
				<div className="flex-1 md:max-w-xl">
					<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
						<div>
							<TextInput type="email" placeholder="Your Email Address" id="email" onChange={handleChange} sizing={"lg"} className="text-lg w-full" style={{ fontSize: '1.5rem' }} />
							{errors?.email?.length > 0 && (
								errors.email.map((error, index) => (
									<p key={index} className='text-red-500 mt-2 text-xs'>
										{error}
									</p>
								))
							)}
						</div>
						<div className='flex flex-col gap-2'>
							<TextInput type="password" placeholder="Password" id="password" onChange={handleChange} sizing="lg" className="text-lg w-full" style={{ fontSize: '1.5rem' }} />
							{errors?.password?.length > 0 && (
								errors.password.map((error, index) => (
									<p key={index} className='text-red-500 mt-2 text-xs'>
										{error}
									</p>
								))
							)}
							<Link to='/forgot-password' className='text-sm text-blue-500 hover:underline ml-auto'>
								Forgot password?
							</Link>
						</div>
						<Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading} className="text-lg py-3 flex items-center justify-center space-x-8 p-2 rounded-md shadow-md bg-white text-white font-semibold hover:bg-gray-100 border-2 border-gray-300 text-lg">
							{loading ? (
								<div className="flex justify-center items-center">
									<Spinner size="lg" />
								</div>
							) : (
								<span className="text-xl">Login</span>
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 text-base mt-6">
						<span>Don't have an account?</span>
						<Link to="/sign-up" className="text-blue-500 hover:underline">
							Sign Up
						</Link>
					</div>

					{errorMessage && (
						<Alert className="mt-6" color="failure" onDismiss={() => dispatch(loginFailure((null)))}>
							<span>{errorMessage}</span>
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
}

export default Login