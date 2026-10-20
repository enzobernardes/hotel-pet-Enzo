<script setup>
import { onMounted, ref } from 'vue';

const API_URL = 'http://localhost:3000';
const tutores = ref([]);
const carregando = ref(false);
const erro = ref('');

async function carregarTutores() {
  carregando.value = true;
  erro.value = '';

  try {
    const resposta = await fetch(`${API_URL}/tutores`);

    if (!resposta.ok) {
      throw new Error(`Falha na consulta de tutores: HTTP ${resposta.status}`);
    }

    tutores.value = await resposta.json();
  } catch (e) {
    console.error(e);
    erro.value = 'Não foi possível carregar os tutores. Verifique a API.';
  } finally {
    carregando.value = false;
  }
}

onMounted(carregarTutores);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Tutores</h1>
      <p class="text-body-secondary mb-0">
        Listagem dos tutores cadastrados no sistema.
      </p>
    </header>

    <RouterLink
      class="btn btn-primary mb-4"
      :to="{ name: 'addTutor' }"
    >
      Adicionar Tutor
    </RouterLink>

    <p
      v-if="carregando"
      class="text-body-secondary"
      role="status"
    >
      Carregando tutores...
    </p>

    <div
      v-else-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>

    <table
      v-else
      class="table table-striped table-hover"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tutor in tutores"
          :key="tutor.id"
        >
          <td>{{ tutor.id }}</td>
          <td>{{ tutor.nome }}</td>
          <td>{{ tutor.telefone }}</td>
          <td>
            <RouterLink
              class="btn btn-sm btn-outline-primary"
              :to="{ name: 'tutorDetails', params: { id: tutor.id } }"
            >
              Ver detalhes
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
