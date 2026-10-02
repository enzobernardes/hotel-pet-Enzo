<script setup>
import { onMounted, ref } from 'vue';

// Endereço base da API (json-server). Iniciar com: npm run api
const API_URL = 'http://localhost:3000';

// ref() cria dados "reativos": quando o valor muda, o Vue atualiza a tela.
const pets = ref([]); // lista de pets recebida da API
const tutores = ref([]); // ainda não carregada (fora do escopo desta atividade)
const carregando = ref(false); // true enquanto a requisição está em andamento
const erro = ref(''); // texto do erro; vazio quando não há erro

// Busca os tutores para montar o nome do tutor em cada pet.
async function carregarTutores() {
  const resposta = await fetch(`${API_URL}/tutores`);

  if (!resposta.ok) {
    throw new Error(`Falha na consulta de tutores: HTTP ${resposta.status}`);
  }

  tutores.value = await resposta.json();
}

// async indica que a função é assíncrona: ela sempre devolve uma Promise e
// permite usar await no seu interior.
async function carregarPets() {
  // Antes de pedir os dados: liga o "Carregando..." e limpa erro anterior.
  carregando.value = true;
  erro.value = '';

  // try/catch: qualquer erro lançado dentro do try desvia para o catch.
  try {
    // fetch() envia a requisição HTTP e devolve uma Promise.
    // await pausa SÓ esta função até a resposta chegar; o resto da página
    // continua funcionando (por isso o "Carregando..." aparece na tela).
    const resposta = await fetch(API_URL);

    // fetch() NÃO rejeita a Promise quando o servidor responde com erro
    // (404, 500...). Ele só falha se não conseguir se comunicar (rede/API
    // desligada). Por isso é preciso conferir "resposta.ok" (status 200-299)
    // ANTES de converter em JSON e lançar o erro manualmente.
    if (!resposta.ok) {
      throw new Error(`Falha na consulta: HTTP ${resposta.status}`);
    }

    // resposta.json() lê o corpo da resposta e o converte em objeto/array
    // JavaScript. Também devolve uma Promise, por isso precisa de "await".
    // Se o corpo não for um JSON válido, esta linha rejeita e cai no catch.
    pets.value = await resposta.json();
  } catch (e) {
    // Chegamos aqui se: a API estiver fora do ar, a resposta não for "ok" ou
    // o JSON for inválido. Guardamos uma mensagem amigável para a tela.
    console.error(e);
    erro.value =
      'Não foi possível carregar os pets. Verifique se a API está em execução e tente novamente.';
  } finally {
    // O "finally" executa SEMPRE: garante que a mensagem "Carregando..." saia.
    carregando.value = false;
  }
}

// Retorna o nome do tutor correspondente ao pet.
function nomeDOTutor(tutorId) {
  return (
    tutores.value.find((t) => String(t.id) === String(tutorId))?.nome ||
    'Tutor não encontrado'
  );
}

// onMounted: executa a função quando o componente é exibido na tela.
onMounted(async () => {
  try {
    await Promise.all([carregarTutores(), carregarPets()]);
  } catch (e) {
    console.error(e);
    erro.value = 'Não foi possível carregar os dados do sistema.';
  }
});
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">
        Listagem dos Pets cadastrados no sistema.
      </p>
    </header>

    <RouterLink
      class="btn btn-primary mb-4"
      :to="{ name: 'addPet' }"
    >
      Adicionar Pet
    </RouterLink>

    <!-- Estado 1: requisição em andamento -->
    <p
      v-if="carregando"
      class="text-body-secondary"
      role="status"
    >
      Carregando pets...
    </p>

    <!-- Estado 2: a consulta falhou -->
    <div
      v-else-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>

    <!-- Estado 3: sucesso, exibe a lista de pets -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Espécie</th>
          <th>Tutor</th>
        </tr>
      </thead>
      <tbody>
        <!-- v-for repete a linha para cada pet da lista -->
        <tr
          v-for="pet in pets"
          :key="pet.id"
        >
          <td>{{ pet.id }}</td>
          <td>{{ pet.nome }}</td>
          <td>{{ pet.especie }}</td>
          <td>{{ nomeDOTutor(pet.tutorId) }}</td>
          <td>
            <RouterLink to="pets/${pet.id}"> Editar </RouterLink>

            Excluir
          </td>
          <td>
            {{
              tutores.find((t) => t.id === pet.tutorId)?.nome ||
              'Tutor não encontrado'
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
