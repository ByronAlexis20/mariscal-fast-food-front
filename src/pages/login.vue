<template>
<div class="container-fluid">
    <div class="row no-gutter">
        <div class="col-md-8 bg-image">
        </div>
        <div class="col-md-4 bg-light">
            <div class="login d-flex align-items-center py-5">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-10 col-xl-10 mx-auto">
                            <div class="img_logo"> 
                                <img src="../assets/recursos/img/img-login.png" class="img_log_re">
                            </div>
                            <br>
                            <br>
                            <form name="form" @submit.prevent="handleLogin">
                                <div class="form-group">
                                    <br>
                                    <input v-model="usuario.usuario" type="text" class="form-control rounded-pill border-0 shadow-sm px-4" placeholder="Ingrese su usuario" name="identificacion"/>
									<div v-if="submitted && !usuario.usuario" class="alert alert-danger" role="alert">Ingrese su usuario!</div>
                                </div>
                                <br>
                                <div class="form-group">
                                    <input v-model="usuario.password" type="password" class="form-control rounded-pill border-0 shadow-sm px-4 text-success" placeholder="Ingrese Contraseña" name="password"/>
									<div v-if="submitted && !usuario.password" class="alert alert-danger" role="alert">Ingrese una Contraseña!</div>
                                </div>
                                <br>
                                <div class="form-group">
                                    <button class="btn btn-success text-uppercase form-control" :disabled="loading">
                                        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                                        <span  v-show="texto_show">Iniciar Sesión</span>
                                    </button>
                                </div>
                                <div class="form-group">
                                    <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import mensajesGlobales  from "../js/mensajesGlobales";
export default {
    name: 'Login',
    data() {
        return {
            usuario: {
                usuario: null,
                password: null
            },
            message: '',
            texto_show: true,
            loading: false,
            showLogin: true,
            submitted: false,
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        }
    },
    created() {
        if (this.loggedIn) {
            this.$router.push('/dashboard');
        }
    },
    mounted(){
        if (this.loggedIn) {
            this.$router.push('/dashboard');
        }
    },
    methods: {
        handleLogin() {
            this.submitted = true;
			if(!this.validarDatos()){
				return;
			}
			this.loading = true;
            this.texto_show = false;
            this.$validator.validateAll().then(isValid => {
                if (!isValid) {
                    this.loading = false;
                    this.texto_show = true;
                    return;
                }
                if (this.usuario.usuario && this.usuario.password) {
                    this.$store.dispatch('auth/login', this.usuario).then( () => {
                        this.$router.push('/dashboard');
                    }, error => {
                        mensajesGlobales(error, error.response.status, error.response.data, "E", error.response.data.error, error.response.data.message);
                        this.loading = false;
                        this.texto_show = true;
                    });
                }
            });
        },
        validarDatos(){
			if(!this.usuario.usuario){
				return false;
			}
			if(!this.usuario.password){
				return false;
			}
			return true;
		}
    }
};
</script>

<style scoped>

.login,
.image {
    min-height: 100vh
}

.bg-image {
    background-image: url('../assets/recursos/img/portada.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-size: 100% 100%;
}
.img_logo{
    border-radius: 150px;
    display: flex;
    justify-content: center;
    /* align-items: center; */
}

.img_log_re{
    border-radius:150px;
}
</style>
