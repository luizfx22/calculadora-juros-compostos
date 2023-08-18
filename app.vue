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
<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
