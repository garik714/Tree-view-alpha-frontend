import decode from 'jwt-decode';
import { store } from '../redux/index'
import { removeAuthentication, removeTokenFromState, setToken } from '../redux/slice/authSlice';
import { AuthApi } from '../api/AuthApi';

export const saveToken = (data) =>  {
    localStorage.setItem('token', JSON.stringify(data));
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const getAccessToken = () => {
    const token = store.getState().authReducer.token;
    
    if (!token) {
        logout();
        return null;
    }
    
    const parsed = JSON.parse(token);
    const decoded = decode(parsed.access_token);
    
    if (decoded.exp - Date.now()/1000 < 60) {
        return AuthApi.updateAccessToken(parsed.refresh_token, parsed.user.id)
        .then((res) => {
            const { data } = res.data;
            
            saveToken(data);
            store.dispatch(setToken(JSON.stringify(data)));
           
            return data.access_token;
        })
        .catch(() => {
            logout();
            return null;
        });
    }

    return Promise.resolve(parsed.access_token);
};

export const checkLoginStatus = () => {
    return !!localStorage.getItem('token');
};

export const logout = () => {
    removeToken();
    store.dispatch(removeTokenFromState());
    store.dispatch(removeAuthentication());
};




