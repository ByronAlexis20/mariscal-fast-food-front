import http from "../../http-common";
import authHeader from '../auth-header';

export default class EquipoService {

    buscarEquiposActivos(){
        return http.get("equipo/buscarEquiposActivos", { headers: authHeader() });
    }
    
    buscarEquiposPorMarca(idMarca){
        return http.get(`equipo/buscarEquiposPorMarca/${idMarca}`, { headers: authHeader() });
    }

    guardar(equipo){
        return http.post("equipo/guardar",equipo, { headers: authHeader() });
    }

    guardarImagen(file, idEquipo) {
        let formData = new FormData();
        formData.append("file", file);
        let user = JSON.parse(localStorage.getItem('user'));
        return http.put(`imagen/guardarImagen/${idEquipo}`, formData, 
            {headers: {"Content-Type": "multipart/form-data", "Authorization": 'Bearer ' + user.token}}
        );
    }

    guardarImagenes(file, idEquipo) {
        let formData = new FormData();
        for (var i = 0; i < file.files.length; i++) {
            formData.append("file", file.files[i]);
        }
        let user = JSON.parse(localStorage.getItem('user'));
        return http.put(`imagen/guardarImagenes/${idEquipo}`, formData, 
            {headers: {"Content-Type": "multipart/form-data", "Authorization": 'Bearer ' + user.token}}
        );
    }

    eliminarEquipo(equipo){
        return http.post("equipo/eliminarEquipo",equipo, { headers: authHeader() });
    }
}