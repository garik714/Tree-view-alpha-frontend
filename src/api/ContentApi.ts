import axios from 'axios';
import { getAccessToken } from '../helpers/auth';
import { TreeViewContentTypes } from '../components/treeViewMenu/TreeViewMenu';

const url = process.env.REACT_APP_API_URL;

export class ContentApi {
    static async getRootContent() {
        const accessToken = await getAccessToken();

        return axios.get(
            `${url}/api/content`,
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

    static async getContentByRootId(rootContentId?: string) {
        const accessToken = await getAccessToken();

        return axios.get(
            `${url}/api/content/${rootContentId}`,
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

    static async createContent(data: any) {
        const contentType = (data.value && typeof data.value !== 'string') ? "multipart/form-data" : "application/json;" ;
        const accessToken = await getAccessToken();

        return axios.post(
            `${url}/api/content`,
            data,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": `${contentType}`,
                    Authorization:
                        "Bearer " + accessToken,
                }
            }
        );
    };

    static async updateContent(data: TreeViewContentTypes) {
        const contentType = (data.value && typeof data.value !== 'string') ? "multipart/form-data" : "application/json;" ;
        const accessToken = await getAccessToken();

        return axios.post(
            `${url}/api/content/${data.id}`,
            data,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": `${contentType}`,
                    Authorization:
                        "Bearer " + accessToken,
                }
            }
        );
    };

    static async dragnDrop(data: TreeViewContentTypes) {
        const contentType = (data.value && typeof data.value !== 'string') ? "multipart/form-data" : "application/json;" ;
        const accessToken = await getAccessToken();

        return axios.patch(
            `${url}/api/content/drag-and-drop/${data.id}`,
            data,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": `${contentType}`,
                    Authorization:
                        "Bearer " + accessToken,
                }
            }
        )
    };

    static async deleteRootContentById(rootId: string) {
        const accessToken = await getAccessToken();

        return axios.delete(
            `${url}/api/content/root/${rootId}`,
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

    static async deleteContent(id: string) {
        const accessToken = await getAccessToken();

        return axios.delete(
            `${url}/api/content/${id}`,
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
}
