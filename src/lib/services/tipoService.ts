import HttpClient from "../http/httpClient";
import { Tipo } from "../types/tipoTypes";

export default class TipoService {
    async getTipos(): Promise<Tipo[]> {
        const response = await HttpClient.get<Tipo[]>("StatusUsuario");
        return response;
    }
}