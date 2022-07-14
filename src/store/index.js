import Vue from 'vue';
import Vuex from 'vuex';

import { auth } from './auth.module';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        cliente:[], // cliente o clientes seleccionados
        clienteContribuyente:{}, // cliente por defecto brother
        fichasConfirmadas:[], // fichas que estan listas para compararse con el contribuyente que ha sido ingresado mas adelante
        proformasConfirmadas:[],
        // Liquidacion temporal para tener el valor de los valores que se han rescatado
        liquidacionTemporal:{}, // liquidacion temporal 
        
        liquidaciones:[],
        liquidacionImpresion:[], // grupo de liquidacion que se van a presentar en el detalle de la proforma
        estado:true // se verifica que se esta procesando una proforma - signicia que esta libre o se encera todo de nuevo
    },
    mutations:{
        setCliente(state,cliente){
            state.cliente = cliente
        },
        setClienteContribuyente(state,clienteC){
            state.clienteContribuyente = clienteC
        },
        setFichasConfirmadas(state,fichas){
            state.fichasConfirmadas = fichas;
        },
        setLiquidacionTemporal(state,liquidacion){
            state.liquidacionTemporal = liquidacion;
        },
        setLiquidacionImpresion(state,liquidacion){
            state.liquidacionImpresion = liquidacion;
        },
        
        setCodigoDescuento(state,codigo){
            state.cod_descuento = codigo;
        },
        setProformasConfirmadas(state,fichas){
            state.proformasConfirmadas = fichas;
        },
        limpiarStore(state){
            state.cliente = null;
            state.liquidacionImpresion = null;
            state.clienteContribuyente =null;
            state.liquidacionTemporal = null;
            state.proformasConfirmadas = null;
        }
    },
    actions:{
        setCliente({commit},cliente){
            commit('setCliente',cliente)
        },
        setClienteContribuyente({commit},clienteC){
            commit('setClienteContribuyente',clienteC);
        },
        setFichasConfirmadas({commit},fichas){
            commit('setFichasConfirmadas',fichas); 
        },
        setLiquidacionTemporal({commit},liquidacion){
            commit('setLiquidacionTemporal',liquidacion)
        },
        setLiquidacionImpresion({commit},liquidacion){
            commit('setLiquidacionImpresion',liquidacion);
        },
        setCodigoDescuento({commit},codigo){
            commit('setCodigoDescuento',codigo);
        },
        setProformasConfirmadas({commit},fichas){
            commit('setProformasConfirmadas',fichas); 
        },
        limpiarStore({commit}){
            commit('limpiarStore');
        }
    },
    modules: {
        auth
    }
});