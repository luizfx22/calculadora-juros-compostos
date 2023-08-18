<script lang="ts" setup>
import { parseCurrency, formatCurrency } from "@brazilian-utils/brazilian-utils";

const props = defineProps({
	modelValue: {
		type: String,
	},
	class: {
		type: String,
		default: "",
	},
	currencySymbol: {
		type: String,
		default: "R$",
	},
	symbolPosition: {
		type: String,
		default: "left",
	},
});

const emit = defineEmits(["update:modelValue"]);

const formattedValue = ref("");

function applyCurrencyMask(value: string) {
	let formatted = `${formatCurrency(parseCurrency(value))}`;

	if (props.symbolPosition === "left") {
		formatted = `${props.currencySymbol} ${formatted}`;
	}

	if (props.symbolPosition === "right") {
		formatted = `${formatted} ${props.currencySymbol}`;
	}

	return formatted;
}

const value = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

function handleInput(event: any) {
	formattedValue.value = applyCurrencyMask(event.target.value);
	value.value = formattedValue.value.replace(/[^\d]+/gi, ""); // Update the parent component value
}

watch(
	() => props.modelValue,
	() => {
		formattedValue.value = applyCurrencyMask(props.modelValue || "");
	}
);

onMounted(() => {
	formattedValue.value = applyCurrencyMask(props.modelValue || "");
});
</script>
<template>
	<input :class="props.class" v-model="formattedValue" @input="handleInput" />
</template>
