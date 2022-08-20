import http from "../../http-common";
import authHeader from '../auth-header';

export default class ReporteService {

    imprimirReporteProductos(idCategoria){
        return http.get(`mff-administracion/reportes/imprimirReporteProductos/${idCategoria}`, { headers: authHeader(), responseType: 'arraybuffer' });
    }

    imprimirReporteVentasPorFecha(fecha){
        return http.get(`mff-administracion/reportes/imprimirReporteVentasPorFecha/${fecha}`, { headers: authHeader(), responseType: 'arraybuffer' });
    }

    imprimirReporteVentasPorRangoFecha(fechaInicio, fechaFin){
        return http.get(`mff-administracion/reportes/imprimirReporteVentasPorRangoFecha/${fechaInicio}/${fechaFin}`, { headers: authHeader(), responseType: 'arraybuffer' });
    }
}