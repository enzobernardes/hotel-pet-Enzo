<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const API_URL = 'http://localhost:3000';
const route = useRoute();
const pet = ref({});
const tutor = ref({});

function nomeDOTutor() {
  return tutor.value?.nome || 'Tutor não encontrado';
}

//função para carregar os dados do pet e do tutor
async function carregarPet() {
  try {
    const respostaPet = await fetch(`${API_URL}/pets/${route.params.id}`);

    if (!respostaPet.ok) {
      console.log('Opeees, Pet não encontrado!');
      return;
    }

    pet.value = await respostaPet.json();

    const respostaTutor = await fetch(
      `${API_URL}/tutores/${pet.value.tutorId}`,
    );
    tutor.value = respostaTutor.ok
      ? await respostaTutor.json()
      : { nome: 'Tutor não encontrado' };
  } catch (erro) {
    console.error('Erro ao carregar os dados do pet:', erro);
  }
}

onMounted(carregarPet);
</script>

<template>
  <h1>Nome: {{ pet.nome }}</h1>
  <p>Espécie: {{ pet.especie }}</p>
  <p>Tutor: {{ nomeDOTutor() }}</p>
</template>
