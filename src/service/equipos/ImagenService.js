import http from "../../http-common";
import authHeader from '../auth-header';

export default class ImagenService {

    buscarImagenesPorEquipo(idEquipo){
        return http.get(`imagen/buscarImagenesPorEquipo/${idEquipo}`, { headers: authHeader() });
    }

    eliminarImagen(imagen){
        return http.post("imagen/eliminarImagen",imagen, { headers: authHeader() });
    }
    
}