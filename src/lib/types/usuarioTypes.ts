import { Tipo } from "./tipoTypes";

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    tipo: Tipo;
}