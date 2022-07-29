import http from "../../http-common";
import authHeader from '../auth-header';

export default class CategoriaService {

    buscarProductosActivas(){
        return http.get(`mff-administracion/producto/buscarActivos`, { headers: authHeader() });
    }

    guardarProducto(producto){
        return http.post("mff-administracion/producto/guardarProducto",producto, { headers: authHeader() });
    }
}