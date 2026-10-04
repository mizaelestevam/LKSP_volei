<script setup>
import { ref } from 'vue'

const membroSelecionado = ref(null)

const membros = [
  {
    nome: 'Kemilly',
    imagem: '/booksImgs/WhatsApp Image 2026-10-01 at 18.43.57.jpeg',
    descricoes: [
      {
        titulo: 'L — Liberdade',
        texto: 'O poder de ir mais longe sem que nada o prenda a cada passo.',
      },
    ],
  },
  {
    nome: 'Sara',
    imagem: '/booksImgs/WhatsApp Image 2026-10-01 at 18.13.13.jpeg',
    descricoes: [
      {
        titulo: 'K — Energia Cinética',
        texto: 'Transforme todo impacto em impulso e movimento puro.',
      },
    ],
  },
  {
    nome: 'Lavinia',
    imagem: '/booksImgs/WhatsApp Image 2026-10-01 at 18.10.27.jpeg',
    descricoes: [
      {
        titulo: 'S — Tecnologia',
        texto:
          'Tecnologia aplicada ao esporte, com soluções que conectam desempenho, conforto e inovação.',
      },
      {
        titulo: 'P — Performance',
        texto: 'O máximo rendimento desenhado para alcançar o seu topo.',
      },
    ],
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

    <section class="corporate-intro" aria-labelledby="corporate-title">
      <h3 id="corporate-title">ESTRUTURA CORPORATIVA &amp; GOVERNANÇA</h3>

      <p class="corporate-copy">
        <strong>DNA e Propósito:</strong> A LKSP Sportstech é uma empresa focada em
        <span class="highlight-pink">alta performance</span> e
        <span class="highlight-blue">inovação biomecânica</span> voltada exclusivamente ao voleibol.
        O acrônimo da marca representa os quatro pilares operacionais fundamentais da corporação:
      </p>

      <div class="pillars" aria-label="Pilares da marca LKSP">
        <div class="pillar pillar-l">
          <strong>L</strong>
          <span>LIBERDADE</span>
        </div>
        <div class="pillar pillar-k">
          <strong>K</strong>
          <span>AÇÃO</span>
        </div>
        <div class="pillar pillar-s">
          <strong>S</strong>
          <span>SAÚDE</span>
        </div>
        <div class="pillar pillar-p">
          <strong>P</strong>
          <span>PERFORMANCE</span>
        </div>
      </div>

      <div class="corporate-statements">
        <p>
          <strong>Missão:</strong> Unir biometria avançada, inovação em engenharia de materiais e
          sustentabilidade para elevar o rendimento esportivo e garantir a longevidade da carreira
          dos atletas de voleibol.
        </p>
        <p>
          <strong>Visão:</strong> Consolidar-se como a principal referência nacional e internacional
          em tecnologia biomecânica para o voleibol até o ano de 2030.
        </p>
        <p>
          <strong>Valores:</strong> Inovação constante. Foco no Cliente (Customer Centric com escuta
          ativa), transparência operacional e responsabilidade socioambiental corporativa (ESG).
        </p>
      </div>
    </section>

    <h3 class="team-heading">COLABORADORAS</h3>

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
            <div class="member-descriptions">
              <div
                v-for="descricao in membroSelecionado.descricoes"
                :key="descricao.titulo"
                class="member-description"
              >
                <h4>{{ descricao.titulo }}</h4>
                <p>{{ descricao.texto }}</p>
              </div>
            </div>
            <button @click="voltar"><i class="mdi mdi-menu-left"></i> Voltar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nossoEquipe {
  position: relative;
  width: 100%;
  min-height: 70vh;
  padding: 4rem 2rem 5rem;
  background:
    radial-gradient(circle at top left, rgba(255, 92, 205, 0.18), transparent 22%),
    radial-gradient(circle at bottom right, rgba(91, 160, 255, 0.14), transparent 18%),
    linear-gradient(180deg, #040d1d 0%, #040d1d 100%);
  overflow: hidden;
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

.corporate-intro {
  max-width: 1200px;
  margin: 0 auto 2.5rem;
  color: #edf4ff;
}

.corporate-intro h3 {
  margin: 0 0 1rem;
  color: #f5f7ff;
  font-size: 1.15rem;
  font-weight: 800;
}

.corporate-copy,
.corporate-statements p {
  margin: 0;
  color: rgba(237, 244, 255, 0.82);
  font-size: 0.94rem;
  line-height: 1.65;
}

.corporate-copy strong {
  color: #f5f7ff;
}

.highlight-pink {
  color: #ff9be6;
}

.highlight-blue {
  color: #8ea4ff;
}

.pillars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 1.1rem 0 1.25rem;
}

.pillar {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 0.35rem;
  min-height: 76px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 3px solid var(--pillar-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
}

.pillar strong {
  color: var(--pillar-color);
  font-size: 1.25rem;
  line-height: 1;
}

.pillar span {
  color: #f5f7ff;
  font-size: 0.78rem;
  font-weight: 800;
}

.pillar-l {
  --pillar-color: #7ae5ff;
}

.pillar-k {
  --pillar-color: #ff74df;
}

.pillar-s {
  --pillar-color: #8ea4ff;
}

.pillar-p {
  --pillar-color: #ff9be6;
}

.corporate-statements {
  display: grid;
  gap: 0.65rem;
}

.corporate-statements strong {
  color: #f5f7ff;
  font-weight: 700;
}

.team-heading {
  max-width: 1200px;
  margin: 0 auto 1.25rem;
  color: #f5f7ff;
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-align: center;
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

.member-descriptions {
  display: grid;
  gap: 0.85rem;
  width: 100%;
  margin: 0.5rem 0 1rem;
  text-align: center;
}

.member-description h4 {
  margin: 0;
  color: #ff9be6;
  font-size: 0.95rem;
}

.member-description p {
  margin: 0.3rem 0 0;
  color: rgba(237, 244, 255, 0.78);
  font-size: 0.9rem;
  line-height: 1.55;
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
  .nossoEquipe {
    padding: 2.5rem 1rem 3rem;
  }

  .corporate-intro {
    margin-bottom: 2rem;
  }

  .pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .equipe {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .lista ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .lista {
    padding: 0;
  }

  .lista li {
    min-height: 44px;
    padding: 0.55rem 0.35rem;
  }

  .lista li span {
    font-size: 0.85rem;
  }

  .detalhes {
    padding: 0;
  }

  .detalhe-card {
    padding: 0.75rem;
  }
}

@media (max-width: 420px) {
  .nossoEquipe {
    padding-right: 0.8rem;
    padding-left: 0.8rem;
  }

  .pillars {
    gap: 0.5rem;
  }

  .pillar span {
    font-size: 0.68rem;
  }

  .equipe {
    padding: 0.75rem;
  }
}
</style>
