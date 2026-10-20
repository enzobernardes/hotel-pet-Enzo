<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';
const route = useRoute();
const router = useRouter();

// ID do tutor presente na URL (/tutores/:id)
const tutorId = route.params.id;

const tutor = ref({});
const pets = ref([]);
const carregando = ref(false);
const erro = ref('');
const avisoRemocao = ref('');
const erroPet = ref('');
const salvandoPet = ref(false);

const novoPet = ref({
  nome: '',
  especie: '',
});

// GET /tutores/{id}
async function carregarTutor() {
  const resposta = await fetch(`${API_URL}/tutores/${tutorId}`);

  if (!resposta.ok) {
    throw new Error(`Falha na consulta do tutor: HTTP ${resposta.status}`);
  }

  tutor.value = await resposta.json();
}

// GET /pets?tutorId={id}  (traz somente os pets deste tutor)
async function buscarPetsDoTutor() {
  const resposta = await fetch(`${API_URL}/pets?tutorId=${tutorId}`);

  if (!resposta.ok) {
    throw new Error(`Falha na consulta dos pets: HTTP ${resposta.status}`);
  }

  return await resposta.json();
}

async function carregarPets() {
  pets.value = await buscarPetsDoTutor();
}

// POST /pets
async function cadastrarPet() {
  salvandoPet.value = true;
  erroPet.value = '';

  try {
    const resposta = await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: novoPet.value.nome.trim(),
        especie: novoPet.value.especie,
        tutorId: tutorId,
      }),
    });

    if (!resposta.ok) {
      throw new Error(`Falha ao cadastrar pet: HTTP ${resposta.status}`);
    }

    // Atualiza a lista para o novo pet aparecer na tela
    await carregarPets();
    avisoRemocao.value = '';
    novoPet.value = { nome: '', especie: '' };
  } catch (e) {
    console.error(e);
    erroPet.value = 'Não foi possível cadastrar o pet. Verifique a API.';
  } finally {
    salvandoPet.value = false;
  }
}

// DELETE /pets/{id}
async function removerPet(pet) {
  if (!window.confirm(`Deseja realmente remover o pet ${pet.nome}?`)) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/pets/${pet.id}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error(`Falha ao remover pet: HTTP ${resposta.status}`);
    }

    await carregarPets();
  } catch (e) {
    console.error(e);
    erroPet.value = 'Não foi possível remover o pet. Verifique a API.';
  }
}

// DELETE /tutores/{id}
async function removerTutor() {
  avisoRemocao.value = '';

  try {
    // Consulta de novo, para não depender de uma lista que pode estar velha
    const petsVinculados = await buscarPetsDoTutor();
    pets.value = petsVinculados;

    if (petsVinculados.length > 0) {
      avisoRemocao.value =
        'Este tutor possui pets vinculados. Remova os pets (ou transfira para outro tutor) antes de remover o tutor.';
      return;
    }

    if (!window.confirm('Deseja realmente remover este tutor?')) {
      return;
    }

    const resposta = await fetch(`${API_URL}/tutores/${tutorId}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error(`Falha ao remover tutor: HTTP ${resposta.status}`);
    }

    router.push({ name: 'tutores' });
  } catch (e) {
    console.error(e);
    avisoRemocao.value = 'Não foi possível remover o tutor. Verifique a API.';
  }
}

function voltar() {
  router.push({ name: 'tutores' });
}

onMounted(async () => {
  carregando.value = true;
  erro.value = '';

  try {
    await Promise.all([carregarTutor(), carregarPets()]);
  } catch (e) {
    console.error(e);
    erro.value =
      'Não foi possível carregar os dados do tutor. Verifique se ele existe e se a API está em execução.';
  } finally {
    carregando.value = false;
  }
});
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Detalhes do Tutor</h1>
      <p class="text-body-secondary mb-0">
        Dados do tutor e pets vinculados a ele.
      </p>
    </header>

    <p
      v-if="carregando"
      class="text-body-secondary"
      role="status"
    >
      Carregando tutor...
    </p>

    <div
      v-else-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
      <div class="mt-3">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="voltar"
        >
          Voltar
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Seção 1: dados do tutor -->
      <section class="card mb-4">
        <div class="card-body">
          <h2 class="h5 fw-semibold border-bottom pb-2 mb-3">
            Dados do Tutor
          </h2>

          <dl class="row mb-3">
            <dt class="col-sm-3">ID</dt>
            <dd class="col-sm-9">{{ tutor.id }}</dd>

            <dt class="col-sm-3">Nome completo</dt>
            <dd class="col-sm-9">{{ tutor.nome }}</dd>

            <dt class="col-sm-3">Telefone</dt>
            <dd class="col-sm-9 mb-0">{{ tutor.telefone }}</dd>
          </dl>

          <div
            v-if="avisoRemocao"
            class="alert alert-warning"
            role="alert"
          >
            {{ avisoRemocao }}
          </div>

          <div class="d-flex gap-2">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="voltar"
            >
              Voltar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="removerTutor"
            >
              Remover Tutor
            </button>
          </div>
        </div>
      </section>

      <!-- Seção 2: pets vinculados ao tutor -->
      <section class="card mb-4">
        <div class="card-body">
          <h2 class="h5 fw-semibold border-bottom pb-2 mb-3">
            Pets vinculados
          </h2>

          <p
            v-if="pets.length === 0"
            class="text-body-secondary mb-0"
          >
            Nenhum pet vinculado a este tutor.
          </p>

          <table
            v-else
            class="table table-striped table-hover mb-0"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <!-- v-for cria uma linha para cada pet encontrado -->
              <tr
                v-for="pet in pets"
                :key="pet.id"
              >
                <td>{{ pet.id }}</td>
                <td>{{ pet.nome }}</td>
                <td>{{ pet.especie }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="removerPet(pet)"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Seção 3: cadastrar pet para este tutor -->
      <section class="card mb-4">
        <div class="card-body">
          <h2 class="h5 fw-semibold border-bottom pb-2 mb-3">
            Cadastrar pet para este tutor
          </h2>

          <div
            v-if="erroPet"
            class="alert alert-danger"
            role="alert"
          >
            {{ erroPet }}
          </div>

          <form @submit.prevent="cadastrarPet">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label
                  for="nomePet"
                  class="form-label"
                >
                  Nome do pet:
                </label>
                <input
                  id="nomePet"
                  v-model="novoPet.nome"
                  type="text"
                  class="form-control"
                  placeholder="Ex.: Luna"
                  required
                />
              </div>

              <div class="col-md-6">
                <label
                  for="especiePet"
                  class="form-label"
                >
                  Espécie:
                </label>
                <select
                  id="especiePet"
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
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-success"
              :disabled="salvandoPet"
            >
              {{ salvandoPet ? 'Cadastrando...' : 'Cadastrar Pet' }}
            </button>
          </form>
        </div>
      </section>
    </template>
  </div>
</template>