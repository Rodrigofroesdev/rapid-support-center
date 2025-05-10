import { TipoChamado } from "@/data/mockData";
import HttpClient from "../http/httpClient";
import { Tipo } from "../types/tipoTypes";

export default class TipoChamadoService {
    async getTiposChamado(): Promise<TipoChamado[]> {
        const response = await HttpClient.get<TipoChamado[]>("TipoChamado");
        return response;
    }
}