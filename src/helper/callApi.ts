import { CallApiProps } from "../types/types";

export const CallApi = async ({
    endpoint,
    method,
    params,
    headers,
}: CallApiProps) => {
    let url: string = `https://sandbox-api.softpoint.io/interface/v1/${endpoint}`;
    const apiHeaders: Headers = new Headers();

    const token: string | null = localStorage.getItem("token");

    if (token) {
        apiHeaders.append("Authorization", `Bearer ${token}`);
    }

    apiHeaders.append("Content-Type", "application/json")
    apiHeaders.append("Accept", "application/json")

    if (headers) {
        Object.keys(headers).forEach(key => {
            apiHeaders.append(key, headers[key]);
        });
    }

    const options: {
        method: string,
        headers: Headers,
    } = {
        method,
        headers: apiHeaders,
    };

    if (params) {
        const param = new URLSearchParams(params).toString();
        url = `${url}?${param}`;
    }

    const resp = await fetch(url, options);

    if (resp.ok) {
        return await resp.json();
    }

    throw new Error(`HTTP error! status: ${resp.status}`);
};

export const getAccessToken = async () => {
    const token = await CallApi({
        endpoint: 'access_token',
        method: 'POST',
        params: {
            corporate_id: "10",
        },
        headers: {
            "API-Key": "PO8Rlv4TiYdnZ6NF4uYN/98k6zIGBEkbBG7hBXi9QcI=",
        }
    })

    localStorage.setItem("token", token.access_token);
    location.reload();
}
