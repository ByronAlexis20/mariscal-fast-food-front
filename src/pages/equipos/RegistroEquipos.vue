<template>
    <div class="p-grid">
        <div class="p-col-12">
            <div class="card">
                <Toast />
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <Dropdown v-model="marcaIngresoSeleccionado" :options="valoresMarcaSeleccionar" optionLabel="marca" placeholder="Seleccione marca" @input="buscarPorMarca"/>
                    </template>
                </Toolbar>
                <DataTable
                    class="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-responsive p-datatable-customers"
                    :value="dataEquipo"
                    :rowHover="true"
                    dataKey="idEquipo"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrar {first} hasta {last} de {totalRecords} Registros">
                    <template #header>
                        <div class="table-header">
                            <Button label="Nuevo equipo" icon="pi pi-plus" class="p-button-success p-mr-2" @click="nuevaRegistro"/>
                        </div>
                    </template>
                    <template #empty> No se encontraron Registros. </template>
                    <template #loading>Cargando Registros, por favor espere un momento.</template>
                    <Column field="tipoequipo" header="Tipo de equipo" >
                        <template #body="slotProps">
                            <span class="p-column-title"> Tipo de equipo:</span>
                            {{ slotProps.data.tipoEquipo.tipoEquipo }}
                        </template>
                    </Column>
                    <Column field="marca" header="Marca" >
                        <template #body="slotProps">
                            <span class="p-column-title"> Marca:</span>
                            {{ slotProps.data.marca.marca }}
                        </template>
                    </Column>
                    <Column field="posicion" header="Posición" >
                        <template #body="slotProps">
                            <span class="p-column-title"> Posición:</span>
                            {{ slotProps.data.posicion }}
                        </template>
                    </Column>
                    <Column field="modelo" header="Modelo" >
                        <template #body="slotProps">
                            <span class="p-column-title"> Modelo:</span>
                            {{ slotProps.data.modelo }}
                        </template>
                    </Column>
                    <Column field="estado" header="Estado" headerStyle="width: 10em;">
                        <template #body="slotProps">
                            <span class="p-column-title"> Estado:</span>
                            <span v-if="slotProps.data.estado == 'A'" :class="'customer-badge status-1'">ACTIVO</span>
                            <span v-else :class="'customer-badge status-0'">INACTIVO</span>
                        </template>
                    </Column>
                    <Column headerStyle="width: 9em;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success" v-tooltip.top="'Editar'"  @click="editarRegistro(slotProps.data)" />
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info" v-tooltip.top="'Imagenes'" @click="registrarImagen(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" v-tooltip.top="'Eliminar'" @click="eliminarEquipo(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog :visible.sync="equipoRegistroDialog" :style="{ width: '650px' }" header="Registro de equipos" :modal="true" class="p-fluid" :position="position" @hide="hideDialog">
                    <div class="p-field p-grid">
                        <div class="col-md-12 p-md-12">
                            <label for="codigo" class="col-md-12">Código: </label>
                            <div class="col-md-12">
                                <InputText id="codigo" v-model.trim="equipo.idEquipo" disabled />
                            </div>
                        </div>
                        <div class="col-md-5 p-md-6">
                            <label for="codigo" class="col-md-12">Marca: </label>
                            <div class="col-md-12">
                                <Dropdown v-model="marcaSeleccionado" :options="valoresMarca" optionLabel="marca" placeholder="Seleccione marca" :disabled=deshabilitarMarca />
                                <small class="p-invalid" v-if="submitted && !marcaSeleccionado.idMarca"> Marca es obligatorio </small>
                            </div>
                        </div>
                        <div class="col-md-5 p-md-6">
                            <label for="codigo" class="col-md-12">Modelo: </label>
                            <div class="col-md-12">
                                <InputText id="modelo" v-model.trim="equipo.modelo" maxlength=50 />
                            </div>
                        </div>
                        <div class="col-md-2 p-md-6">
                            <label for="posicion" class="col-md-12">Posicion: </label>
                            <div class="col-md-12">
                                <InputText id="posicion" v-model.trim="equipo.posicion" maxlength=4 />
                            </div>
                        </div>
                        <div class="col-md-12">
                            <TabView>
                                <TabPanel header="Descripción">
                                    <Textarea rows="4" v-model="equipo.descripcion"></Textarea>
                                </TabPanel>
                                <TabPanel header="Características">
                                    <div class="col-md-2">
                                        <Button label="Agregar" icon="pi pi-plus" class="p-button-primary p-mr-2 btn-sm" @click='agregarCaracteristica' />
                                    </div>
                                    <div class="col-md-12">
                                        <DataTable 
                                            class="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-responsive p-datatable-customers"
                                            :value="dataCaracteristicas">
                                            <template #empty>
                                                No se encontraron Registros.
                                            </template>
                                            <Column field="caracteristica" header="Característica">
                                                <template #body="slotProps">
                                                    {{slotProps.data.caracteristica}}
                                                </template>
                                            </Column>
                                            <Column headerStyle="width: 5em;">
                                                <template #body="slotProps" >
                                                    <div style="text-align: center">
                                                        <Button icon="pi pi-trash"  class="p-button-rounded p-button-danger" v-tooltip.top="'Eliminar'" @click="eliminarCaracteristica(slotProps.data)"/>
                                                    </div>
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Guardar" icon="pi pi-save" class="p-button-primary p-mr-2" @click='guardarEquipo' />
                        <Button label="Salir" icon="pi pi-times" class="p-button-warning p-mr-2" @click="hideDialog"/>
                    </template>
                </Dialog>
                <Dialog :visible.sync="caracteristicasDialog" :style="{ width: '500px' }" header="Características" :modal="true" class="p-fluid" :position="position" @hide="hideDialogCaracteristicas">
                    <div class="p-field p-grid">
                        <div class="col-md-12 p-md-12">
                            <label for="codigo" class="col-md-12">Característica: </label>
                            <div class="col-md-12">
                                <Textarea rows="4" v-model="caracteristica"></Textarea>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Guardar" icon="pi pi-save" class="p-button-primary p-mr-2" @click='guardarCaracteristica' />
                        <Button label="Salir" icon="pi pi-times" class="p-button-warning p-mr-2" @click="hideDialogCaracteristicas"/>
                    </template>
                </Dialog>
                <Dialog :visible.sync="imagenRegistroDialog" :style="{ width: '450px', height: '600px' }" :header=modeloSeleccionado :modal="true" class="p-fluid" :position="position" @hide="hideDialogImagenRegistro">
                    <div :style="{ 'height':'500px' }">
                        <Button label="Agregar imagen" icon="pi pi-plus" class="p-button-primary p-mr-2 btn-sm" @click='agregarImagen' />
                        <DataTable
                            class="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-responsive p-datatable-customers"
                            :value="dataImagenes"
                            :rowHover="true"
                            dataKey="idImagen"
                            :paginator="true"
                            :rows="5"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            :rowsPerPageOptions="[5, 10, 25]"
                            currentPageReportTemplate="Mostrar {first} hasta {last} de {totalRecords} Registros">
                            <template #empty> No se encontraron Registros. </template>
                            <template #loading>Cargando Registros, por favor espere un momento.</template>
                            <Column field="imagen" header="Imagen" style="text-align: center"> 
                                <template #body="slotProps">
                                    <div style="text-align: center">
                                        <span class="p-column-title"> Imagen:</span>
                                        <img :src="convertirImagen(slotProps.data.imagen)" width="90" height="120" class="product-image"/>
                                    </div>
                                </template>
                            </Column>
                            <Column headerStyle="width: 5em;">
                                <template #body="slotProps" >
                                    <div style="text-align: center">
                                        <Button icon="pi pi-trash"  class="p-button-rounded p-button-danger" v-tooltip.top="'Eliminar'" @click="eliminarImagen(slotProps.data)"/>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <template #footer>
                        <Button label="Salir" icon="pi pi-times" class="p-button-warning p-mr-2" @click="hideDialogImagenRegistro"/>
                    </template>
                </Dialog>
                <Dialog :visible.sync="imagenesDialog" :style="{ width: '500px', height: '500px' }" :header=modeloSeleccionado :modal="true" class="p-fluid" :position="position" @hide="hideDialogImagenes">
                    <div :style="{ 'height':'400px' }">
                        <h5>Advanced</h5>
                        <FileUpload name="demo[]" :multiple="true" :customUpload="true" @uploader="cargarImagenes" accept="image/*" :maxFileSize="1000000" uploadLabel="Subir" chooseLabel="Elegir" cancelLabel="Cancelar">
                            <template #empty>
                                <p>Arrastre y suelte los archivos aquí para cargarlos.</p>
                            </template>
                        </FileUpload>
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import MarcaService from "./../../service/equipos/MarcaService";
import EquipoService from "./../../service/equipos/EquipoService";
import Swal from 'sweetalert2';
import mensajeGlobal from "../../js/mensajesGlobales";
import ImagenService from "../../service/equipos/ImagenService";
import CaracteristicaService from "../../service/equipos/CaracteristicasService";

export default {
    name: 'RegistroEquiposP',
    data() {
        return {
            marcaIngresoSeleccionado: {},
            valoresMarcaSeleccionar: [],

            dataEquipo: [],
            equipo: {},
            valoresMarca: [],
            marcaSeleccionado: {},

            equipoRegistroDialog: false,
            filters: {},
            position: "top",
            submitted: false,

            modeloSeleccionado: "",
            imagenRegistroDialog: false,
            dataImagenes: [],

            imagenesDialog: false,
            deshabilitarMarca: false,

            caracteristicasDialog: false,
            caracteristica: null,
            dataCaracteristicas: [],
        };
    },
    marcaService: null,
    equipoService: null,
    imagenService: null,
    caracteristicaService: null,

    created() {
        this.imagenService = new ImagenService();
        this.marcaService = new MarcaService();
        this.equipoService = new EquipoService();
        this.caracteristicaService = new CaracteristicaService();
    },
    mounted() {
        this.listarMarcasBuscar();
        this.listarMarcas();
        this.listarEquipos();
    },
    methods: {
        listarMarcasBuscar() {
            this.marcaService.buscarMarcasActivasMasTodos().then(response => {
                this.valoresMarcaSeleccionar = response.data;
                this.marcaIngresoSeleccionado = this.valoresMarcaSeleccionar[0];
            })
            .catch(() => {
            });
        },
        listarEquipos(){
            this.equipoService.buscarEquiposActivos().then(response => {
                this.dataEquipo = response.data;
            })
            .catch(() => {
            });
        },
        buscarPorMarca(){
            if(this.marcaIngresoSeleccionado != null || this.marcaIngresoSeleccionado != undefined){
                this.dataEquipo = [];
                if(this.marcaIngresoSeleccionado.idMarca == 0){
                    this.listarEquipos();
                }else{
                    this.equipoService.buscarEquiposPorMarca(this.marcaIngresoSeleccionado.idMarca).then(response => {
                        this.dataEquipo = response.data;
                    })
                    .catch(() => {
                    });
                }
            }
        },
        nuevaRegistro(){
            this.equipo = {};
            this.equipoRegistroDialog = true;
            //revisar si son todos o una marca en especifico
            if(this.marcaIngresoSeleccionado != null || this.marcaIngresoSeleccionado != undefined){
                if(this.marcaIngresoSeleccionado.idMarca == 0){
                    this.deshabilitarMarca = false;
                }else{
                    this.deshabilitarMarca = true;
                    this.marcaSeleccionado = this.marcaIngresoSeleccionado;
                }
            }
        },
        editarRegistro(equipo){
            this.equipoRegistroDialog = true;
            this.deshabilitarMarca = true;
            this.equipo = { ...equipo };
            this.marcaSeleccionado = this.valoresMarca.find(
                (o) => o.idMarca === this.equipo.marca.idMarca
            );

            this.dataCaracteristicas = [];
            this.caracteristicaService.buscarCaracteristicaPorEquipo(this.equipo.idEquipo).then(response => {
                this.dataCaracteristicas = response.data;
            })
            .catch(() => {
            });
        },
        eliminarEquipo(equip){
            Swal.fire({ title: 'Eliminar Registro', text: "Esta seguro de realizar este Proceso?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.equipoService.eliminarEquipo(equip).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            //tambien hay q grabar las caracteristicas
                            mensajeGlobal("", response.status,"","G");
                            this.limpiarDatos();
                            this.buscarPorMarca();
                            this.hideDialog();
                        }
                    });
                }
            });
        },
        registrarImagen(equipo){
            this.imagenRegistroDialog = true;
            this.equipo = { ...equipo };
            this.modeloSeleccionado = this.equipo.marca.marca + " " + this.equipo.modelo;
            this.listarImagenes(this.equipo);
        },
        listarImagenes(eq){
            this.dataImagenes = [];
            this.imagenService.buscarImagenesPorEquipo(eq.idEquipo).then(response => {
                this.dataImagenes = response.data;
            })
            .catch(() => {
            });
        },
        convertirImagen(imagen){
            return "data:image/png;base64," + imagen;
        },
        agregarImagen(){
            this.imagenesDialog = true;
        },
        hideDialog() {
            this.equipoRegistroDialog = false;
            this.deshabilitarMarca = false;
            this.marcaSeleccionado = {};
            this.dataCaracteristicas = [];
        },
        hideDialogImagenRegistro(){
            this.imagenRegistroDialog = false;
        },
        hideDialogImagenes(){
            this.imagenesDialog = false;
        },
        hideDialogCaracteristicas(){
            this.caracteristicasDialog = false;
            this.caracteristica = null;
        },
        agregarCaracteristica(){
            this.caracteristicasDialog = true;
            this.caracteristica = null;
        },
        guardarCaracteristica(){
            this.dataCaracteristicas.push(
                {
                    caracteristica: this.caracteristica,
                    equipo: null,
                    estado: "A",
                    idCaracteristica: null
                }
            );
            this.caracteristica = null;
            this.caracteristicasDialog = false;
        },
        eliminarCaracteristica(data){
            if(data.idCaracteristica == null){
                let index = this.dataCaracteristicas.indexOf(data);
                this.dataCaracteristicas.splice(index,1);
            }else{
                data.equipo = null;
                this.caracteristicaService.eliminar(data).then(() => {
                    let index = this.dataCaracteristicas.indexOf(data);
                    this.dataCaracteristicas.splice(index,1);
                })
                .catch(() => {
                });
            }
        },
        listarMarcas() {
            this.marcaService.buscarMarcasActivas().then(response => {
                this.valoresMarca = response.data;
            })
            .catch(() => {
            });
        },
        guardarEquipo() {
            this.submitted = true;
            if(this.validarDatos()){
                return;
            }
            this.equipo.marca = this.marcaSeleccionado;
            Swal.fire({ title: 'Grabar equipo', text: "Esta seguro de realizar este Proceso?", icon: 'question', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.equipoService.guardar(this.equipo).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            //tambien hay q grabar las caracteristicas
                            if(this.dataCaracteristicas.length != 0){
                                this.caracteristicaService.guardarListado(this.dataCaracteristicas, this.equipo.idEquipo).then((response) => {
                                    if(response.status == 201){ // se registra el usuario existosamente
                                        mensajeGlobal("", response.status,"","G");
                                        this.limpiarDatos();
                                        this.buscarPorMarca();
                                        this.hideDialog();
                                    }
                                });
                            }else{
                                mensajeGlobal("", response.status,"","G");
                                this.limpiarDatos();
                                this.buscarPorMarca();
                                this.hideDialog();
                            }
                        }
                    });
                }
            });
        },
        cargarImagenes(event){
            this.equipoService.guardarImagenes(event, this.equipo.idEquipo).then(() => {
                this.$toast.add({severity: 'info', summary: 'Correcto', detail: 'Imagenes cargadas corectamente!!', life: 3000});
                this.listarImagenes(this.equipo);
                this.hideDialogImagenes();
            })
            .catch(() => {
            });
        },
        validarDatos(){
            let band = false;
            if(this.marcaSeleccionado.idMarca == null || this.marcaSeleccionado.idMarca == undefined){
                band = true;
            }
            return band;
        },
        limpiarDatos() {
            this.equipo = {};
            this.submitted = false;
            this.marcaSeleccionado = {};
        },
        eliminarImagen(imagen){
            Swal.fire({ title: 'Eliminar imagen', text: "Esta seguro de realizar este Proceso?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    imagen.imagen = null;
                    this.imagenService.eliminarImagen(imagen).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            Swal.fire({position: 'top-end', customClass: { container: 'my-swal' }, title: 'Correcto!', text: "Eliminado correctamente", icon: 'success', showConfirmButton: true, timer: 6000});
                            this.listarImagenes(this.equipo);
                        }
                    });
                }
            });
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