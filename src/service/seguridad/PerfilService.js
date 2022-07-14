import http from "../../http-common";
import authHeader from '../auth-header';

export default class PerfilService {

    buscarActivos(){
        return http.get("perfil/buscarActivos", { headers: authHeader() });
    }
    
    buscarTodosPerfiles(){
        return http.get("perfil/buscarTodosPerfiles", { headers: authHeader() });
    }
}