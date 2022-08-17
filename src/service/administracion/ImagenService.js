import http from "../../http-common";
import authHeader from '../auth-header';

export default class ImagenService {

    buscarImagenesPorProducto(idProducto){
        return http.get(`mff-administracion/imagen/buscarImagenesPorProducto/${idProducto}`, { headers: authHeader() });
    }

    guardarImagenes(file, idProducto) {
        let formData = new FormData();
        for (var i = 0; i < file.files.length; i++) {
            formData.append("file", file.files[i]);
        }
        let user = JSON.parse(localStorage.getItem('user'));
        return http.put(`mff-administracion/imagen/guardarImagenes/${idProducto}`, formData, 
            {headers: {"Content-Type": "multipart/form-data", "Authorization": 'Bearer ' + user.token}}
        );
    }
}