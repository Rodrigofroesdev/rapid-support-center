import { Tipo } from "./tipoTypes";
import { Usuario } from "./usuarioTypes";

export interface Chamado {
    id: string;
    nome: string;
    descricao: string;
    statusChamdo: Tipo;
    tipoChamado: Tipo;
    arquivoLink: string[];
    usuario: Usuario;
}

export interface ChamadoCreate {
    id: string;
    nome: string;
    descricao: string;
    tipoChamadoId: string;
    formFiles: File[];
    UsuarioId: string;
}