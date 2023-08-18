<script lang="ts" setup>
import axios from "axios";
import { parseCurrency, formatCurrency } from "@brazilian-utils/brazilian-utils";

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

//
</script>

<template>
	<div class="container mx-auto p-5">
		<!-- Fields to calculate -->
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex flex-col gap-2 md:w-1/2">
				<label for="vrInicial">Valor inicial</label>
				<CurrencyInput class="input input-bordered w-full" v-model="formCalculadora.vrInicial" />
			</div>

			<div class="flex flex-col gap-2 w-full md:w-1/2">
				<label for="jurosMes">Juros mensal</label>
				<CurrencyInput
					currency-symbol="%"
					symbol-position="right"
					class="input input-bordered w-full"
					v-model="formCalculadora.jurosMes"
				/>
			</div>

			<div class="flex flex-col gap-2 w-full md:w-1/2">
				<label for="jurosMes">Taxas padrão</label>
				<select class="select select-bordered w-full" v-model="jurosSelect">
					<option value="0.0" selected disabled>Selecione uma</option>
					<option v-for="(taxa, o) in taxas" :key="o" :value="taxa.valor">{{ taxa.nome }}</option>
				</select>
			</div>

			<div class="flex flex-col gap-2 w-full md:w-1/2">
				<label for="aportesMes">Aportes mensais</label>
				<CurrencyInput class="input input-bordered w-full" v-model="formCalculadora.aportesMes" />
			</div>

			<div class="flex flex-col gap-2 w-full md:w-1/2">
				<label for="tempo">Tempo (meses)</label>
				<input class="input input-bordered w-full" type="number" v-model.number="formCalculadora.tempo" min="0" max="1000" />
			</div>
		</div>

		<!-- A flex container with two columns that wrap when mobile -->
		<div class="flex flex-col md:flex-row gap-4 mt-4">
			<!-- Chart -->
			<div class="flex flex-col md:flex-row gap-4 md:w-1/2">
				<Chart class="w-full" height="400px" v-model="chartOptions" />
			</div>

			<!-- Result -->
			<div class="flex flex-col md:flex-row gap-4 md:w-1/2">
				<div class="overflow-x-hidden overflow-y-auto h-[400px] w-full">
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