
<template>
    <div class="card">
        <iframe src="http://localhost:3000"></iframe>
	</div>
</template>

<script>
import CategoriaService from "../../service/administracion/CategoriaService";
import Swal from 'sweetalert2';
import PedidoService from "../../service/administracion/PedidoService";

export default {
    data() {
        return {
            valoresCategoria: [],
            categoriaSeleccionada: {},

            products: null,
            layout: 'list',
            sortKey: null,
            sortOrder: null,
            sortField: null,
            sortOptions: [
                {label: 'Price High to Low', value: '!price'},
                {label: 'Price Low to High', value: 'price'},
            ],

            pedidoDialog: false,
            pedidoSeleccionado: null,
            dataPedidos: [],
        }
    },
    categoriaService: null,
    pedidoService: null,
    created() {
        this.categoriaService = new CategoriaService();
        this.pedidoService = new PedidoService();
    },
    mounted() {
        this.cargarCategorias();
        this.cargarProductos();
    },
    methods: {
        cargarCategorias(){
            this.categoriaService.buscarActivosMasTodos().then((response) => {
                this.valoresCategoria = response.data;
                this.categoriaSeleccionada = this.valoresCategoria[0];
            });
        },
        cargarProductos(){
            this.products = [];
            this.pedidoService.buscarPedidos().then((response) => {
                this.products = response.data;
                console.log(this.products)
            }).catch(() => {
            });
        },
        convertirImagen(imagen){
            if(imagen != null){
                return "data:image/png;base64," + imagen;
            }
        },
        verOrdenes(data){
            this.pedidoDialog = true;
            this.pedidoSeleccionado = data;
            this.pedidoService.buscarPedidosDetalle(data.idPedido).then((response) => {
                this.dataPedidos = response.data;
                console.log(this.dataPedidos)
            }).catch(() => {
            });
        },
        atender(){
            Swal.fire({ title: 'Atender', text: "Desea atender el pedido?" , icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.pedidoService.atender(this.pedidoSeleccionado.idPedido).then((response) => {
                        if(response.status == 201){ // se registra el usuario existosamente
                            Swal.fire({ position: 'center', customClass: { container: 'my-swal' }, title: 'Correcto!', text: "Grabado correctamente", icon: 'success', showConfirmButton: true, timer: 6000 });
                            this.hideDialog();
                            this.cargarProductos();
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
        hideDialog(){
            this.pedidoDialog = false;
            this.dataPedidos = [];
            this.pedidoSeleccionado = null;
        },
    }
}
</script>

<style lang="scss" scoped>
.card {
    background: #ffffff;
    padding: 2rem;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    border-radius: 4px;
    margin-bottom: 2rem;
}
.p-dropdown {
    width: 14rem;
    font-weight: normal;
}

.product-name {
	font-size: 1.5rem;
	font-weight: 700;
}

.product-description {
	margin: 0 0 1rem 0;
}

.product-category-icon {
	vertical-align: middle;
	margin-right: .5rem;
}

.product-category {
	font-weight: 600;
	vertical-align: middle;
}

::v-deep(.product-list-item) {
	display: flex;
	align-items: center;
	padding: 1rem;
	width: 100%;

	img {
		width: 50px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin-right: 2rem;
	}

	.product-list-detail {
		flex: 1 1 0;
	}

	.p-rating {
		margin: 0 0 .5rem 0;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: .5rem;
		align-self: flex-end;
	}

	.product-list-action {
		display: flex;
		flex-direction: column;
	}

	.p-button {
		margin-bottom: .5rem;
	}
}

::v-deep(.product-grid-item) {
	margin: .5rem;
	border: 1px solid var(--surface-border);

	.product-grid-item-top,
	.product-grid-item-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	img {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin: 2rem 0;
	}

	.product-grid-item-content {
		text-align: center;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
	}
}

@media screen and (max-width: 576px) {
	.product-list-item {
		flex-direction: column;
		align-items: center;

		img {
			margin: 2rem 0;
		}

		.product-list-detail {
			text-align: center;
		}

		.product-price {
			align-self: center;
		}

		.product-list-action {
			display: flex;
			flex-direction: column;
		}

		.product-list-action {
			margin-top: 2rem;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 100%;
		}
	}
}


</style>