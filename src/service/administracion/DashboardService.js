import http from "../../http-common";
import authHeader from '../auth-header';

export default class DashboardService {

    consultarDashboardPorDia(){
        return http.get(`mff-administracion/dashboard/consultarDashboardPorDia`, { headers: authHeader() });
    }

    listarClientesActivos(){
        return http.get(`mff-administracion/dashboard/listarClientesActivos`, { headers: authHeader() });
    }

}