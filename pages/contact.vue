<script lang="ts" setup>
// Simulate a form submission
const loading = ref(false);
const messageSent = ref(false);
function submitForm(event: Event) {
	event.preventDefault();

	loading.value = true;

	const form = event.target as HTMLFormElement;

	const formData = new FormData(form);

	const data = Object.fromEntries(formData.entries());

	setTimeout(() => {
		loading.value = false;
		alert(JSON.stringify(data, null, 2));

		// Show success message
		messageSent.value = true;

		setTimeout(() => {
			messageSent.value = false;
		}, 6000);

		// Reset form
		form.reset();
	}, 1500);
}
</script>

<template>
	<div class="container mx-auto p-5">
		<div class="bg-[#293441] p-8 rounded shadow-md w-full mx-auto sm:w-2/3 md:w-3/4 lg:w-2/3">
			<h1 class="text-2xl font-semibold mb-4">Entre em Contato</h1>

			<form class="space-y-4" @submit="submitForm">
				<div class="form-control">
					<label for="name" class="label">Nome</label>
					<input type="text" id="name" name="name" class="input" placeholder="Seu Nome" :disabled="loading" required />
				</div>

				<div class="form-control">
					<label for="email" class="label">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						class="input"
						placeholder="seu.email@example.com"
						:disabled="loading"
						required
					/>
				</div>

				<div class="form-control">
					<label for="message" class="label">Observação</label>
					<textarea
						id="message"
						name="message"
						class="textarea"
						rows="4"
						placeholder="Deixe sua mensagem"
						:disabled="loading"
						required
					></textarea>
				</div>

				<div class="text-center">
					<button type="submit" class="btn btn-primary" :disabled="loading">
						<Icon v-if="loading" name="line-md:loading-twotone-loop"></Icon>
						<Icon v-if="!loading" name="ri:send-plane-fill"></Icon>
						<span>{{ loading ? "Enviando" : "Enviar" }} Mensagem</span>
					</button>
				</div>
			</form>

			<div class="relative">
				<div
					class="absolute alert alert-success mt-4 transition ease-in-out"
					:style="{
						opacity: messageSent ? 1 : 0,
					}"
				>
					<Icon name="ph:check-circle-duotone"></Icon>
					<span>Sua mensagem foi enviada com sucesso!</span>
				</div>
			</div>
		</div>
	</div>
</template>
