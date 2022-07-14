<template>
	<div class="layout-profile">
		<div>
			<img :src="imagenUsuario" width="100" height="100"  />
		</div>
		<button class="p-link layout-profile-link" @click="onClick">
			<span class="username"> {{ nombreUsuario }} </span>
			<i class="pi pi-fw pi-cog"></i>
		</button>
        <transition name="layout-submenu-wrapper">
            <ul v-show="expanded">
                <li><button class="p-link"><i class="pi pi-fw pi-user"></i><span>Cuenta</span></button></li>
                <!-- <li><button class="p-link"><i class="pi pi-fw pi-inbox"></i><span>Notifications</span><span class="menuitem-badge">2</span></button></li> -->
                <li><button class="p-link" @click="logOut"><i class="pi pi-fw pi-power-off"></i><span>Cerrar sesión</span></button></li>
            </ul>
        </transition>
		
	</div>
</template>

<script>
import Swal from 'sweetalert2';
import UsuarioService from "./service/seguridad/UsuarioService";
	export default {
		data() {
			return {
				expanded: false,
				imagenUsuario: null,
				usuario: {},
				nombreUsuario: null,
				tamanioImagen: null,
			}
		},
		usuarioService: null,
		created(){
			this.usuarioService = new UsuarioService();
		},
		mounted() {
			let user = JSON.parse(localStorage.getItem('user'));
			const nombre = user.nombres.split(" ");
			const apellido = user.apellidos.split(" ");
			this.nombreUsuario = nombre[0] + " " + apellido[0];
			var promUsuario = new Promise((resolve,reject) => {
				this.usuarioService.obtenerImagenUsuario(user.codUsuario).then(files => {
					console.log(files);
					resolve(files);
				})
				.catch((err) => {
					reject(err);
				});
            });
			promUsuario.then( (files) => {
                if(files.data != ""){
					this.imagenUsuario = "data:image/png;base64," + files.data;
					this.tamanioImagen = 110;
				}else{
					this.imagenUsuario = "assets/layout/images/user_default2.png";
					this.tamanioImagen = 90
				}
            }).catch( () => {
            });
		},
		methods: {
			onClick(event){
				this.expanded = !this.expanded;
				event.preventDefault();
			},
			logOut() {
				Swal.fire({
					title: 'Cerrar Sesión',
					text: "Esta seguro de Cerrar Sesión?",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Si',
					cancelButtonText: 'Cancelar'
				}).then((result) => {
					if (result.isConfirmed) {
						this.$store.dispatch('auth/logout');
						this.$router.push('/');
					}
				})
			},
		}
	}
</script>

<style scoped>

</style>