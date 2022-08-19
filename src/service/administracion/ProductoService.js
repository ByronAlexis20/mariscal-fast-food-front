import http from "../../http-common";
import authHeader from '../auth-header';

export default class CategoriaService {

    buscarProductosActivas(){
        return http.get(`mff-administracion/productousuario/buscarActivos`, { headers: authHeader() });
    }

    buscarTodosActivos(){
        return http.get(`mff-administracion/productousuario/buscarTodosActivos`, { headers: authHeader() });
    }

    guardarProducto(producto){
        return http.post("mff-administracion/productousuario/guardarProducto",producto, { headers: authHeader() });
    }

    imprimirReporteProductos(idCategoria){
        return http.get(`mff-administracion/productousuario/imprimirReporteProductos/${idCategoria}`, { headers: authHeader(), responseType: 'arraybuffer' });
    }

}