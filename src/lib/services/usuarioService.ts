import { Usuario } from "../types/usuarioTypes";
import HttpClient from "../http/httpClient";

export default class UsuarioService {
    async getUsuarios(url: String): Promise<Usuario[]> {
        const response = await HttpClient.get<Usuario[]>("usuario");
        return response;
    }

    async deleteUsuario(id: string): Promise<void> {
        await HttpClient.delete(`usuario/${id}`);
    }

    async updateUsuario(usuario: Usuario): Promise<void> {
        await HttpClient.put("usuario", usuario);
    }

    async createUsuario(usuario: Usuario): Promise<void> {
        await HttpClient.post(`usuario`, usuario);
    }

    async getUsuariosWithFilter(url: string): Promise<Usuario[]> {
        const response = await HttpClient.get<Usuario[]>(url);
        return response;
    }
}
