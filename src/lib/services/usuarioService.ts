import { Usuario } from "@/data/mockData";
import HttpClient from "../http/httpClient";

export default class UsuarioService {
    async getUsuarios(): Promise<Usuario[]> {
        const response = await HttpClient.get<Usuario[]>("usuario");
        return response;
    }

    async deleteUsuario(id: string): Promise<void> {
        await HttpClient.delete(`usuario/${id}`);
    }
}