import http from "../../http-common";
import authHeader from '../auth-header';

export default class PerfilService {

    buscarActivos(){
        return http.get("mff-seguridad/perfil/buscarActivos", { headers: authHeader() });
    }
    
    buscarTodosPerfiles(){
        return http.get("mff-seguridad/perfil/buscarTodosPerfiles", { headers: authHeader() });
    }
}