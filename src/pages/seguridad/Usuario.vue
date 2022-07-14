<template>
    <div class="p-grid">
        <div class="p-col-12">
            <div class="card">
                <Toast />
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <Button label="Nuevo" icon="pi pi-plus" class="p-button-success p-mr-2" @click="nuevoRegistro"/>
                    </template>
                </Toolbar>
                <DataTable
                    class="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-responsive p-datatable-customers"
                    :value="dataUsuario"
                    :rowHover="true"
                    dataKey="idUsuario"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions=rango
                    currentPageReportTemplate="Mostrar {first} hasta {last} de {totalRecords} Registros">
                    <template #header>
                        <div class="table-header">
                            <h5 class="p-m-0"> Usuarios </h5>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <template #empty> No se encontraron Registros. </template>
                    <template #loading> Cargando Registros, por favor espere un momento. </template>
                    <Column field="cedula" header="Cédula" headerStyle="width: 7em;">
                        <template #body="slotProps">
                            <span class="p-column-title"> Cédula:</span>
                            {{ slotProps.data.cedula }}
                        </template>
                    </Column>
                    <Column field="nombre" header="Nombres">
                        <template #body="slotProps">
                            <span class="p-column-title"> Nombres:</span>
                            <span  :class="'customer-badge'">{{slotProps.data.nombre}} {{slotProps.data.apellido}} </span>
                        </template>
                    </Column>
                    <Column field="perfil" header="Perfil">
                        <template #body="slotProps">
                            <span class="p-column-title"> Perfil:</span>
                            <span  :class="'customer-badge'">{{slotProps.data.perfil.perfil}} </span>
                        </template>
                    </Column>
                    <Column field="telefono" header="Teléfono">
                        <template #body="slotProps">
                            <span class="p-column-title"> Teléfono:</span>
                            <span  :class="'customer-badge'">{{slotProps.data.telefono}} </span>
                        </template>
                    </Column>
                    <Column field="usuario" header="Usuario">
                        <template #body="slotProps">
                            <span class="p-column-title"> Usuario:</span>
                            <span  :class="'customer-badge'">{{slotProps.data.usuario}} </span>
                        </template>
                    </Column>
                    <Column field="cod_estado" header="Estado" headerStyle="width: 10em;">
                        <template #body="slotProps">
                            <span class="p-column-title"> Estado:</span>
                            <span v-if="slotProps.data.estado == 'A'" :class="'customer-badge status-1'">ACTIVO</span>
                            <span v-else :class="'customer-badge status-0'">INACTIVO</span>
                        </template>
                    </Column>
                    <Column headerStyle="width: 7em;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editarRegistro(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog :visible.sync="usuarioDialog" :style="{ width: '500px' }" header="Mantenimiento de usuarios" :modal="true" class="p-fluid" :position="position" @hide="hideDialog">
                    <div class="col-md-12 p-lg-12">
                        <div class="p-field p-grid">
                            <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Código:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="codigo" v-model.trim="usuario.idUsuario" disabled/>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Foto:</label>
                            <div class="p-col-12 p-md-10">
                                <input type="file" ref="file" @change="selectFile" />
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"></label>
                            <div class="p-col-12 p-md-10">
                                <img :src="imagenUsuario" width="90" height="120"/>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="perfil" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Perfil: </label>
                            <div class="p-col-12 p-md-10"> 
                                <Dropdown v-model="perfilSeleccionado" :options="valoresPerfil" optionLabel="perfil" placeholder="Seleccione perfil"/>
                                <small class="p-invalid" v-if="submitted && !perfilSeleccionado.idPerfil"> Perfil es obligatorio </small>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="cedula" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Cédula:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="cedula" v-model.trim="usuario.cedula" maxlength=13 required="true" autofocus :class="{'p-invalid': submitted && !usuario.cedula}"/>
                                <small class="p-invalid" v-if="submitted && !usuario.cedula"> Cédula es obligatorio </small>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="nombres" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Nombres:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="nombres" v-model.trim="usuario.nombre" maxlength=100 required="true" autofocus :class="{'p-invalid': submitted && !usuario.nombre}"/>
                                <small class="p-invalid" v-if="submitted && !usuario.nombre"> Nombres es obligatorio </small>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="apellidos" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Apellidos:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="apellidos" v-model.trim="usuario.apellido" maxlength=100 required="true" autofocus :class="{'p-invalid': submitted && !usuario.apellido}"/>
                                <small class="p-invalid" v-if="submitted && !usuario.apellido"> Apellidos es obligatorio </small>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="direccion" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Dirección:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="direccion" v-model.trim="usuario.direccion" maxlength=250 required="true" autofocus />
                            </div>
                        </div>

                        <div class="p-field p-grid">
                            <label for="telefono" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Teléfono:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="telefono" v-model.trim="usuario.telefono" maxlength=10 autofocus />
                            </div>
                        </div>

                        <div class="p-field p-grid">
                            <label for="usuario" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Usuario:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="usuario" v-model.trim="usuario.usuario" maxlength=150 required="true" autofocus :class="{'p-invalid': submitted && !usuario.usuario}"/>
                                <small class="p-invalid" v-if="submitted && !usuario.usuario"> Usuario es obligatorio </small>
                            </div>
                        </div>

                        <div class="p-field p-grid">
                            <label for="clave" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Clave:</label>
                            <div class="p-col-12 p-md-10">
                                <Password v-model.trim="clave" promptLabel="Digite una clave" weakLabel="Debil" mediumLabel="Medio" strongLabel="Fuerte" :class="{'p-invalid': submitted && !clave}"/>
                                <small class="p-invalid" v-if="submitted && !clave"> Clave es obligatorio </small>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Guardar" icon="pi pi-save" class="p-button-primary p-mr-2" @click='guardarUsuario' />
                        <Button label="Salir" icon="pi pi-times" class="p-button-danger p-mr-2" @click="hideDialog"/>
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import UsuarioService from "../../service/seguridad/UsuarioService";
import PerfilService from "../../service/seguridad/PerfilService";
import Globals from "../../js/Globales";
import mensajeGlobal from "../../js/mensajesGlobales";

export default {
    name: 'UsuarioP',
    data() {
        return {
            dataUsuario: null,
            usuario: {},
            clave: null,

            rango: Globals[0].paginacion.rango,
            filters: {},
            position: "top",
            usuarioDialog: false,

            selectedFiles: undefined,
            currentFile: undefined,
            imagenUsuario: null,

            perfilSeleccionado: {},
            valoresPerfil: [],

            submitted: false,
        };
    },
    usuarioService: null,
    perfilService: null,
    
    created() {
        this.usuarioService = new UsuarioService();
        this.perfilService = new PerfilService();
    },

    mounted() {
        this.listarUsuarios();
        this.listarPerfiles();
    },

    components: {
    },

    methods: {
        listarUsuarios() {
            this.usuarioService.buscarActivos().then((response) => {
                this.dataUsuario = response.data;
            }).catch(() => {
            });
        },
        listarPerfiles(){
            this.perfilService.buscarActivos().then((response) => {
                this.valoresPerfil = response.data;
            }).catch(() => {
            });
        },
        hideDialog(){
            this.usuarioDialog = false;
        },
        nuevoRegistro() {
            this.usuarioDialog = true;
            this.usuario = {};
            this.clave = null;
            this.imagenUsuario = "assets/layout/images/user_default2.png";
        },
        async editarRegistro(usuario) {
            this.usuarioDialog = true;
            this.usuario = { ...usuario };
            this.clave = null;
            this.perfilSeleccionado = this.valoresPerfil.find(
                (o) => o.idPerfil === this.usuario.perfil.idPerfil
            );
            await this.usuarioService.obtenerImagenUsuario(this.usuario.idUsuario).then(files => {
                if(files.data != ""){
                    this.imagenUsuario = "data:image/png;base64,"+files.data;
                }else{
                    this.imagenUsuario = "assets/layout/images/user_default2.png";
                }
            })
            .catch(() => {
                this.currentFile = undefined;
                this.imagenUsuario = "assets/layout/images/user_default2.png";
            });
        },

        selectFile() {
            this.selectedFiles = this.$refs.file.files;
        },

        guardarUsuario(){
            this.submitted = true;
            if(!this.validarDatos()){
                this.usuario.estado = "A";
                this.usuario.perfil = this.perfilSeleccionado;
                this.usuario.clave = this.clave;
                if(this.selectedFiles != undefined || this.selectedFiles != null){
                    this.currentFile = this.selectedFiles.item(0);
                }
                this.usuarioService.guardar(this.usuario).then((response) => {
                    if(response.status == 201){ // se registra el usuario existosamente
                        mensajeGlobal("", response.status,"","G");
                        let dataUsuario = response.data.usuario;
                        setTimeout(() => {
                            if(this.currentFile != null || this.currentFile != undefined){ 
                                this.usuarioService.upload(this.currentFile, dataUsuario.idUsuario).then(() =>{
                                    return this.usuarioService.obtenerImagenUsuario(dataUsuario.idUsuario);
                                })
                                .then(files => {
                                    this.imagenUsuario = "data:image/png;base64," + files.data;
                                })
                                .catch(() => {
                                    this.currentFile = undefined;
                                    this.imagenUsuario = "assets/layout/images/user_default2.png";
                                });
                            }  
                            setTimeout(() => {
                                this.limpiarDatos();
                                this.listarUsuarios();
                                this.hideDialog();
                            }, 150);
                        }, 200);
                    }
                });
            }
        },

        validarDatos(){
            let band = false;
            if(this.usuario.nombre == null || this.usuario.nombre == undefined || this.usuario.nombre == ""){
                band = true;
            }
            if(this.usuario.cedula == null || this.usuario.cedula == undefined || this.usuario.cedula == ""){
                band = true;
            }
            if(this.usuario.apellido == null || this.usuario.apellido == undefined || this.usuario.apellido == ""){
                band = true;
            }
            if(this.usuario.usuario == null || this.usuario.usuario == undefined || this.usuario.usuario == ""){
                band = true;
            }
            if(this.clave == null || this.clave == undefined || this.clave == ""){
                band = true;
            }
            if(this.perfilSeleccionado.idPerfil == null || this.perfilSeleccionado.idPerfil == undefined){
                band = true;
            }
            return band;
        },

        limpiarDatos(){
            this.submitted = false;
            this.usuario = {};
            this.perfilSeleccionado = {};
            this.clave = null;
            this.selectedFiles = undefined;
            this.currentFile = undefined;
            this.imagenUsuario = null;
        }
    },
};
</script>

<style scoped lang="scss">
/deep/ .p-progressbar {
	height: .5rem;
	background-color: #D8DADC;

	.p-progressbar-value {
		background-color: #607D8B;
	}
}

.table-header {
	display: flex;
	justify-content: space-between;
}

/deep/ .p-datatable.p-datatable-customers {
	.p-datatable-header {
		padding: 1rem;
		text-align: left;
		font-size: 1.5rem;
	}

	.p-paginator {
		padding: 1rem;
	}

	.p-datatable-thead > tr > th {
		text-align: left;
	}

	.p-datatable-tbody > tr > td {
		cursor: auto;
	}

	.p-dropdown-label:not(.p-placeholder) {
		text-transform: uppercase;
	}
}

/* Responsive */
.p-datatable-customers .p-datatable-tbody > tr > td .p-column-title {
    display: none;
    
    
}

.customer-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-qualified {
		background: #C8E6C9;
		color: #256029;
	}

	&.status-0 {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-negotiation {
		background: #FEEDAF;
		color: #8A5340;
	}

	&.status-1 {
		background: #B3E5FC;
		color: #23547B;
	}

	&.status-renewal {
		background: #ECCFFF;
		color: #694382;
	}

	&.status-proposal {
		background: #FFD8B2;
		color: #805B36;
	}
}

.p-progressbar-value.ui-widget-header {
	background: #607d8b;
}

@media (max-width: 640px) {
	.p-progressbar {
		margin-top: .5rem;
	}
}

.product-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
}

.orders-subtable {
	padding: 1rem;
}

.product-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-instock {
		background: #C8E6C9;
		color: #256029;
	}

	&.status-outofstock {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-lowstock {
		background: #FEEDAF;
		color: #8A5340;
	}
}

.order-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.order-delivered {
		background: #C8E6C9;
		color: #256029;
	}

	&.order-cancelled {
		background: #FFCDD2;
		color: #C63737;
	}

	&.order-pending {
		background: #FEEDAF;
		color: #8A5340;
	}

	&.order-returned {
		background: #ECCFFF;
		color: #694382;
	}
}

@media screen and (max-width: 960px) {
	/deep/ .p-datatable {
		&.p-datatable-customers {
			.p-datatable-thead > tr > th,
			.p-datatable-tfoot > tr > td {
				display: none !important;
			}

			.p-datatable-tbody > tr {
				> td {
					text-align: left;
					display: block;
					border: 0 none !important;
					width: 100% !important;
					float: left;
					clear: left;
					border: 0 none;

					.p-column-title {
						padding: .4rem;
						min-width: 30%;
						display: inline-block;
						margin: -.4rem 1rem -.4rem -.4rem;
						font-weight: bold;
					}

					.p-progressbar {
						margin-top: .5rem;
					}
				}
			}
		}
	}
}

</style>