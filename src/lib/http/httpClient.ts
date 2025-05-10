import { ApiError } from "../types/apiTypes";


const baseUrl = "http://localhost:5001/";

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let errorMessage = `Desculpe, algo deu errado. Tente novamente.`;
        try {
            const errorData = await response.json();
            if (errorData.erro) {
                errorMessage = errorData.erro;
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }
        } catch {
            errorMessage = `Desculpe, algo deu errado. Tente novamente.`;
        }

        const error: ApiError = {
            message: errorMessage,
            status: response.status,
        };

        throw error;
    }
    return (await response.json()) as T;
};

const HttpClient = {
    get: async <T>(path: string, token: boolean = false): Promise<T> => {
        const response = await fetch(baseUrl + path, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return handleResponse<T>(response);
    },

    post: async <T>(
        path: string,
        data: object,
        token: boolean = false
    ): Promise<T> => {
        const response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return handleResponse<T>(response);
    },

    postFormData: async <T>(
        path: string,
        data: FormData,
        token: boolean = false
    ): Promise<T> => {
        const response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
            },
            body: data,
        });
        return handleResponse<T>(response);
    },

    put: async <T>(
        path: string,
        data: object,
        token: boolean = false
    ): Promise<T> => {
        const response = await fetch(baseUrl + path, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return handleResponse<T>(response);
    },

    putFormData: async <T>(
        path: string,
        data: FormData,
        token: boolean = false
    ): Promise<T> => {
        const response = await fetch(baseUrl + path, {
            method: "PUT",
            headers: {
            },
            body: data,
        });
        return handleResponse<T>(response);
    },

    delete: async <T>(path: string, token: boolean = false): Promise<T> => {
        const response = await fetch(baseUrl + path, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return handleResponse<T>(response);
    },
};

export default HttpClient;