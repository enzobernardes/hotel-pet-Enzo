<script setup>
const props = defineProps({
  pet: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['confirmar', 'cancelar']);
</script>

<template>
  <div class="card border-danger mt-4">
    <div class="card-body">
      <h5 class="card-title text-danger">Deletar Pet</h5>
      <p class="card-text mb-3">
        Tem certeza que deseja deletar o pet
        <strong>{{ props.pet?.nome || 'selecionado' }}</strong>?
      </p>

      <div class="d-flex gap-2">
        <button class="btn btn-danger" @click="emit('confirmar')">
          Confirmar
        </button>
        <button class="btn btn-outline-secondary" @click="emit('cancelar')">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
