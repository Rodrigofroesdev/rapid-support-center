import { Chamado } from "@/data/mockData";
import { ChamadoCreate } from "../types/chamadoTypes";
import HttpClient from "../http/httpClient";

export default class ChamadoService {
    async createChamado(chamado: FormData): Promise<Chamado> {
        const response = await HttpClient.postFormData<Chamado>("chamado", chamado);
        return response;
    }
}