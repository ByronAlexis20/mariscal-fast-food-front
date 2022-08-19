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
                            <Column field="imagen" header="Imagen" style="text-align: center"> 
                                <template #body="slotProps">
                                    <div style="text-align: center">
                                        <span class="p-column-title"> Imagen:</span>
                                        <img :src="convertirImagen(slotProps.data.imagen)" width="90" height="120" class="product-image"/>
                                    </div>
                                </template>
                            </Column>
                            <Column headerStyle="width: 10em;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-1" v-tooltip.top="'Editar'" @click="editarRegistro(slotProps.data)" />
                                    <Button icon="pi pi-eye" class="p-button-rounded p-button-info p-mr-1" v-tooltip.top="'Imagenes'" @click="registrarImagen(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" v-tooltip.top="'Eliminar'" @click="eliminarRegistro(slotProps.data)" />
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
                        <InputText id="codigo" v-model.trim="producto.codigo"/>
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
        <Dialog :visible.sync="imagenRegistroDialog" :style="{ width: '450px', height: '600px' }" :header=nombreProductoSeleccionado :modal="true" class="p-fluid" :position="position" @hide="hideDialogImagenRegistro">
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
        <Dialog :visible.sync="imagenesDialog" :style="{ width: '500px', height: '500px' }" :header=nombreProductoSeleccionado :modal="true" class="p-fluid" :position="position" @hide="hideDialogImagenes">
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
</template>

<script>
import Globals from "../../js/Globales";
import Swal from 'sweetalert2';
import ProductoService from "../../service/administracion/ProductoService";
import CategoriaService from "../../service/administracion/CategoriaService";
import ImagenService from "../../service/administracion/ImagenService";
export default {
    name: 'CategoriaP',
    data() {
        return {
            dataProductos: [],
            producto: {},
            
            dataImagenes: [],

            categoriaSeleccionado: {},
            valoresCategoria: [],

            rango: Globals[0].paginacion.rango,
            filters: {},
            position: "top",
            productoDialog: false,

            submitted: false,
            expandedRowGroups: null,
            expandedRows: [],

            imagenRegistroDialog: false,
            nombreProductoSeleccionado: null,

            imagenesDialog: false,
        };
    },
    productoService: null,
    categoriaService: null,
    imagenService: null,
    created() {
        this.productoService = new ProductoService();
        this.categoriaService = new CategoriaService();
        this.imagenService = new ImagenService();
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
                        }else{
                            if(response.status == 200){
                                Swal.fire({ position: 'center', title: 'Advertencia!', text: "" + response.data.mensaje + "", icon: 'warning', showConfirmButton: true, timer: 6000 });
                                return;
                            }
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

        eliminarImagen(data){
            Swal.fire({ title: 'Advertencia', text: "Desea Eliminar la imagen?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    
                    this.imagenService.eliminarImagen(data.idImagen).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            Swal.fire({ position: 'center', customClass: { container: 'my-swal' }, title: 'Correcto!', text: "Eliminado correctamente", icon: 'success', showConfirmButton: true, timer: 6000 });
                            this.listarImagenes(this.producto);
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

        hideDialogImagenRegistro(){
            this.imagenRegistroDialog = false;
        },

        hideDialogImagenes(){
            this.imagenesDialog = false;
        },

        registrarImagen(producto){
            this.imagenRegistroDialog = true;
            this.producto = { ...producto };
            this.nombreProductoSeleccionado = this.producto.nombreProducto;
            this.listarImagenes(this.producto);
        },

        listarImagenes(prod){
            this.dataImagenes = [];
            this.imagenService.buscarImagenesPorProducto(prod.idProducto).then(response => {
                this.dataImagenes = response.data;
            })
            .catch(() => {
            });
        },

        agregarImagen(){
            this.imagenesDialog = true;
        },

        cargarImagenes(event){
            this.imagenService.guardarImagenes(event, this.producto.idProducto).then(() => {
                this.$toast.add({severity: 'info', summary: 'Correcto', detail: 'Imagenes cargadas corectamente!!', life: 3000});
                this.listarImagenes(this.producto);
                this.hideDialogImagenes();
            })
            .catch(() => {
            });
        },

        convertirImagen(imagen){
            if(imagen != null){
                return "data:image/png;base64," + imagen;
            }
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
	width: 120px;
    height: 100px;
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
