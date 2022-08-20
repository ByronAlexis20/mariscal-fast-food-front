<template>
    
    <div class="p-grid">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <div class="p-d-flex p-flex-column p-flex-md-row">
                            <div class="p-mb-2 p-mr-2 p-mt-1 p-ml-2">
                                <div v-for="registro of tipoBusqueda" :key="registro.key" class="p-field-radiobutton">
                                    <RadioButton :id="registro.key" name="tipo" :value="registro" v-model="tipoBusquedaSeleccionado" @input="seleccionarTipo"/>
                                    <label :for="registro.key">{{ registro.tipo }}</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-d-flex p-flex-column p-flex-md-row" style="margin-left: 40px;" v-if="seleccionarTipoFiltro">
                            <div class="p-mb-2 p-mr-2 p-mt-1 p-ml-2">
                                <div class="field col-12 md:col-4">
                                    <div class="p-fluid grid formgrid">
                                        <label for="icon">Fecha</label>
                                        <Calendar id="icon" v-model="fecha" :showIcon="true" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-d-flex p-flex-column p-flex-md-row" style="margin-left: 10px;" v-if="seleccionarTipoFiltro">
                            <Button type="button" label="PDF" icon="pi pi-file-pdf" class="p-button-info"  @click="visualizarReportePorFecha" />
                        </div>

                        <div class="p-d-flex p-flex-column p-flex-md-row" style="margin-left: 40px;" v-if="!seleccionarTipoFiltro">
                            <div class="p-mb-2 p-mr-2 p-mt-1 p-ml-2">
                                <div class="field col-12 md:col-4">
                                    <div class="p-fluid grid formgrid">
                                        <label for="icon">Fecha Inicio</label>
                                        <Calendar id="icon" v-model="fechaInicial" :showIcon="true" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-d-flex p-flex-column p-flex-md-row" style="margin-left: 10px;" v-if="!seleccionarTipoFiltro">
                            <div class="p-mb-2 p-mr-2 p-mt-1 p-ml-2">
                                <div class="field col-12 md:col-4">
                                    <div class="p-fluid grid formgrid">
                                        <label for="icon">Fecha Fin</label>
                                        <Calendar id="icon" v-model="fechaFinal" :showIcon="true" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-d-flex p-flex-column p-flex-md-row" style="margin-left: 10px;" v-if="!seleccionarTipoFiltro">
                            <Button type="button" label="PDF" icon="pi pi-file-pdf" class="p-button-info"  @click="visualizarReportePorRangoFecha" />
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
import ReporteService from "../../service/administracion/ReporteService";
export default {
    data() {
        return {
            fecha: new Date(),
            fechaInicial: new Date(),
            fechaFinal: new Date(),
            pdfRuta: null,

            valoresCategoria: [],
            categoriaSeleccionada: {},
            tipoBusqueda: [
                { tipo: 'Por fecha', key: 'PF' },
                { tipo: 'Por Rango de fecha', key: 'RF' }
            ],
            tipoBusquedaSeleccionado: null,
            seleccionarTipoFiltro: true,
        };
    },
    reporteService: null,
    created() {
        this.reporteService = new ReporteService();
    },
    mounted() {
        this.tipoBusquedaSeleccionado = this.tipoBusqueda[0];
    },
    components:{
    },
    methods: {
        seleccionarTipo(){
            if(this.tipoBusquedaSeleccionado.key == "PF"){
                this.seleccionarTipoFiltro = true;
            }else{
                this.seleccionarTipoFiltro = false;
            }
        },
        visualizarReporte(){
            this.reporteService.imprimirReporteVentasPorFecha().then(response => {
                var headers = response.headers;
                var blob = new Blob([response.data],{type:headers['content-type']});
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                console.log(this.pdfRuta)
                this.pdfRuta = link.href;
                
            }).catch(() => {
                Swal.fire({position: 'top', title: 'Advertencia!', text: "Documento no existe", icon: 'warning', showConfirmButton: true, timer: 6000});
            });
        },
        visualizarReportePorFecha(){
            if(this.fecha == null || this.fecha == undefined){
                Swal.fire({position: 'top', title: 'Advertencia!', text: "Fecha no valida", icon: 'warning', showConfirmButton: true, timer: 6000});
                return;
            }
            this.reporteService.imprimirReporteVentasPorFecha(this.fecha).then(response => {
                var headers = response.headers;
                var blob = new Blob([response.data],{type:headers['content-type']});
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                console.log(this.pdfRuta)
                this.pdfRuta = link.href;
                
            }).catch(() => {
                Swal.fire({position: 'top', title: 'Advertencia!', text: "Documento no existe", icon: 'warning', showConfirmButton: true, timer: 6000});
            });
        },
        visualizarReportePorRangoFecha(){
            if(this.fechaInicial == null || this.fechaInicial == undefined){
                Swal.fire({position: 'top', title: 'Advertencia!', text: "Fecha inicial no válida", icon: 'warning', showConfirmButton: true, timer: 6000});
                return;
            }
            if(this.fechaFinal == null || this.fechaFinal == undefined){
                Swal.fire({position: 'top', title: 'Advertencia!', text: "Fecha final no válida", icon: 'warning', showConfirmButton: true, timer: 6000});
                return;
            }
            this.reporteService.imprimirReporteVentasPorRangoFecha(this.fechaInicial, this.fechaFinal).then(response => {
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