<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';
const router = useRouter();

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

function formularioVazio() {
  return {
    nome: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    dataNascimento: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  };
}

const novoTutor = ref(formularioVazio());
const enviando = ref(false);
const erro = ref('');

function apenasDigitos(valor) {
  return valor.replace(/\D/g, '');
}

async function salvarTutor() {
  enviando.value = true;
  erro.value = '';

  const t = novoTutor.value;

  try {
    // O id não é enviado: o json-server gera automaticamente
    const resposta = await fetch(`${API_URL}/tutores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: t.nome.trim(),
        telefone: apenasDigitos(t.telefone),
        cpfCnpj: apenasDigitos(t.cpfCnpj),
        email: t.email.trim(),
        dataNascimento: t.dataNascimento,
        endereco: {
          rua: t.rua.trim(),
          numero: t.numero.trim(),
          bairro: t.bairro.trim(),
          cidade: t.cidade.trim(),
          estado: t.estado,
          cep: apenasDigitos(t.cep),
        },
      }),
    });

    if (!resposta.ok) {
      throw new Error(`Falha ao cadastrar tutor: HTTP ${resposta.status}`);
    }

    // Só redireciona depois que o cadastro deu certo
    router.push({ name: 'tutores' });
  } catch (e) {
    console.error(e);
    erro.value = 'Não foi possível cadastrar o tutor. Verifique a API.';
  } finally {
    enviando.value = false;
  }
}

function cancelar() {
  router.push({ name: 'tutores' });
}
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="fw-bold mb-1">Cadastrar Tutor</h1>
      <p class="text-body-secondary mb-0">
        Preencha os dados para cadastrar um novo tutor.
      </p>
    </header>

    <div
      v-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>

    <form
      class="px-lg-3"
      @submit.prevent="salvarTutor"
    >
      <h2 class="h5 fw-semibold border-bottom pb-2 mb-3">Dados do Tutor</h2>

      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <label
            for="id"
            class="form-label fw-semibold small"
          >
            ID
          </label>
          <input
            id="id"
            type="text"
            class="form-control"
            placeholder="Gerado automaticamente"
            disabled
          />
        </div>

        <div class="col-md-8">
          <label
            for="nome"
            class="form-label fw-semibold small"
          >
            Nome Completo
          </label>
          <input
            id="nome"
            v-model="novoTutor.nome"
            type="text"
            class="form-control"
            placeholder="Digite o nome completo"
            required
          />
        </div>

        <div class="col-md-6">
          <label
            for="cpfCnpj"
            class="form-label fw-semibold small"
          >
            CPF / CNPJ
          </label>
          <input
            id="cpfCnpj"
            v-model="novoTutor.cpfCnpj"
            type="text"
            class="form-control"
            placeholder="Digite o CPF ou CNPJ"
          />
        </div>

        <div class="col-md-6">
          <label
            for="telefone"
            class="form-label fw-semibold small"
          >
            Telefone / Celular / WhatsApp
          </label>
          <input
            id="telefone"
            v-model="novoTutor.telefone"
            type="tel"
            class="form-control"
            placeholder="(00) 00000-0000"
            required
          />
        </div>

        <div class="col-md-6">
          <label
            for="email"
            class="form-label fw-semibold small"
          >
            E-mail
          </label>
          <input
            id="email"
            v-model="novoTutor.email"
            type="email"
            class="form-control"
            placeholder="nome@example.com"
          />
        </div>

        <div class="col-md-6">
          <label
            for="dataNascimento"
            class="form-label fw-semibold small"
          >
            Data de Nascimento
          </label>
          <input
            id="dataNascimento"
            v-model="novoTutor.dataNascimento"
            type="date"
            class="form-control"
          />
        </div>
      </div>

      <h2 class="h5 fw-semibold border-bottom pb-2 mb-3">Endereço</h2>

      <div class="row g-3 mb-4">
        <div class="col-md-8">
          <label
            for="rua"
            class="form-label fw-semibold small"
          >
            Rua
          </label>
          <input
            id="rua"
            v-model="novoTutor.rua"
            type="text"
            class="form-control"
            placeholder="Digite o nome da rua"
          />
        </div>

        <div class="col-md-4">
          <label
            for="numero"
            class="form-label fw-semibold small"
          >
            Número
          </label>
          <input
            id="numero"
            v-model="novoTutor.numero"
            type="text"
            class="form-control"
            placeholder="Número"
          />
        </div>

        <div class="col-md-6">
          <label
            for="bairro"
            class="form-label fw-semibold small"
          >
            Bairro
          </label>
          <input
            id="bairro"
            v-model="novoTutor.bairro"
            type="text"
            class="form-control"
            placeholder="Digite o bairro"
          />
        </div>

        <div class="col-md-6">
          <label
            for="cidade"
            class="form-label fw-semibold small"
          >
            Cidade
          </label>
          <input
            id="cidade"
            v-model="novoTutor.cidade"
            type="text"
            class="form-control"
            placeholder="Digite a cidade"
          />
        </div>

        <div class="col-md-6">
          <label
            for="estado"
            class="form-label fw-semibold small"
          >
            Estado
          </label>
          <select
            id="estado"
            v-model="novoTutor.estado"
            class="form-select"
          >
            <option value="">Selecione</option>
            <option
              v-for="uf in ESTADOS"
              :key="uf"
              :value="uf"
            >
              {{ uf }}
            </option>
          </select>
        </div>

        <div class="col-md-6">
          <label
            for="cep"
            class="form-label fw-semibold small"
          >
            CEP
          </label>
          <input
            id="cep"
            v-model="novoTutor.cep"
            type="text"
            class="form-control"
            placeholder="00000-000"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="enviando"
          @click="cancelar"
        >
          Cancelar
        </button>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="enviando"
        >
          {{ enviando ? 'Cadastrando...' : 'Cadastrar Tutor' }}
        </button>
      </div>
    </form>
  </div>
</template>