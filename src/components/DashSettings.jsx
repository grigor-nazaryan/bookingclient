import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import {
	updateStart,
	updateSuccess,
	updateFailure,
} from '../redux/user/userSlice';

import { useDispatch } from 'react-redux';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';

export default function DashSettings() {
	const { currentUser, error: errorMessage, loading, token } = useSelector((state) => state.user);

	const axiosPrivate = useAxiosPrivate();

	const [formData, setFormData] = useState({});

	const dispatch = useDispatch();

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.id]: event.target.value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (Object.keys(formData).length === 0) return;

		try {
			dispatch(updateStart());

			const res = await axiosPrivate.put("/api/user/update-account-info", formData);
			const data = res.data;
			const { user } = data.data;
			console.log("user: ", user);

			dispatch(updateSuccess(user));

			toast.success("User's Password updated successfully", { position: 'bottom-center', style: { fontSize: '1.2rem', color: '#2AAA8A', backgroundColor: '#ebfceb', border: '1px solid #008000' } });
		} catch (error) {
			if (error.response && error.response.data) {
				const message = error.response.data.message;
				toast.error(message, { position: 'bottom-center', style: { fontSize: '1.2rem', color: '#FF0000', backgroundColor: '#ffe6e6', border: '1px solid #FF0000' } });

				dispatch(updateFailure(message));
			}
		}
	};

	return (
		<div className='max-w-lg mx-auto p-3 w-full'>
			<h1 className='my-7 text-center font-semibold text-3xl'>Settings</h1>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<TextInput
					type='password'
					id='currentPassword'
					placeholder='Enter current password'
					onChange={handleChange}
				/>
				<TextInput
					type='password'
					id='newPassword'
					placeholder='Enter new password'
					onChange={handleChange}
				/>

				<TextInput
					type='password'
					id='confirmPassword'
					placeholder='Re-type new password'
					onChange={handleChange}
				/>

				<Button
					type='submit'
					gradientDuoTone='purpleToBlue'
					outline
					disabled={loading}
				>
					{loading ? (
						<div className="flex justify-center items-center">
							<Spinner size="lg" />
						</div>
					) : (
						<span className="text-sm">Change Password</span>
					)}
				</Button>
			</form>
		</div>
	);
}