import http from "../../http-common";
import authHeader from '../auth-header';

export default class MarcaService {

    buscarMarcasActivas(){
        return http.get("marca/buscarMarcasActivas", { headers: authHeader() });
    }
    
    buscarMarcasActivasMasTodos(){
        return http.get("marca/buscarMarcasActivasMasTodos", { headers: authHeader() });
    }

    buscarTodasMarcas(){
        return http.get("marca/buscarTodasMarcas", { headers: authHeader() });
    }

    guardarMarca(usuario){
        return http.post("marca/guardarMarca",usuario, { headers: authHeader() });
    }

    guardarLogoMarca(file, idMarca) {
        let formData = new FormData();
        formData.append("file", file);       
        let user = JSON.parse(localStorage.getItem('user'));
        return http.put(`marca/guardarLogoMarca/${idMarca}`, formData, 
            {headers: {"Content-Type": "multipart/form-data", "Authorization": 'Bearer ' + user.token}}
        );
    }
}