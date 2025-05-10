import UsuarioService from "../services/usuarioService";
import { Tipo } from "../types/tipoTypes";
import TipoService from "../services/tipoService";
import { Usuario } from "../types/usuarioTypes";
import TipoChamadoService from "../services/tipoChamadoService";
import { TipoChamado } from "../types/tipoChamadoTypes";

async function FecthUsuarios(url: string): Promise<Usuario[]> {
    const response = new UsuarioService();
    const usuarios = await response.getUsuarios(url);
    return usuarios;
}

async function FecthTipos(): Promise<Tipo[]> {
    const response = new TipoService();
    const tipos = await response.getTipos();
    return tipos;
}

async function FecthTiposChamado(): Promise<TipoChamado[]> {
    const response = new TipoChamadoService();
    const tipos = await response.getTiposChamado();
    return tipos;
}

export { FecthUsuarios, FecthTipos, FecthTiposChamado };