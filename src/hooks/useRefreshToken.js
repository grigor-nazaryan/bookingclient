import { useDispatch } from 'react-redux';
import axios from '../api/axios';
import { setCredentials } from '../redux/user/userSlice';

const useRefreshToken = () => {
	const dispatch = useDispatch();

	const refresh = async () => {
		console.log("refresh called");

		const response = await axios.get('/api/auth/refresh-token', {
			withCredentials: true
		});

		const { accessToken } = response?.data?.data;
		dispatch(setCredentials(accessToken));

		return accessToken
	}
	return refresh;
};

export default useRefreshToken;