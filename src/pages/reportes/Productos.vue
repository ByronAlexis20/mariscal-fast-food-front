<template>
    
    <div class="p-grid">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <div class="p-formgroup-inline">
                            <div class="p-field">
                                <label for="fechaInicial" class="p-col-fixed" style="width:100px" >Categoría: </label>
                                <Dropdown v-model="categoriaSeleccionada" :options="valoresCategoria" optionLabel="categoria" placeholder="Seleccione categoría"/>
                            </div>
                            <div class="p-field">
                                <Button type="button" label="PDF" icon="pi pi-file-pdf" class="p-button-info p-mr-2"  @click="visualizarReporte" aria:haspopup="true"/>
                            </div>
                        </div>          
                    </template>
                </Toolbar>
                <div>
                    <embed :src="pdfRuta" type="application/pdf" width="100%" height="600px" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2';
import CategoriaService from "../../service/administracion/CategoriaService";
import ProductoService from "../../service/administracion/ProductoService";
export default {
    data() {
        return {
            fechaInicial: null,
            fechaFinal: null,
            pdfRuta: null,

            valoresCategoria: [],
            categoriaSeleccionada: {},
        };
    },
    categoriaService: null,
    productoService: null,
    created() {
        this.categoriaService = new CategoriaService();
        this.productoService = new ProductoService();
    },
    mounted() {
        this.cargarCategorias();
    },
    components:{
    },
    methods: {
        cargarCategorias(){
            this.categoriaService.buscarActivosMasTodos().then((response) => {
                this.valoresCategoria = response.data;
                this.categoriaSeleccionada = this.valoresCategoria[0];
            });
        },
        visualizarReporte(){
            this.productoService.imprimirReporteProductos(this.categoriaSeleccionada.idCategoria).then(response => {
                var headers = response.headers;
                var blob = new Blob([response.data],{type:headers['content-type']});
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                console.log(this.pdfRuta)
                this.pdfRuta = link.href;
                
            }).catch(() => {
                Swal.fire({position: 'top', title: 'Advertencia!', text: "Documento no existe", icon: 'warning', showConfirmButton: true, timer: 6000});
            });
        }
    }
};
</script>