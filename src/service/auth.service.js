import axios from 'axios';
import url from "../js/urlBase";
class AuthService {
    login(user) {
        var API_URL = url[0].urlBase;
        return axios.post(API_URL + '/api/auth/login', {
            usuario: user.usuario,
            password: user.password,
        })
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
    }
    logout() {
        localStorage.removeItem('user');
    }
}
export default new AuthService();