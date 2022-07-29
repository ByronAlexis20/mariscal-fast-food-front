import http from "../../http-common";
import authHeader from '../auth-header';

export default class CategoriaService {

    buscarCategoriasActivas(){
        return http.get(`mff-administracion/categoria/buscarActivos`, { headers: authHeader() });
    }

    guardar(categoria){
        return http.post("mff-administracion/categoria/guardar",categoria, { headers: authHeader() });
    }

}