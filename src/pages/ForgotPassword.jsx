import { useEffect, useState } from "react";

import { MdOutlineEmail } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, TextInput } from "flowbite-react";
import { forgotPasswordFailure, forgotPasswordStart, forgotPasswordSuccess } from "../redux/user/userSlice";
import forgotPasswordValidation from "../helpers/validation/forgotPasswordValidation";
import showErrorMessage from "../helpers/showErrorMessage";
import toast from "react-hot-toast";

import axios from "../api/axios";

const ForgotPassword = () => {
	const { currentUser, error: errorMessage, loading, isSubmitted } = useSelector((state) => state.user);

	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(forgotPasswordFailure(null));
	}, [dispatch]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleValidation = () => {
		const validationErrors = forgotPasswordValidation(formData);
		setErrors(validationErrors);
		return validationErrors;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		const validationErrors = handleValidation();

		if (Object.keys(validationErrors).some(key => validationErrors?.[key]?.length > 0)) {
			console.log("validationErrors: ", validationErrors);
			return;
		}

		try {
			dispatch(forgotPasswordStart());

			const res = await axios.post("/api/auth/forgot-password", formData);
			const data = res.data;
			console.log("data: ", data);

			dispatch(forgotPasswordSuccess());
		} catch (error) {
			const message = showErrorMessage(error);
			toast.error(message, { position: 'bottom-center', style: { fontSize: '1.2rem', color: '#FF0000', backgroundColor: '#ffe6e6', border: '1px solid #FF0000' } });
			
			dispatch(forgotPasswordFailure(message));
		}
	};

	return (
		<div className="mt-32 mb-64">
			<div className='flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-24'>
				<div className='flex-1 md:max-w-xl mx-auto'>
					<div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto'>
						<h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>
							Forgot Password
						</h2>

						{!isSubmitted ? (
							<form onSubmit={handleSubmit}>
								<p className='text-center text-gray-700 mb-6'>
									Enter your email address and we'll send you a link to reset your password.
								</p>
								<div>
									<TextInput
										id='email'
										icon={MdOutlineEmail}
										type='email'
										placeholder='Your Email Address'
										onChange={handleChange}
										sizing={"lg"} className="text-lg w-full" style={{ fontSize: '1.5rem' }}
									/>
									{errors?.email?.length > 0 && (
										errors.email.map((error, index) => (
											<p key={index} className='text-red-500 mt-2 text-xs'>
												{error}
											</p>
										))
									)}
								</div>
								<div className="mt-4">
									<Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading} className="text-lg w-full py-3 flex items-center justify-center space-x-8 p-2 rounded-md shadow-md bg-white text-white font-semibold hover:bg-gray-100 border-2 border-gray-300 text-lg">
										{loading ? (
											<div className="flex justify-center items-center">
												<Spinner size="lg" />
											</div>
										) : (
											<span className="text-xl">Send Reset Link</span>
										)}
									</Button>
								</div>
							</form>
						) : (
							<div className='text-center'>
								<div
									className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
								>
									<FaCheck className='text-white text-4xl' />
								</div>
								<p className='text-gray-600 mb-6'>
									Done! If an account exists for <b>{formData.email}</b>, you will receive a password reset link shortly.
								</p>
							</div>
						)}
						<div className='px-8 py-4 flex justify-center'>
							<Link to={"/login"} className='text-blue-500 hover:underline flex items-center'>
								<span className='mr-2'>&#8592; Back to Login</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;