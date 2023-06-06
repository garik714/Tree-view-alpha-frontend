import axios from 'axios';
import { SignUpDataTypes } from '../components/pages/signUp/SignUp';
import { SignInDataTypes } from '../components/pages/signIn/SignIn';
import { getAccessToken } from '../helpers/auth';

const url = process.env.REACT_APP_API_URL;

export class AuthApi {
    static async register(data: SignUpDataTypes) {
        return axios.post(
            `${url}/api/register`,
            data,
            {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  'Content-Type': 'application/json;',
                }
            }
        );
    };

    static async signin(data: SignInDataTypes) {
        return axios.post(
            `${url}/api/login`,
            data,
            {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  'Content-Type': 'application/json;',
                }
            }
        );
    };

    static async logout() {
        const accessToken = await getAccessToken();

        return axios.post(
            `${url}/api/logout`,
            {},
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json;',
                    Authorization:
                        "Bearer " + accessToken,
                }
            }
        );
    };

    static async updateAccessToken(refreshToken: string, userId: string) {
        return axios.post(
            `${url}/api/refresh-token`,
            {
              refreshToken,
              userId,
            },
            {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  'Content-Type': 'application/json;',
                }
            }
        );
    };
}
