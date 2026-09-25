<script setup>
import { onMounted, ref } from 'vue';

const API_URL = 'http://localhost:3000/pets';
const pets = ref([]);
const tutores = ref([]);
async function carregarDados() {
    const respostaPets = await fetch(`${API_URL}/Pets`);
    pets.value = await respostaPets.json();
}

onMounted(carregarDados);
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
      class="btn btn-primary"
      :to="{ name: 'addPet' }"
    >
      Adicionar Pet
    </RouterLink>
  </div>


  <table>
    <head>
        <th>ID</th>
        <th>Nome</th>
        <th>Espécie</th>
        <th>Idade</th>
        <th>Tutor</th>
    </head>
    <tbody>
      <tr v-for="pet in pets" :key="pet.id">
        <td>{{ pet.id }}</td>
        <td>{{ pet.nome }}</td>
        <td>{{ pet.especie }}</td>
        <td>{{ tutores.find(t => t.id === pet.tutorId)?.nome || 'Tutor não encontrado' }}</td>
      </tr>
    </tbody>
  </table>
</template>