// ── Navegação ativa ao rolar ──
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => observer.observe(s));

// ── Animação sequencial das letras nos títulos ──
const titles = document.querySelectorAll('header h1, .section-title');

titles.forEach((title) => {
  title.setAttribute('aria-label', title.textContent.trim());

  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim()) textNodes.push(node);
  }

  let letterIndex = 0;
  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();

    [...textNode.nodeValue].forEach((character) => {
      if (character === ' ') {
        fragment.append(document.createTextNode(character));
        return;
      }

      const letter = document.createElement('span');
      letter.className = 'title-letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.style.setProperty('--letter-delay', `${letterIndex * 32}ms`);
      letter.textContent = character;
      fragment.append(letter);
      letterIndex += 1;
    });

    textNode.replaceWith(fragment);
  });

  title.classList.add('title-animation-ready');
});

const titleObserver = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('title-animated');
      currentObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

titles.forEach((title) => titleObserver.observe(title));

// ── Scroll suave ──
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Animação de entrada nos cards ──
const cards = document.querySelectorAll('.card, .topic-card, .mensagem-box');

const fadeIn = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeIn.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach((card) => {
  card.classList.add('scroll-reveal');
  fadeIn.observe(card);
});

// ── Pesquisa que se transforma em reflexão ──
const searchScene = document.querySelector('.search-scene');
const searchText = searchScene?.querySelector('.search-query-text');

if (searchScene && searchText && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const question = searchText.textContent.trim();
  searchText.replaceChildren();
  searchText.setAttribute('aria-label', question);

  let letterIndex = 0;
  question.match(/\s+|[^\s]+/g).forEach((part) => {
    if (/^\s+$/.test(part)) {
      searchText.append(document.createTextNode(part));
      return;
    }

    const word = document.createElement('span');
    word.className = 'query-word';
    word.setAttribute('aria-hidden', 'true');

    [...part].forEach((character) => {
      const letter = document.createElement('span');
      letter.className = 'query-letter';
      letter.style.setProperty('--letter-index', letterIndex);
      letter.textContent = character;
      word.append(letter);
      letterIndex += 1;
    });

    searchText.append(word);
  });

  searchScene.style.setProperty('--query-length', question.length);
  searchScene.classList.add('search-animation-ready');

  const searchObserver = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        searchScene.classList.add('is-active');
        currentObserver.disconnect();
      }
    });
  }, { threshold: 0.45 });

  searchObserver.observe(searchScene);
}
