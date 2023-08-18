<template>
	<div
		class="container mx-auto p-4 rounded-md shadow-lg mt-2 flex flex-row justify-between bg-[#293441]/75 backdrop-blur -mb-px sticky top-0 z-50"
		style="align-items: center"
	>
		<h1 class="text-xl text-white">Calculadora de Juros Compostos</h1>

		<!-- Navigation bar -->
		<div class="flex flex-row gap-4">
			<!-- Home button -->
			<button class="btn btn-sm" :class="$route.name === 'index' ? 'btn-neutral' : 'btn-primary'" @click="$router.push('/')">
				<Icon name="ion:home-outline"></Icon>

				<span>Início</span>
			</button>

			<button
				class="btn btn-sm btn-primary"
				:class="$route.name === 'about' ? 'btn-neutral' : 'btn-primary'"
				@click="$router.push('/about')"
			>
				<Icon name="ion:information-circle-outline"></Icon>
				<span>Sobre nós</span>
			</button>

			<button
				class="btn btn-sm btn-primary"
				:class="$route.name === 'contact' ? 'btn-neutral' : 'btn-primary'"
				@click="$router.push('/contact')"
			>
				<Icon name="ion:mail-outline"></Icon>
				<span>Contato</span>
			</button>
		</div>
	</div>
	<section>
		<slot></slot>
	</section>
</template>
