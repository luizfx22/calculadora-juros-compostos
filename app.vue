<script lang="ts" setup>
useHead({
	titleTemplate: (title) => `Calculadora de Juros Compostos - ${title}`,
	meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
	link: [{ rel: "icon", type: "image/svg+xml", href: "/icon.svg" }],
	htmlAttrs: {
		lang: "pt-br",
	},
	bodyAttrs: {},
});

useSeoMeta({
	title: "Calculadora de Juros Compostos",
	description: "Calcular o rendimento de um investimento com juros compostos",
});
</script>
<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
