<template>
    <div class="p-grid">
        <div class="p-col-12">
            <div class="card">
                <Toast />
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <Button label="Nuevo" icon="pi pi-plus" class="p-button-success p-mr-2" @click="nuevoRegistro" />
                    </template>
                </Toolbar>
                <DataTable
                    class="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-responsive p-datatable-customers"
                    :value="dataCategoria"
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
                            <h5 class="p-m-0"> Categorias </h5>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <template #empty> No se encontraron Registros. </template>
                    <template #loading> Cargando Registros, por favor espere un momento. </template>
                    <Column field="codigo" header="Código" headerStyle="width: 7em;">
                        <template #body="slotProps">
                            <span class="p-column-title"> Código:</span>
                            {{ slotProps.data.idCategoria }}
                        </template>
                    </Column>
                    <Column field="categoria" header="Categoría">
                        <template #body="slotProps">
                            <span class="p-column-title"> Categoría:</span>
                            <span  :class="'customer-badge'">{{slotProps.data.categoria}} </span>
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
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="eliminarRegistro(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog :visible.sync="categoriaDialog" :style="{ width: '500px' }" header="Mantenimiento de categoría" :modal="true" class="p-fluid" :position="position" @hide="hideDialog">
                    <div class="col-md-12 p-lg-12">
                        <div class="p-field p-grid">
                            <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Código:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="codigo" v-model.trim="categoria.idCategoria" disabled/>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <label for="categoria" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Categoría:</label>
                            <div class="p-col-12 p-md-10">
                                <InputText id="categoria" v-model="categoria.categoria" required="true" autofocus :class="{'p-invalid': submitted && !categoria.categoria}"/>
                                <small class="p-invalid" v-if="submitted && !categoria.categoria"> Categoría es obligatorio </small>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Guardar" icon="pi pi-save" class="p-button-primary p-mr-2" @click='guardar' />
                        <Button label="Salir" icon="pi pi-times" class="p-button-danger p-mr-2" @click="hideDialog"/>
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import Globals from "../../js/Globales";
import Swal from 'sweetalert2';
import CategoriaService from "../../service/administracion/CategoriaService";
export default {
    name: 'CategoriaP',
    data() {
        return {
            dataCategoria: [],
            categoria: {},

            rango: Globals[0].paginacion.rango,
            filters: {},
            position: "top",
            categoriaDialog: false,

            submitted: false,
        };
    },
    categoriaService: null,
    
    created() {
        this.categoriaService = new CategoriaService();
    },

    mounted() {
        this.listarCategorias();
    },

    components: {
    },

    methods: {
        listarCategorias() {
            this.categoriaService.buscarCategoriasActivas().then((response) => {
                this.dataCategoria = response.data;
            }).catch(() => {
            });
        },

        hideDialog(){
            this.categoriaDialog = false;
        },

        nuevoRegistro() {
            this.categoriaDialog = true;
            this.categoria = {};
        },

        async editarRegistro(categoria) {
            this.categoriaDialog = true;
            this.categoria = { ...categoria };
        },

        guardar(){
            this.submitted = true;
            if(!this.validarDatos()){
                Swal.fire({ title: 'Grabar datos', text: "Esta seguro de realizar el proceso" , icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.categoria.estado = "A";
                        this.categoriaService.guardar(this.categoria).then((response) => {
                            if(response.status == 201){ // se registra el usuario existosamente
                                Swal.fire({ position: 'center', customClass: { container: 'my-swal' }, title: 'Correcto!', text: "Grabado correctamente", icon: 'success', showConfirmButton: true, timer: 6000 });
                                this.listarCategorias();
                                this.limpiarDatos();
                                this.categoriaDialog = false;
                            }
                        }).catch(() => {
                            Swal.fire({ position: 'center', title: 'Advertencia!', text: "Error al grabar", icon: 'warning', showConfirmButton: true, timer: 6000 });
                        });
                    }
                });
            }
        },

        eliminarRegistro(data){
            Swal.fire({ title: 'Advertencia', text: "Desea Eliminar el Registro?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    data.estado = "I";
                    this.categoriaService.guardar(data).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            Swal.fire({ position: 'center', customClass: { container: 'my-swal' }, title: 'Correcto!', text: "Eliminado correctamente", icon: 'success', showConfirmButton: true, timer: 6000 });
                            this.listarCategorias();
                            this.limpiarDatos();
                            this.categoriaDialog = false;
                        }
                    }).catch(() => {
                        Swal.fire({ position: 'center', title: 'Advertencia!', text: "Error al eliminar", icon: 'warning', showConfirmButton: true, timer: 6000 });
                    });
                }
            })
        },

        validarDatos(){
            let band = false;
            if(this.categoria.categoria == null || this.categoria.categoria == undefined || this.categoria.categoria == ""){
                band = true;
            }
            return band;
        },

        limpiarDatos(){
            this.submitted = false;
            this.categoria = {};
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