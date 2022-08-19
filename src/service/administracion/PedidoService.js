import http from "../../http-common";
import authHeader from '../auth-header';

export default class PedidoService {

    buscarPedidosPorCategoria(id){
        return http.get(`mff-administracion/pedidocliente/buscarPedidosPorCategoria/${id}`, { headers: authHeader() });
    }

    buscarOrdenesPorProducto(id){
        return http.get(`mff-administracion/pedidocliente/buscarOrdenesPorProducto/${id}`, { headers: authHeader() });
    }

    buscarPedidos(){
        return http.get(`mff-administracion/pedidocliente/buscarPedidos`, { headers: authHeader() });
    }

    buscarPedidosDetalle(id){
        return http.get(`mff-administracion/pedidocliente/buscarPedidosDetalle/${id}`, { headers: authHeader() });
    }

    atender(id){
        return http.post(`mff-administracion/pedidocliente/atender/${id}`,null, { headers: authHeader() });
    }

    imprimirReporteVentas(){
        return http.get(`mff-administracion/pedidocliente/imprimirReporteVentas`, { headers: authHeader(), responseType: 'arraybuffer' });
    }
}