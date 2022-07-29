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
                    :value="dataProductos" 
                    :expandedRows.sync="expandedRows" 
                    class="p-datatable-customers" 
                    dataKey="idCategoria"
                    responsiveLayout="scroll">
                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column field="categoria" header="Categoria" sortable></Column>
                    <template #expansion="slotProps">
                        <DataTable 
                            :value="slotProps.data.productos" 
                            responsiveLayout="scroll">
                            <Column field="nombreProducto" header="Nombre" sortable></Column>
                            <Column field="precio" header="Precio" sortable></Column>
                            <Column field="stock" header="Stock" sortable></Column>
                            <Column headerStyle="width: 9em;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editarRegistro(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="eliminarRegistro(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </DataTable>
            </div>
        </div>
        <Dialog :visible.sync="productoDialog" :style="{ width: '500px' }" :contentStyle="{'overflow': 'visible'}" header="Registro de productos" :modal="true" class="p-fluid" :position="position" @hide="hideDialog">
            <div class="col-md-12 p-lg-12">
                <div class="p-field p-grid">
                    <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Código:</label>
                    <div class="p-col-12 p-md-10">
                        <InputText id="codigo" v-model.trim="producto.idProducto" disabled/>
                    </div>
                </div>
                <div class="p-field p-grid">
                    <label for="perfil" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Categoría: </label>
                    <div class="p-col-12 p-md-10"> 
                        <Dropdown v-model="categoriaSeleccionado" :options="valoresCategoria" optionLabel="categoria" placeholder="Seleccione categoría"/>
                        <small class="p-invalid" v-if="submitted && !categoriaSeleccionado.idCategoria"> Categoria es obligatorio </small>
                    </div>
                </div>
                <div class="p-field p-grid">
                    <label for="nombre" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Nombre:</label>
                    <div class="p-col-12 p-md-10">
                        <InputText id="nombre" v-model="producto.nombreProducto" required="true" autofocus :class="{'p-invalid': submitted && !producto.nombreProducto}"/>
                        <small class="p-invalid" v-if="submitted && !producto.nombreProducto"> Nombre es obligatorio </small>
                    </div>
                </div>
                <div class="p-field p-grid">
                    <label for="precio" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Precio:</label>
                    <div class="p-col-12 p-md-10">
                        <InputText id="precio" v-model="producto.precio" required="true" autofocus :class="{'p-invalid': submitted && !producto.precio}"/>
                        <small class="p-invalid" v-if="submitted && !producto.precio"> Precio es obligatorio </small>
                    </div>
                </div>
                <div class="p-field p-grid">
                    <label for="precio" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"> Stock:</label>
                    <div class="p-col-12 p-md-10">
                        <InputText id="precio" v-model="producto.stock" required="true" autofocus :class="{'p-invalid': submitted && !producto.stock}"/>
                        <small class="p-invalid" v-if="submitted && !producto.stock"> Stock es obligatorio </small>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Guardar" icon="pi pi-save" class="p-button-primary p-mr-2" @click='guardar' />
                <Button label="Salir" icon="pi pi-times" class="p-button-danger p-mr-2" @click="hideDialog"/>
            </template>
        </Dialog>
    </div>
</template>

<script>
import Globals from "../../js/Globales";
import Swal from 'sweetalert2';
import ProductoService from "../../service/administracion/ProductoService";
import CategoriaService from "../../service/administracion/CategoriaService";
export default {
    name: 'CategoriaP',
    data() {
        return {
            dataProductos: [],
            producto: {},
            
            categoriaSeleccionado: {},
            valoresCategoria: [],

            rango: Globals[0].paginacion.rango,
            filters: {},
            position: "top",
            productoDialog: false,

            submitted: false,
            expandedRowGroups: null,
            expandedRows: []
        };
    },
    productoService: null,
    categoriaService: null,
    created() {
        this.productoService = new ProductoService();
        this.categoriaService = new CategoriaService();
    },

    mounted() {
        this.listarProductos();
        this.listarCategoria();
    },

    components: {
    },

    methods: {
        listarProductos() {
            this.productoService.buscarProductosActivas().then((response) => {
                this.dataProductos = response.data;
                console.log(this.dataProductos)
            }).catch(() => {
            });
        },
        listarCategoria(){
            this.categoriaService.buscarCategoriasActivas().then((response) => {
                this.valoresCategoria = response.data;
            }).catch(() => {
            });
        },

        hideDialog(){
            this.productoDialog = false;
            this.submitted = false;
        },

        nuevoRegistro() {
            this.submitted = false;
            this.productoDialog = true;
            this.producto = {};
        },

        async editarRegistro(producto) {
            this.submitted = false;
            this.productoDialog = true;
            this.producto = { ...producto };
            this.categoriaSeleccionado = this.valoresCategoria.find(
                (o) => o.idCategoria === this.producto.idCategoria
            );
        },

        guardar(){
            this.submitted = true;
            if(this.validarDatos()){
                return;
            }
            this.producto.idCategoria = this.categoriaSeleccionado.idCategoria;
            Swal.fire({ title: 'Grabar datos', text: "Esta seguro de realizar el proceso" , icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.producto.estado = "A";
                    this.productoService.guardarProducto(this.producto).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            Swal.fire({ position: 'center', customClass: { container: 'my-swal' }, title: 'Correcto!', text: "Grabado correctamente", icon: 'success', showConfirmButton: true, timer: 6000 });
                            this.hideDialog();
                            this.listarProductos();
                            this.limpiarDatos();
                        }
                    }).catch(() => {
                        Swal.fire({ position: 'center', title: 'Advertencia!', text: "Error al grabar", icon: 'warning', showConfirmButton: true, timer: 6000 });
                    });
                }
            });
        },

        validarDatos(){
            let band = false;
            if(this.categoriaSeleccionado.idCategoria == null || this.categoriaSeleccionado.idCategoria == undefined || this.categoriaSeleccionado.idCategoria == ""){
                band = true;
            }
            if(this.producto.nombreProducto == null || this.producto.nombreProducto == undefined || this.producto.nombreProducto == ""){
                band = true;
            }
            if(this.producto.precio == null || this.producto.precio == undefined || this.producto.precio == ""){
                band = true;
            }
            if(this.producto.stock == null || this.producto.stock == undefined || this.producto.stock == ""){
                band = true;
            }
            return band;
        },

        limpiarDatos(){
            this.producto = {};
        },

        eliminarRegistro(data){
            Swal.fire({ title: 'Advertencia', text: "Desea Eliminar el Registro?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    data.estado = "I";
                    this.productoService.guardarProducto(data).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            Swal.fire({ position: 'center', customClass: { container: 'my-swal' }, title: 'Correcto!', text: "Eliminado correctamente", icon: 'success', showConfirmButton: true, timer: 6000 });
                            this.hideDialog();
                            this.listarProductos();
                            this.limpiarDatos();
                        }
                    }).catch(() => {
                        Swal.fire({ position: 'center', title: 'Advertencia!', text: "Error al eliminar", icon: 'warning', showConfirmButton: true, timer: 6000 });
                    });
                }
            })
        },

        expandAll() {
            this.expandedRows = this.products.filter(p => p.id);
            this.$toast.add({severity: 'success', summary: 'All Rows Expanded', life: 3000});
        },

        collapseAll() {
            this.expandedRows = null;
            this.$toast.add({severity: 'success', summary: 'All Rows Collapsed', life: 3000});
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

.p-datatable .p-column-filter {
	display: none;
}

.table-header {
	display: flex;
	justify-content: space-between;
}

/deep/ .p-datatable.p-datatable-customers {
	.p-datatable-header {
		padding: 0rem;
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

	&.status-unqualified {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-negotiation {
		background: #FEEDAF;
		color: #8A5340;
	}

	&.status-new {
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
