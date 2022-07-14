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
                    :value="dataMarca"
                    :rowHover="true"
                    dataKey="idMarca"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions=rango
                    currentPageReportTemplate="Mostrar {first} hasta {last} de {totalRecords} Registros">
                    <template #header>
                        <div class="table-header">
                            <h5 class="p-m-0"> Marcas </h5>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <template #empty> No se encontraron Registros. </template>
                    <template #loading> Cargando Registros, por favor espere un momento. </template>
                    <Column field="marca" header="Marca" >
                        <template #body="slotProps">
                            <span class="p-column-title"> Marca:</span>
                            {{ slotProps.data.marca }}
                        </template>
                    </Column>
                    <Column field="logo" header="Logo">
                        <template #body="slotProps">
                            <span class="p-column-title"> Logo:</span>
                            <img :src="convertirImagen(slotProps.data.logo)" height="50" />
                        </template>
                    </Column>
                    <Column field="posicion" header="Posición" headerStyle="width: 7em;">
                        <template #body="slotProps">
                            <span class="p-column-title"> Posición:</span>
                            {{ slotProps.data.posicion }}
                        </template>
                    </Column>
                    <Column headerStyle="width: 7em;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editarRegistro(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog :visible.sync="marcaDialog" :style="{ width: '500px' }" header="Marcas" :modal="true" class="p-fluid" :position="position" @hide="hideDialog">
                    <div class="col-md-12 p-lg-12">
                        <div class="p-field p-grid">
                            <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Código:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="codigo" v-model.trim="marca.idMarca" disabled/>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="marca" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Marca:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="marca" v-model.trim="marca.marca" maxlength=100 required="true" autofocus :class="{'p-invalid': submitted && !marca.marca}"/>
                                <small class="p-invalid" v-if="submitted && !marca.marca"> Marca es obligatorio </small>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="marca" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Posición:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="marca" v-model.trim="marca.posicion" maxlength=2 required="true" autofocus :class="{'p-invalid': submitted && !marca.posicion}"/>
                                <small class="p-invalid" v-if="submitted && !marca.posicion"> Posición es obligatorio </small>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Logo:</label>
                            <div class="p-col-12 p-md-10">
                                <input type="file" ref="file" @change="selectFile" />
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"></label>
                            <div class="p-col-12 p-md-10">
                                <img :src="logoMarca" height="50"/>
                            </div>
                        </div>
                        <small>Es recomendado que las imagenes tengan una dimensión de 300x52 px </small>
                    </div>
                    <template #footer>
                        <Button label="Guardar" icon="pi pi-save" class="p-button-primary p-mr-2" @click='guardarMarca' />
                        <Button label="Salir" icon="pi pi-times" class="p-button-danger p-mr-2" @click="hideDialog"/>
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import MarcaService from "../../service/equipos/MarcaService";
import Globals from "../../js/Globales";
import mensajeGlobal from "../../js/mensajesGlobales";

export default {
    name: 'UsuarioP',
    data() {
        return {
            dataMarca: null,
            marca: {},

            rango: Globals[0].paginacion.rango,
            filters: {},
            position: "top",
            marcaDialog: false,

            selectedFiles: undefined,
            currentFile: undefined,
            logoMarca: null,
            submitted: false,
        };
    },
    marcaService: null,
    
    created() {
        this.marcaService = new MarcaService();
    },

    mounted() {
        this.listarMarcas();
    },

    components: {
    },

    methods: {
        listarMarcas() {
            this.dataMarca = [];
            this.marcaService.buscarTodasMarcas().then((response) => {
                this.dataMarca = response.data;
            }).catch(() => {
            });
        },
        hideDialog(){
            this.marcaDialog = false;
        },
        nuevoRegistro() {
            this.marcaDialog = true;
            this.marca = {};
            this.clave = null;
            this.logoMarca = "assets/layout/images/user_default2.png";
        },
        async editarRegistro(marca) {
            this.marcaDialog = true;
            this.marca = { ...marca };
            this.logoMarca = null;
            if(marca.logo != "" || marca.logo != null || marca.logo != undefined){
                this.logoMarca = "data:image/png;base64," + marca.logo;
            }
        },

        selectFile() {
            this.selectedFiles = this.$refs.file.files;
        },

        guardarMarca(){
            this.submitted = true;
            if(!this.validarDatos()){
                this.marca.estado = "A";
                if(!(this.selectedFiles === undefined || this.selectedFiles === null)){
                    this.currentFile = this.selectedFiles.item(0);
                }
                this.marcaService.guardarMarca(this.marca).then((response) => {
                    if(response.status == 201){ // se registra el usuario existosamente
                        mensajeGlobal("", response.status,"","G");
                        let dataMarca = response.data.marca;
                        setTimeout(() => {
                            if(!(this.currentFile === null || this.currentFile === undefined)){ 
                                this.marcaService.guardarLogoMarca(this.currentFile, dataMarca.idMarca).then(files => {
                                    this.logoMarca = "data:image/png;base64," + files.data;
                                })
                                .catch(() => {
                                    this.currentFile = undefined;
                                    this.logoMarca = "assets/layout/images/user_default2.png";
                                });
                            }  
                            setTimeout(() => {
                                this.limpiarDatos();
                                this.listarMarcas();
                                this.hideDialog();
                            }, 150);
                        }, 200);
                    }
                });
            }
        },

        validarDatos(){
            let band = false;
            if(this.marca.marca == null || this.marca.marca == undefined || this.marca.marca == ""){
                band = true;
            }
            return band;
        },

        limpiarDatos(){
            this.submitted = false;
            this.marca = {};
            this.selectedFiles = undefined;
            this.currentFile = undefined;
            this.logoMarca = null;
        },
        convertirImagen(imagen){
            return "data:image/png;base64," + imagen;
        },
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