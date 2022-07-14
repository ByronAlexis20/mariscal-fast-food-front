import http from "../../http-common";
import authHeader from '../auth-header';

export default class CaracteristicasService {

    buscarCaracteristicaPorEquipo(idEquipo){
        return http.get(`caracteristica/buscarCaracteristicaPorEquipo/${idEquipo}`, { headers: authHeader() });
    }

    eliminar(caracteristica){
        return http.post("caracteristica/eliminar",caracteristica, { headers: authHeader() });
    }

    guardarListado(listado, idEquipo) {
        return http.post(`caracteristica/guardarListado/${idEquipo}`,listado, { headers: authHeader() });
    }

}