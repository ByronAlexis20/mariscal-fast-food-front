<template>
    
    <div class="p-grid">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <div class="p-formgroup-inline">
                            <h1>Reporte de ventas</h1>
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
import PedidoService from "../../service/administracion/PedidoService";
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
    pedidoService: null,
    created() {
        this.pedidoService = new PedidoService();
    },
    mounted() {
        this.visualizarReporte();
    },
    components:{
    },
    methods: {
        visualizarReporte(){
            this.pedidoService.imprimirReporteVentas().then(response => {
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