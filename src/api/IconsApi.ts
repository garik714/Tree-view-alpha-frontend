import axios from 'axios';
import { getAccessToken } from '../helpers/auth';
import { CreateIconsType } from '../components/common/iconCreater/IconCreater';

const url = process.env.REACT_APP_API_URL;

export class IconsApi {
    static async getIcons(page?: string) {
        const accessToken = await getAccessToken();

        return axios.get(
            `${url}/api/icon?page=${page}`,
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

    static async createIcon(data: CreateIconsType) {
        const accessToken = await getAccessToken();

        return axios.post(
            `${url}/api/icon`,
            data,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'multipart/form-data',
                    Authorization:
                        "Bearer " + accessToken,
                }
            }
        );
    };
}
