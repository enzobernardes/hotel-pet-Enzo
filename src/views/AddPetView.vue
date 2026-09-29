<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// chamando a minha API para exibir os dados de tutor
const API_URL = 'http://localhost:3000';
const router = useRouter();

// chamando a minha API para exibir os dados de tutor
const tutores = ref([]);

async function carregarTutores() {
  const resposta = await fetch(`${API_URL}/tutores`);
  console.log('tutores', resposta);
  // transformando os valores da minha API para o fromato JSON
  tutores.value = await resposta.json();
}

// chamando a minha API para salvar os dados de pet
const novoPet = ref({
  nome: '',
  especie: '',
  tutorId: '',
});

async function salvarPet() {
  // fazendo a requisição para a API para o servidor
  await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(novoPet.value),
  });
  router.push({ name: 'pets' });

  // limpando os campos do formulário
  novoPet.value = {
    nome: '',
    especie: '',
    tutorId: '',
  };
}

onMounted(carregarTutores);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">Cadastro de Pets no sistema.</p>
    </header>

    <!--
<RouterLink
class="btn btn-primary"
:to="{ name: 'addPet' }"
>
Adicionar Pet
</RouterLink>
-->

    <form @submit.prevent="salvarPet">
      <div class="col-md-6 mb-3">
        <label
          for="nome"
          class="form-label"
          >Nome do pet:</label
        >
        <input
          type="text"
          id="nome"
          v-model="novoPet.nome"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-6">
        <label
          for="especie"
          class="form-label"
          >Espécie:</label
        >
        <select
          v-model="novoPet.especie"
          class="form-select"
          required
        >
          <option
            value=""
            disabled
          >
            Selecione a espécie
          </option>
          <option value="Cachorro">Cachorro</option>
        </select>
      </div>

      <div class="col-md-6">
        <label
          for="tutorId"
          class="form-label"
          >Tutor:</label
        >
        <select
          v-model="novoPet.tutorId"
          class="form-select"
          required
        >
          <option
            value=""
            disabled
          >
            Selecione o tutor
          </option>
          <option
            v-for="tutor in tutores"
            :key="tutor.id"
            :value="tutor.id"
          >
            {{ tutor.nome }}
          </option>
        </select>
      </div>
    </form>
  </div>
</template>
