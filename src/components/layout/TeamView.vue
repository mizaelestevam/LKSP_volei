<script setup>
import { ref } from 'vue'

const membroSelecionado = ref(null)

const membros = [
  {
    nome: 'Kemilly',
    imagem: '/booksImgs/WhatsApp Image 2026-10-01 at 18.43.57.jpeg',
  },
  {
    nome: 'Sara',
    imagem: '/booksImgs/WhatsApp Image 2026-10-01 at 18.13.13.jpeg',
  },
  {
    nome: 'Lavinia',
    imagem: '/booksImgs/WhatsApp Image 2026-10-01 at 18.10.27.jpeg',
  },
]

function selecionarMembro(membro) {
  membroSelecionado.value = membro
}

function voltar() {
  membroSelecionado.value = null
}
</script>

<template>
  <section class="nossoEquipe">
    <div class="titulo">
      <h2>Sobre nós</h2>
    </div>

    <div class="equipe">
      <div class="lista" :class="{ ativo: membroSelecionado }">
        <ul>
          <li
            v-for="m in membros"
            :key="m.nome"
            @click="selecionarMembro(m)"
            :class="{ selecionado: membroSelecionado?.nome === m.nome }"
          >
            <span>{{ m.nome }}</span>
          </li>
        </ul>
      </div>

      <div v-if="membroSelecionado" class="detalhes">
        <div class="detalhe-card">
          <img :src="membroSelecionado.imagem" :alt="membroSelecionado.nome" class="detalhe-foto" />
          <div class="detalhe-info">
            <h3>{{ membroSelecionado.nome }}</h3>
            <button @click="voltar"><i class="mdi mdi-menu-left"></i> Voltar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nossoEquipe {
  width: 100%;
  min-height: 70vh;
  padding: 4rem 2rem 5rem;
  background:
    radial-gradient(circle at top left, rgba(255, 92, 205, 0.18), transparent 22%),
    radial-gradient(circle at bottom right, rgba(91, 160, 255, 0.14), transparent 18%),
    linear-gradient(180deg, #040d1d 0%, #040d1d 100%);
}

.titulo {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.titulo h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f5f7ff;
  text-shadow: 0 0 25px rgba(255, 116, 219, 0.3);
}

.equipe {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  gap: 2rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: rgba(10, 18, 31, 0.9);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.24);
}

.lista {
  flex: 0 0 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.02);
}

.lista ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  width: 100%;
}

.lista li {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  color: #edf4ff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.lista li:hover,
.lista li.selecionado {
  transform: translateX(3px);
  border-color: rgba(255, 111, 225, 0.9);
  box-shadow: 0 0 0 1px rgba(255, 111, 225, 0.3);
  background: rgba(255, 111, 225, 0.08);
}

.lista li span {
  font-size: 1rem;
  text-align: center;
  color: #edf4ff;
}

.detalhes {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.detalhe-card {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(15, 27, 44, 0.9), rgba(8, 16, 29, 0.9));
  color: #edf4ff;
}

.detalhe-foto {
  width: min(100%, 260px);
  aspect-ratio: 1 / 1.15;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.detalhe-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.detalhes h3 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.3rem, 2vw, 1.8rem);
  color: #f6f8ff;
}

.detalhes button {
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff74df, #8ea4ff);
  color: #0b1220;
  font-weight: 800;
  cursor: pointer;
}

@media (max-width: 780px) {
  .equipe {
    flex-direction: column;
  }

  .lista ul {
    grid-template-columns: 1fr;
  }
}
</style>
