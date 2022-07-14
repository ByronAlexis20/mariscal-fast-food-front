import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/Dashboard.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
            path: '/',
            redirect: "auth/login",
            component: () => import('@/AppPlantilla.vue'),
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: Dashboard
                },
                {
                    path: '/perfil',
                    name: 'perfil',
                    component: () => import('./pages/seguridad/Perfil.vue')
                },
                {
                    path: '/permiso',
                    name: 'permiso',
                    component: () => import('./pages/seguridad/Permiso.vue')
                },
                {
                    path: '/usuario',
                    name: 'usuario',
                    component: () => import('./pages/seguridad/Usuario.vue')
                },
                {
                    path: '/misdatos',
                    name: 'misdatos',
                    component: () => import('./pages/seguridad/Datos.vue')
                },

                {
                    path: '/marca',
                    name: 'marca',
                    component: () => import('./pages/administracion/Marca.vue')
                },

                {
                    path: '/registroequipo',
                    name: 'registroequipo',
                    component: () => import('./pages/equipos/RegistroEquipos.vue')
                },
            ]
        },
		{
            path: '/auth',
            component: () =>import('@/AppPlantillaBlank.vue'),
            children : [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('./pages/login.vue')
                },
            ]
        },
	],
	scrollBehavior() {
		return {x: 0, y: 0};
	}
});
