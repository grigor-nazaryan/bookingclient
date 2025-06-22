import { useDispatch } from 'react-redux';
import axios from '../api/axios';
import { checkAuthStart, setCredentials } from '../redux/user/userSlice';

const useAuthStore = () => {
    const dispatch = useDispatch();

    const checkAuth = async () => {
        console.log("checkAuth");
        dispatch(checkAuthStart());

        const response = await axios.get('/api/auth/me', { withCredentials: true });

        const { user } = response?.data?.data;
        console.log("user: ", user)

        dispatch(checkAuthSuccess(user));

        return user
    }

    return checkAuth;
};

export default useAuthStore;