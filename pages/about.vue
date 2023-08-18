<template>
	<div class="container mx-auto p-5">
		<div class="bg-[#293441] p-8 rounded shadow-md w-full mx-auto sm:w-2/3 md:w-3/4 lg:w-2/3">
			<h1 class="text-2xl font-bold mb-4 flex flex-row gap-4" style="align-items: center">
				<button class="btn btn-sm btn-circle btn-ghost" @click="$router.push('/')">
					<Icon name="ion:chevron-left"></Icon>
				</button>

				<span>Sobre a Calculadora de Juros Compostos</span>
			</h1>

			<p class="mb-6">
				Bem-vindo à nossa Calculadora de Juros Compostos, uma ferramenta desenvolvida por Luiz e Yago como parte do nosso
				projeto de desenvolvimento de front-ends. Aqui, você pode explorar como seus investimentos podem crescer ao longo do
				tempo com base em taxas de juros compostos. É simples, intuitivo e informativo!
			</p>

			<h2 class="text-lg font-semibold mb-2">Como funciona:</h2>
			<ol class="list-decimal pl-6 mb-6">
				<li>
					Escolha uma taxa de juros: Selecione uma taxa de juros predefinida da nossa parceria com a API Brasil para começar.
					As taxas são atualizadas regularmente, garantindo que você esteja sempre por dentro das tendências.
				</li>
				<li>
					Informe o período: Escolha o período de tempo durante o qual você deseja visualizar o crescimento do seu
					investimento. Pode ser alguns meses, anos ou décadas!
				</li>
				<li>
					Veja os resultados: Nossa calculadora irá processar suas informações e mostrar a você uma tabela detalhada e um
					gráfico visual que representam como o seu investimento pode crescer ao longo do tempo, com base nas configurações
					selecionadas.
				</li>
			</ol>

			<p class="text-sm mb-6">
				<b>Aviso Importante:</b><br />Queremos ressaltar que os resultados fornecidos pela Calculadora de Juros Compostos são
				apenas estimativas e não devem ser considerados como recomendações de investimento. Os valores apresentados são
				aproximados e não é possível prever com exatidão o desempenho real de um investimento. A Calculadora é uma ferramenta
				educacional destinada a ajudá-lo a entender os conceitos de juros compostos e como eles podem impactar seus
				investimentos ao longo do tempo.
			</p>

			<p class="text-sm">
				Lembramos a todos os usuários que é fundamental realizar pesquisas e buscar orientações de profissionais qualificados
				antes de tomar qualquer decisão de investimento.
			</p>

			<p class="mt-8 text-xs">Atenciosamente,<br />Luiz e Yago</p>
		</div>
	</div>
</template>
