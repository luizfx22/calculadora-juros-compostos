<script lang="ts" setup>
import axios from "axios";
import anime from "animejs";
import { parseCurrency, formatCurrency } from "@brazilian-utils/brazilian-utils";

useHead({
	title: "Calcular",
});

type ITaxa = {
	nome: string;
	valor: number | string;
};

interface Resultado {
	mes: number;
	totalInvestido: number;
	taxaDeJuros: number;
	totalJuros: number;
	totalAcumulado: number;
}

const taxas = ref<ITaxa[]>();

async function getTaxas() {
	const { data } = await axios.get<ITaxa[]>("https://brasilapi.com.br/api/taxas/v1");
	taxas.value = data.map((taxa, i) => ({ ...taxa, valor: formatCurrency(Number(taxa.valor)) }));
}

function toFixed(num: number, fixed: number) {
	var re = new RegExp("^-?\\d+(?:\.\\d{0," + (fixed || -1) + "})?");
	return Number(num.toString()?.match(re)?.[0]);
}

function calcular(principal: number, juros_: number, aportesMensais: number, tempoEmMeses: number) {
	const resultado: Resultado[] = [];

	const taxaDeJurosMensal = toFixed(Math.pow(1 + juros_ / 100, 1 / 12) - 1, 6);

	for (let i = 0; i <= tempoEmMeses; i++) {
		if (i === 0) {
			resultado.push({
				mes: i,
				totalInvestido: principal,
				taxaDeJuros: 0,
				totalJuros: 0,
				totalAcumulado: principal,
			});

			continue;
		}

		const resultadoAnterior = resultado[i - 1];

		const totalInvestido = toFixed(resultadoAnterior.totalInvestido + aportesMensais, 2);
		const taxaDeJuros = toFixed(totalInvestido * taxaDeJurosMensal, 2);
		const totalJuros = toFixed(resultadoAnterior.totalJuros + taxaDeJuros, 2);
		const totalAcumulado = toFixed(totalInvestido + totalJuros, 2);

		resultado.push({
			mes: i,
			totalInvestido,
			taxaDeJuros,
			totalJuros,
			totalAcumulado,
		});
	}

	return resultado;
}

const jurosSelect = ref("0.0");
const formCalculadora = reactive({
	vrInicial: "0.00",
	jurosMes: "0.0",
	aportesMes: "0.00",
	tempo: 1,
});

const chartOptions = reactive({
	xAxis: {
		type: "category",
		data: [],
	},
	yAxis: {
		type: "value",
	},
	legend: {
		data: ["Total investido", "Total acumulado", "Total juros"],
		bottom: 12,
	},
	tooltip: {
		trigger: "axis",
	},
	series: [
		{
			name: "Total investido",
			data: [],
			type: "line",
		},
		{
			name: "Total acumulado",
			data: [],
			type: "line",
		},
		{
			name: "Total juros",
			data: [],
			type: "line",
		},
	],
});

const result = computed(() => {
	return calcular(
		parseCurrency(formCalculadora.vrInicial),
		parseCurrency(formCalculadora.jurosMes),
		parseCurrency(formCalculadora.aportesMes),
		formCalculadora.tempo
	);
});

watch(jurosSelect, (newValue) => {
	formCalculadora.jurosMes = newValue;
});

watch(
	result,
	(newValue) => {
		chartOptions.xAxis.data = newValue.map((r) => `${r.mes}`) as any;
		chartOptions.series[0].data = newValue.map((r) => r.totalInvestido) as any;
		chartOptions.series[1].data = newValue.map((r) => r.totalAcumulado) as any;
		chartOptions.series[2].data = newValue.map((r) => r.totalJuros) as any;
	},
	{ deep: true }
);

onMounted(async () => {
	await getTaxas();

	formCalculadora.tempo = 0;
	formCalculadora.vrInicial = "0.00";
	formCalculadora.jurosMes = "0.0";
	formCalculadora.aportesMes = "0.00";
});

// Anime js values animation from result (getting the last value)
const animated = reactive({
	totalInvestido: 0,
	totalJuros: 0,
	totalAcumulado: 0,
});
watch(
	() => result.value[result.value.length - 1],
	(newValue) => {
		anime({
			targets: animated,
			totalInvestido: newValue.totalInvestido,
			totalJuros: newValue.totalJuros,
			totalAcumulado: newValue.totalAcumulado,
			duration: 1500,
			easing: "easeOutExpo",
		});
	},
	{ deep: true }
);

//
</script>

<template>
	<div class="container mx-auto p-5">
		<!-- Fields to calculate -->
		<div class="p-4 bg-[#293441] rounded-md shadow-md grid grid-cols-5 gap-4">
			<div class="col-span-5">
				<h1 class="text-xl text-white">Calculadora de Juros Compostos</h1>
			</div>

			<div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-1">
				<label for="vrInicial">Valor inicial</label>
				<CurrencyInput class="input input-bordered w-full" v-model="formCalculadora.vrInicial" />
			</div>

			<div class="flex flex-col gap-2 col-span-2 md:col-span-1 lg:col-span-1">
				<label for="jurosMes">Juros mensal</label>
				<CurrencyInput
					currency-symbol="%"
					symbol-position="right"
					class="input input-bordered w-full"
					v-model="formCalculadora.jurosMes"
				/>
			</div>

			<div class="flex flex-col gap-2 col-span-5 md:col-span-2 lg:col-span-1">
				<label for="jurosMes">Taxa de juros (predefinição)</label>
				<select class="select select-bordered w-full" v-model="jurosSelect">
					<option value="0.0" selected disabled>Selecione uma</option>
					<option v-for="(taxa, o) in taxas" :key="o" :value="taxa.valor">{{ taxa.nome }}</option>
				</select>
			</div>

			<div class="flex flex-col gap-2 col-span-3 md:col-span-3 lg:col-span-1">
				<label for="aportesMes">Aportes mensais</label>
				<CurrencyInput class="input input-bordered w-full" v-model="formCalculadora.aportesMes" />
			</div>

			<div class="flex flex-col gap-2 col-span-2 lg:col-span-1">
				<label for="tempo">Tempo (meses)</label>
				<input class="input input-bordered w-full" type="number" v-model.number="formCalculadora.tempo" min="0" max="1000" />
			</div>
		</div>

		<!-- Totals fields -->
		<div class="py-4 px-4 bg-[#293441] rounded-md shadow-md grid grid-cols-3 gap-4 mt-4">
			<div class="flex flex-col mb-4 md:mb-0 col-span-3 md:col-span-1">
				<p>Valor investido</p>
				<h1 class="text-2xl text-white">R$ {{ formatCurrency(animated.totalInvestido) }}</h1>
			</div>

			<div class="flex flex-col mb-4 md:mb-0 col-span-3 md:col-span-1">
				<p>Total juros</p>
				<h1 class="text-2xl text-white">R$ {{ formatCurrency(animated.totalJuros) }}</h1>
			</div>

			<div class="flex flex-col col-span-3 md:col-span-1">
				<p>Total acumulado</p>
				<h1 class="text-2xl text-white">R$ {{ formatCurrency(animated.totalAcumulado) }}</h1>
			</div>
		</div>

		<!-- A flex container with two columns that wrap when mobile -->
		<div class="grid grid-cols-4 gap-4 mt-4">
			<!-- Chart -->
			<div class="rounded-md shadow-md p-2 bg-[#293441] flex flex-col col-span-4 xl:col-span-2">
				<Chart class="w-full" height="400px" v-model="chartOptions" />
			</div>

			<!-- Result -->
			<div class="rounded-md shadow-md p-2 bg-[#293441] flex flex-col col-span-4 xl:col-span-2">
				<div class="overflow-x-auto md:overflow-x-hidden overflow-y-auto h-[400px] w-full">
					<table class="table w-full">
						<thead class="sticky">
							<tr>
								<th>Mês</th>
								<th>Total investido</th>
								<th>Taxa de juros</th>
								<th>Total juros</th>
								<th>Total acumulado</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(r, i) in result" :key="i">
								<td>{{ r.mes }}</td>
								<td>R$ {{ formatCurrency(r.totalInvestido) }}</td>
								<td>R$ {{ formatCurrency(r.taxaDeJuros) }}</td>
								<td>R$ {{ formatCurrency(r.totalJuros) }}</td>
								<td>R$ {{ formatCurrency(r.totalAcumulado) }}</td>
							</tr>
						</tbody>
					</table>

					<!-- Show a message if there is no result -->
					<div v-if="result.length === 0" class="flex flex-col items-center justify-center h-full">
						<div class="text-2xl font-bold">Sem resultados</div>
						<div class="text-gray-500">Preencha os campos acima para calcular</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
