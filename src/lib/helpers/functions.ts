import UsuarioService from "../services/usuarioService";
import { Tipo } from "../types/tipoTypes";
import TipoService from "../services/tipoService";
import { Usuario } from "../types/usuarioTypes";

async function FecthUsuarios(): Promise<Usuario[]> {
    const response = new UsuarioService();
    const usuarios = await response.getUsuarios();
    return usuarios;
}

async function FecthTipos(): Promise<Tipo[]> {
    const response = new TipoService();
    const tipos = await response.getTipos();
    return tipos;
}

export { FecthUsuarios, FecthTipos };