import http from "../../http-common";
import authHeader from '../auth-header';

export default class UsuarioService {

    buscarActivos(){
        return http.get("mff-seguridad/usuario/buscarActivos", { headers: authHeader() });
    }
    
    guardar(usuario){
        return http.post("mff-seguridad/usuario/guardar",usuario, { headers: authHeader() });
    }

    upload(file, idUsuario) {
        let formData = new FormData();
        formData.append("file", file);       
        let user = JSON.parse(localStorage.getItem('user'));
        return http.put(`mff-seguridad/usuario/upload/${idUsuario}`, formData, 
            {headers: {"Content-Type": "multipart/form-data", "Authorization": 'Bearer ' + user.token}}
        );
    }
    
    obtenerImagenUsuario(idUsuario) {
        return http.get(`mff-seguridad/usuario/obtenerImagenUsuario/${idUsuario}`, { headers: authHeader() });
    }
}