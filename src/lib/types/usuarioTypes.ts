import { Tipo } from "./tipoTypes";

export interface Usuario {
    id: string;
    nome: string;
    senha?: string;
    email: string;
    tipo: Tipo;
}