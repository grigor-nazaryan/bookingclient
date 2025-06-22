import { useEffect, useState } from "react";

import { MdOutlineEmail } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, TextInput } from "flowbite-react";
import { resetPasswordFailure, resetPasswordStart, resetPasswordSuccess } from "../redux/user/userSlice";
import resetPasswordValidation from "../helpers/validation/resetPasswordValidation";
import showErrorMessage from "../helpers/showErrorMessage";
import toast from "react-hot-toast";

import axios from "../api/axios";

const ResetPassword = () => {
	const { currentUser, error: errorMessage, loading, isSubmitted } = useSelector((state) => state.user);

	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useParams();


	useEffect(() => {
		dispatch(resetPasswordFailure(null));
	}, [dispatch]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleValidation = () => {
		const validationErrors = resetPasswordValidation(formData);
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

		const form = { password: formData.password, }

		try {
			dispatch(resetPasswordStart());

			const res = await axios.post(`/api/auth/reset-password/${token}`, form);
			const data = res.data;
			console.log("data: ", data);

			toast.success("Password reset successfully", { position: 'bottom-center', style: { fontSize: '1.2rem', color: '#2AAA8A', backgroundColor: '#ebfceb', border: '1px solid #008000' } });

			setTimeout(() => navigate("/login"), 2000);
			dispatch(resetPasswordSuccess());
		} catch (error) {
			const message = showErrorMessage(error);
			toast.error(message, { position: 'bottom-center', style: { fontSize: '1.2rem', color: '#FF0000', backgroundColor: '#ffe6e6', border: '1px solid #FF0000' } });
			
			dispatch(resetPasswordFailure(message));
		}

	};

	return (
		<div className="mt-32 mb-64">
			<div className='flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-24'>
				<div className='flex-1 md:max-w-xl mx-auto'>
					<div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto'>
						<h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>
							Reset Password
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<TextInput
									type="password"
									placeholder="Password"
									id="password"
									onChange={handleChange}
									sizing="lg"
									className="text-lg w-full"
									style={{ fontSize: '1.5rem' }}
								/>
								{errors?.password?.length > 0 && (
									errors.password.map((error, index) => (
										<p key={index} className='text-red-500 mt-2 text-xs'>
											{error}
										</p>
									))
								)}
							</div>
							<div className="mb-4">
								<TextInput
									type="password"
									placeholder="Re-type Password"
									id="confirmPassword"
									onChange={handleChange}
									sizing="lg"
									className="text-lg w-full"
									style={{ fontSize: '1.5rem' }}
								/>
								{errors?.confirmPassword?.length > 0 && (
									errors.confirmPassword.map((error, index) => (
										<p key={index} className='text-red-500 mt-2 text-xs'>
											{error}
										</p>
									))
								)}
							</div>
							<div className="mt-4">
								<Button
									gradientDuoTone="purpleToBlue"
									type="submit"
									disabled={loading}
									className="text-lg w-full py-3 flex items-center justify-center space-x-8 p-2 rounded-md shadow-md bg-white text-white font-semibold hover:bg-gray-100 border-2 border-gray-300 text-lg"
								>
									{loading ? (
										<div className="flex justify-center items-center">
											<Spinner size="lg" />
										</div>
									) : (
										<span className="text-xl">Set New Password</span>
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;