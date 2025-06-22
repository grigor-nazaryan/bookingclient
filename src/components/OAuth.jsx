import { Button } from "flowbite-react";
import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithRedirect } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setCredentials, loginFailure, loginSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function OAuth() {
	const auth = getAuth(app);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleGoogleClick = async () => {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: "select_account" });
		try {
			const resultsFromGoogle = await signInWithPopup(auth, provider);

			if (resultsFromGoogle.user) {
				const { displayName, email } = resultsFromGoogle.user;

				const res = await axios.post("/api/auth/google", { displayName, email }, { withCredentials: true });
				const data = await res.data;

				if (data.status !== 200) {
					dispatch(loginFailure(data.message));
				} else {
					const { user, accessToken } = data.data;
					console.log("google user: ", user);
					console.log("google accessToken: ", accessToken);

					dispatch(loginSuccess(user));
					dispatch(setCredentials(accessToken));
					navigate("/dashboard?tab=overview");
				}
			}
		} catch (error) {
			if (error.response && error.response.data) {
				const message = error.response.data.message;
				dispatch(loginFailure(message));
			}
		}
	};
	return (
		<Button type='button' gradientDuoTone='blueToGreen' onClick={handleGoogleClick} className='flex items-center justify-center space-x-8 p-2 rounded-md shadow-md bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 text-lg'>
			<img src="images/icons8-google-480.svg" alt="Google Icon" className='w-12 h-7' />
			<span className='text-xl'>Sign in with Google</span>
		</Button>
	);
}
