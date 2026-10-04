<script setup></script>

<template>
  <footer class="site-footer">
    <div class="footer-top">
      <div class="brand-block">
        <div class="brand">LKSP</div>
        <p>SPORTS TECH</p>
        <p>EVOLUÇÃO EM CADA PASSO.</p>
      </div>

      <div class="footer-links institutional-block">
        <h3>INSTITUCIONAL</h3>
        <div class="link-grid">
          <ul>
            <li><RouterLink to="/equipe">Sobre nós</RouterLink></li>
            <li><RouterLink to="/categoria/tecnologia">Tecnologia</RouterLink></li>
          </ul>
          <ul>
            <li>Sustentabilidade</li>
            <li>Carreiras</li>
          </ul>
        </div>
      </div>

      <div class="newsletter">
        <h3>RECEBA NOVIDADES</h3>
        <div class="newsletter-form">
          <input aria-label="E-mail" type="email" placeholder="Seu e-mail" />
          <button aria-label="Enviar">→</button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2024 LKSP Sporttech.</span>
      <span>Termos de uso</span>
      <span>Política de privacidade</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  overflow: hidden;
  background: rgba(3, 8, 15, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #edf5ff;
  padding: 2.5rem 2rem 1.5rem;
}

.footer-top {
  max-width: 1360px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.3fr 1.1fr 1.1fr 1.4fr;
  gap: 2rem;
  align-items: start;
}

.institutional-block {
  grid-column: 2 / span 2;
}

.brand {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  background: linear-gradient(90deg, #ff74df 0%, #d6b7ff 38%, #8ea4ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  user-select: none;
  text-shadow: 0 0 18px rgba(255, 116, 223, 0.26);
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    text-shadow 0.2s ease;
}

.brand:hover,
.brand:focus-visible {
  transform: translateY(-1px);
  filter: drop-shadow(0 0 12px rgba(255, 116, 223, 0.8));
  text-shadow:
    0 0 22px rgba(255, 116, 223, 0.8),
    0 0 30px rgba(142, 164, 255, 0.6);
  outline: none;
}

.brand-block p {
  margin: 0.55rem 0;
  color: rgba(226, 233, 255, 0.7);
  letter-spacing: 0.08em;
  font-size: 0.8rem;
}

.footer-links h3,
.newsletter h3 {
  margin: 0 0 1rem;
  color: #f0f5ff;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.footer-links ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.7rem;
  color: rgba(226, 233, 255, 0.72);
  font-size: 0.92rem;
}

.footer-links a {
  color: inherit;
  text-decoration: none;
}

.footer-links a:hover,
.footer-links a:focus-visible {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem 1.5rem;
}

.newsletter-form {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.newsletter-form input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  color: #edf5ff;
  padding: 0.9rem 1rem;
  outline: none;
}

.newsletter-form input::placeholder {
  color: rgba(226, 233, 255, 0.5);
}

.newsletter-form button {
  width: 52px;
  height: 52px;
  border: none;
  background: linear-gradient(90deg, #f870d8, #a97bff);
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
}

.footer-bottom {
  max-width: 1360px;
  margin: 2rem auto 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: rgba(226, 233, 255, 0.6);
  font-size: 0.8rem;
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .site-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .footer-top,
  .footer-bottom {
    grid-template-columns: 1fr;
    display: grid;
  }

  .footer-bottom {
    justify-content: flex-start;
  }
}
</style>
