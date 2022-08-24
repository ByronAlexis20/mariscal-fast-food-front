 <template>
<div class="p-grid p-fluid dashboard">
	<div class="p-col-12 p-md-6 p-xl-3">
		<div class="highlight-box">
			<div class="initials" style="background-color: #007be5; color: #00448f"><span>$</span></div>
			<div class="highlight-details ">
				<span>Recaudacion diaria</span>
				<span class="count">{{ recaudacionDiaria }}</span>
			</div>
		</div>
	</div>
	<div class="p-col-12 p-md-6 p-xl-3">
		<div class="highlight-box">
			<div class="initials" style="background-color: #ef6262; color: #a83d3b"><span>#</span></div>
			<div class="highlight-details ">
				<span>Pedidos realizados</span>
				<span class="count"> {{ totalPedidosRealizados }}</span>
			</div>
		</div>
	</div>
	<div class="p-col-12 p-md-6 p-xl-3">
		<div class="highlight-box">
			<div class="initials" style="background-color: #20d077; color: #038d4a"><span>#</span></div>
			<div class="highlight-details ">
				<span>Pedidos pendientes</span>
				<span class="count"> {{ totalPedidosPendientes }} </span>
			</div>
		</div>
	</div>
	<div class="p-col-12 p-md-6 p-xl-3">
		<div class="highlight-box">
			<div class="initials" style="background-color: #f9c851; color: #b58c2b"><span>CL</span></div>
			<div class="highlight-details ">
				<span>Total clientes</span>
				<span class="count"> {{ totalClientes }} </span>
			</div>
		</div>
	</div>

	<div class="p-col-12 p-md-6 p-lg-4">
		<Panel header="Productos" >
			<nav>
				<ul class='task-list' style="height: 250px; overflow:hidden; overflow-y:scroll;">
					<li v-for="prod in productos">
						<span class="task-name"> {{ prod.title }} </span>
						<i class="pi pi-list" />
					</li>
				</ul>
			</nav>
		</Panel>
	</div>

	<div class="p-col-12 p-lg-4 contacts">
		<Panel header="Clientes">
			<ul class='task-list' style="height: 250px; overflow:hidden; overflow-y:scroll;">
				<li v-for="cli in clientes">
					<button class="p-link">
						<img src="assets/layout/images/avatar_1.png" width="35" alt="avatar1"/>
						<span class="name"> {{ cli.nombres }} {{ cli.apellidos }} </span>
						<span class="email"> {{ cli.correo }} </span>
					</button>
				</li>
			</ul>
		</Panel>
	</div>

	<div class="p-col-12 p-lg-4">
		<Panel header="Actividad">
			<ul class="activity-list" style="height: 250px">
				<li>
                    <div class="p-d-flex p-jc-between p-ai-center p-mb-3">
                        <h5 class="activity p-m-0">Más vendido: {{ masVendido }} </h5>
                        <div class="count"> {{ cantidadMasVendido }} </div>
                    </div>
                    <ProgressBar :value="100" :showValue="false" />
				</li>
				<li>
					<div class="p-d-flex p-jc-between p-ai-center p-mb-3">
						<h5 class="activity p-m-0">Menos vendido: {{ menosVendido }} </h5>
						<div class="count" style="background-color:#f9c851"> {{ cantidadMenosVendido }} </div>
					</div>
					<ProgressBar :value="25" :showValue="false" />
				</li>
			</ul>
		</Panel>
	</div>
</div>




</template>

<script>
import ProductService from '../service/ProductService';
import EventService from '../service/EventService';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import DashboardService from '../service/administracion/DashboardService';
import ProductoService from '../service/administracion/ProductoService';

export default {
	data() {
		return {
			recaudacionDiaria: null,
			totalPedidosRealizados: null,
			totalPedidosPendientes: null,
			totalClientes: null,
			productos: null,
			clientes: null,
			masVendido: null,
			menosVendido: null,
			cantidadMasVendido: null,
			cantidadMenosVendido: null,

			tasksCheckbox: [],
			dropdownCities: [
				{name: 'New York', code: 'NY'},
				{name: 'Rome', code: 'RM'},
				{name: 'London', code: 'LDN'},
				{name: 'Istanbul', code: 'IST'},
				{name: 'Paris', code: 'PRS'}
			],
			dropdownCity: null,
			options: {
				plugins:[dayGridPlugin, timeGridPlugin, interactionPlugin],
				defaultDate: '2019-01-01',
				header: {
					left: 'prev,next',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay'
				},
				editable: true
			},
			events: null,
			products: null,
			selectedProducts: null,
			lineData: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [
					{
						label: 'First Dataset',
						data: [65, 59, 80, 81, 56, 55, 40],
						fill: false,
						backgroundColor: '#2f4860',
						borderColor: '#2f4860'
					},
					{
						label: 'Second Dataset',
						data: [28, 48, 40, 19, 86, 27, 90],
						fill: false,
						backgroundColor: '#00bb7e',
						borderColor: '#00bb7e'
					}
				]
			},
		}
	},
	productService: null,
	eventService: null,
	dashboardService: null,
	productoService: null,
	created() {
		this.productService = new ProductService();
		this.eventService = new EventService();
		this.dashboardService = new DashboardService();
		this.productoService = new ProductoService();
	},
	mounted() {
		this.productService.getProductsSmall().then(data => this.products = data);
		this.eventService.getEvents().then(data => this.events = data);

		let afId = this.$route.query['af_id'];
        if (afId) {
            let today = new Date();
            let expire = new Date();
            expire.setTime(today.getTime() + 3600000*24*7);
            document.cookie = 'primeaffiliateid=' + afId + ';expires=' + expire.toUTCString() + ';path=/; domain:primefaces.org';
        };
		this.cargarDashboardPorDia();
		this.cargarProductos();
		this.cargarClientes();
	},
	methods: {
		cargarDashboardPorDia(){
			this.dashboardService.consultarDashboardPorDia().then((response) => {
				this.recaudacionDiaria = response.data.recaudacionDiaria;
				this.totalPedidosRealizados = response.data.totalPedidosRealizados;
				this.totalPedidosPendientes = response.data.totalPedidosPendientes;
				this.totalClientes = response.data.totalClientes;
				this.masVendido = response.data.masVendido;
				this.menosVendido = response.data.menosVendido;
				this.cantidadMasVendido = response.data.cantidadMasVendido;
				this.cantidadMenosVendido = response.data.cantidadMenosVendido;
			});
		},
		cargarProductos(){
			this.productoService.buscarTodosActivos().then((response) => {
				this.productos = response.data;
			});
		},
		cargarClientes(){
			this.dashboardService.listarClientesActivos().then((response) => {
				this.clientes = response.data;
			});
		},
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		}
	}
}
</script>

<style lang="scss" scoped>
	@media screen and (max-width: 960px) {
		/deep/ .p-datatable {
			&.p-datatable-customers {
				.p-datatable-thead > tr > th,
				.p-datatable-tfoot > tr > td {
					display: none !important;
				}

				.p-datatable-tbody > tr {
					border-bottom: 1px solid #dee2e6;
					> td {
						text-align: left;
						display: flex;
						align-items: center;
						justify-content: center;
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
