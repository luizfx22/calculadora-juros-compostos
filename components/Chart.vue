<script lang="ts" setup>
import * as echarts from "echarts";

const props = defineProps({
	modelValue: {
		type: Object,
	},
	width: {
		type: String,
	},
	height: {
		type: String,
	},
});

const chart = ref<null>(null);
let chartInstance: echarts.ECharts;

onMounted(() => {
	chartInstance = echarts.init(chart.value, "dark");
	chartInstance.setOption(props.modelValue as any);
});

computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

watch(
	() => props.modelValue,
	(newValue) => {
		chartInstance.dispose();

		chartInstance = echarts.init(chart.value, "dark");
		chartInstance.resize();
		chartInstance.setOption(newValue as any);
	},
	{ deep: true }
);

const emit = defineEmits(["update:modelValue"]);

//
</script>
<template>
	<div ref="chart" class="rounded-md" :style="{ width: width ?? '100%', height: height ?? '200px' }"></div>
</template>
