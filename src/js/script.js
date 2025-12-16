document.addEventListener("DOMContentLoaded", function () {
  // ------------------ MODAIS ------------------
  // ------------------ MODAL DESIGN ------------------
  const modal = document.getElementById("modal-projeto");
  const modalTitulo = document.getElementById("modal-projeto-titulo");
  const modalImg = document.getElementById("modal-projeto-img");
  const modalDescricao = document.getElementById("modal-projeto-descricao");
  const modalExtra = document.getElementById("modal-projeto-extra");
  const modalClose = document.querySelector(".modal-projeto-close");

  function abrirModalProjeto(e) {
    e.preventDefault();
    const el = e.currentTarget;

    modalTitulo.textContent = el.dataset.titulo || "";
    modalImg.src = el.dataset.img || "";
    modalImg.alt = el.dataset.titulo || "";
    modalDescricao.textContent = el.dataset.descricao || "";
    modalExtra.innerHTML = el.dataset.extra || "";

    modal.classList.add("active");
  }

  document
    .querySelectorAll(".abrir-modal-projeto")
    .forEach((el) => el.addEventListener("click", abrirModalProjeto));

  modalClose?.addEventListener("click", () => modal.classList.remove("active"));
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  // ------------------ MODAL SITE ------------------
  const modalSite = document.getElementById("modal-projeto-site");
  const modalTituloSite = document.getElementById("modal-projeto-titulo-site");
  const modalImgSite = document.getElementById("modal-projeto-img-site");
  const modalVideoSite = document.getElementById("modal-projeto-video-site");
  const modalDescricaoSite = document.getElementById(
    "modal-projeto-descricao-site"
  );
  const modalExtraSite = document.getElementById("modal-projeto-extra-site");
  const modalCloseSite = document.querySelector(".modal-projeto-close-site");

  function abrirModalProjetoSite(e) {
    e.preventDefault();

    const el = e.currentTarget;

    modalTituloSite.textContent = el.dataset.titulo || "";
    modalDescricaoSite.textContent = el.dataset.descricao || "";
    modalExtraSite.innerHTML = el.dataset.extra || "";

    const img = document.getElementById("modal-projeto-img-site");
    const video = document.getElementById("modal-projeto-video-site");

    const imgSrc = el.dataset.img;
    const videoSrc = el.dataset.video;

    // RESET
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.style.display = "none";

    img.style.display = "block";
    img.src = imgSrc || "";

    if (videoSrc) {
      video.src = videoSrc;
      video.preload = "auto";

      // quando o vídeo estiver pronto para tocar
      video.oncanplay = () => {
        video.style.display = "block";
        img.style.display = "none";
        video.play().catch(() => {});
      };
    }

    modalSite.classList.add("active");
  }

  document
    .querySelectorAll(".abrir-modal-projeto-site")
    .forEach((el) => el.addEventListener("click", abrirModalProjetoSite));

  modalCloseSite?.addEventListener("click", () => {
    modalVideoSite.pause();
    modalSite.classList.remove("active");
  });

  modalSite?.addEventListener("click", (e) => {
    if (e.target === modalSite) {
      modalVideoSite.pause();
      modalSite.classList.remove("active");
    }
  });

  function fecharModalSite() {
    const midiaContainer = document.getElementById("modal-midia-site");
    midiaContainer.innerHTML = ""; // remove vídeo da memória
    modalSite.classList.remove("active");
  }

  modalCloseSite && modalCloseSite.addEventListener("click", fecharModalSite);

  modalSite &&
    modalSite.addEventListener("click", (e) => {
      if (e.target === modalSite) fecharModalSite();
    });

  // ------------------ HELPERS ------------------
  function debounce(fn, wait = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }
  // ------------------ LAZY LOAD IMAGES ------------------
  function lazyLoadImages() {
    const imgs = document.querySelectorAll("img[data-src]");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;

            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            img.classList.add("loaded");

            obs.unobserve(img);
          }
        });
      },
      {
        rootMargin: "200px", // carrega um pouco antes de aparecer — mais suave
      }
    );

    imgs.forEach((img) => observer.observe(img));
  }

  lazyLoadImages();

  // ------------------ PROJETOS (design) - CASCATA (JS puro) ------------------
  (function projectsDesignCascade() {
    const items = Array.from(document.querySelectorAll(".projeto2-wrapper"));
    if (!items.length) return;

    const baseDelay = 0.06; // ajuste aqui se quiser mais/menos delay

    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition = "opacity .6s ease, transform .6s ease";
      item.dataset._cascadeIndex = items.indexOf(item);
    });

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.dataset._cascadeIndex) || 0;
          // aplica delay por index
          entry.target.style.transitionDelay = `${idx * baseDelay}s`;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          // ao animar, removemos do observer (once)
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    items.forEach((it) => io.observe(it));
    // guarda para possível limpeza (se quiser)
    window.__obs_projectsDesign = io;
  })();

  // ------------------ CURSOS & SKILLS - CASCATA + ONDA (JS puro) ------------------
  (function coursesAndSkillsWave() {
    const delayUnit = 0.2; // tempo base por "diagonal step"
    const gap = 20; // deve refletir gap do CSS, ajuste se necessário

    function applyWave(selector, containerSelector) {
      const items = Array.from(document.querySelectorAll(selector));
      const container = document.querySelector(containerSelector);
      if (!items.length || !container) return;

      // define estado inicial
      items.forEach((it) => {
        it.style.opacity = "0";
        it.style.transform = "translateY(20px)";
        it.style.transition =
          "opacity .75s cubic-bezier(.2,.9,.3,1), transform .75s cubic-bezier(.2,.9,.3,1)";
      });

      const computeAndSetDelays = () => {
        const containerWidth = container.clientWidth;
        const itemWidth = items[0] ? items[0].offsetWidth + gap : 200;
        const columns = Math.max(1, Math.floor(containerWidth / itemWidth));
        items.forEach((it, index) => {
          const colIndex = index % columns;
          const rowIndex = Math.floor(index / columns);
          const diagonalIndex = rowIndex + colIndex;
          it.dataset._diagDelay = (diagonalIndex * delayUnit).toFixed(3);
          // keep CSS transition-delay blank to be applied on reveal
          it.style.transitionDelay = "0s";
        });
      };

      computeAndSetDelays();
      // recompute on resize (debounced)
      window.addEventListener("resize", debounce(computeAndSetDelays, 100));

      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            // reveal all items, using dataset delay
            items.forEach((it) => {
              const d = Number(it.dataset._diagDelay) || 0;
              it.style.transitionDelay = `${d}s`;
              it.style.opacity = "1";
              it.style.transform = "translateY(0)";
            });
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.18 }
      );

      obs.observe(container);
      // export for cleanup/debug if needed
      (window.__obs_wave || (window.__obs_wave = [])).push(obs);
    }

    applyWave(".curso-card", ".cursos-grid");
    applyWave(".skill-card", ".skills");
  })();

  // ------------------ CONTATO  ------------------
  (function contactCardsFromRight() {
    const selector = ".contact";
    const cards = Array.from(document.querySelectorAll(selector));
    if (!cards.length) return;

    // define initial state
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateX(120px)";
      card.style.transition =
        "transform .9s cubic-bezier(.2,.9,.3,1), opacity .9s ease";
    });

    const baseStagger = 0.38;

    const container = document.querySelector(".contato") || document.body;
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * baseStagger}s`;
            card.style.opacity = "1";
            card.style.transform = "translateX(0)";
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );

    io.observe(container);
    window.__obs_contact = io;
  })();

  // ------------------ COMO TRABALHO  ------------------
  (function animateComoTrabalho() {
    const items = document.querySelectorAll(".como-trabalho-lista .item");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    items.forEach((item) => observer.observe(item));
  })();

  // ------------------ CAROUSEL TRACK PROJECTS (fake horizontal entrance) ------------------
  (function carouselTrackStagger() {
    const cards = Array.from(
      document.querySelectorAll(".carousel-track .projeto-wrapper")
    );
    if (!cards.length) return;

    // Pré-configuração sem causar reflow
    cards.forEach((card, i) => {
      const fromX = i % 2 === 0 ? -120 : 120;
      card.dataset._index = i;

      // define o estado inicial SEM animação
      card.style.opacity = "0";
      card.style.transform = `translateX(${fromX}px)`;
      card.style.willChange = "transform, opacity";
    });

    requestAnimationFrame(() => {
      // só aplica a transition após o browser fixar o layout
      cards.forEach((card) => {
        card.style.transition =
          "transform 1.05s cubic-bezier(.2,.9,.3,1), opacity .9s ease";
      });
    });

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.dataset._index) || 0;

          entry.target.style.transitionDelay = `${(idx % 4) * 0.075}s`;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((c) => io.observe(c));
  })();

  // ------------------ LIMPEZA ANTES DE SAIR (economia memória) ------------------
  window.addEventListener("beforeunload", () => {
    // disconnect observers if exist
    if (window.__obs_projectsDesign)
      try {
        window.__obs_projectsDesign.disconnect();
      } catch (e) {
        /*noop*/
      }
    if (window.__obs_contact)
      try {
        window.__obs_contact.disconnect();
      } catch (e) {
        /*noop*/
      }
    if (window.__obs_carousel)
      try {
        window.__obs_carousel.disconnect();
      } catch (e) {
        /*noop*/
      }
    if (window.__obs_wave && Array.isArray(window.__obs_wave)) {
      window.__obs_wave.forEach((o) => {
        try {
          o.disconnect();
        } catch (e) {}
      });
    }
  });

  // ------------------ SMOOTH SCROLL NO MENU LATERAL ------------------
  document.querySelectorAll(".menu-ul a").forEach((link) => {
    link.addEventListener("click", async (e) => {
      const destino = document.querySelector(link.getAttribute("href"));
      if (!destino) return;

      e.preventDefault();

      // 1) Força o ScrollTrigger a atualizar tudo antes do movimento
      try {
        ScrollTrigger.refresh();
      } catch (e) {}

      // 2) Aguarda 1 frame para garantir layout estável
      await new Promise((r) => requestAnimationFrame(r));

      // 3) Calcula posição real e absoluta da seção
      const destinoTop = destino.getBoundingClientRect().top + window.scrollY;

      // 4) Scroll suave com destino absoluto (não relativo)
      lenis.scrollTo(destinoTop, {
        offset: 0,
        duration: 1.25,
        immediate: false, // impede saltos bruscos
        easing: (x) => 1 - Math.pow(1 - x, 3),
      });
    });
  });

  // ------------------ LENIS & GSAP (mantidos apenas onde necessário) ------------------
  // Lenis (scroll suave) - mantive (é leve e já integrava ao seu ScrollTrigger)
  const lenis = new Lenis({ smoothWheel: true, smoothTouch: false });
  lenis.on("scroll", () => {
    try {
      ScrollTrigger.update();
    } catch (e) {
      /* if gsap/ScrollTrigger not present, ignore */
    }
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // === GSAP somente para "sobre" (typing + pin) e "como-ajudar" pin
  // Below try/catch to avoid crashes if GSAP missing in dev tests
  try {
    gsap.registerPlugin(ScrollTrigger);

    // SOBRE — typing effect (mantive seu comportamento)
    const p = document.querySelector(".sobre-mim p");
    if (p) {
      const originalHTML = p.innerHTML;
      p.innerHTML = "";
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = originalHTML;
      let letterSpans = [];

      function processNode(node, parent) {
        if (node.nodeType === Node.TEXT_NODE) {
          const chars = [...node.textContent];
          chars.forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.visibility = "hidden";
            letterSpans.push(span);
            parent.appendChild(span);
          });
        } else {
          const clone = node.cloneNode(false);
          parent.appendChild(clone);
          node.childNodes.forEach((child) => processNode(child, clone));
        }
      }
      tempDiv.childNodes.forEach((node) => processNode(node, p));

      ScrollTrigger.matchMedia({
        "(min-width: 768px)": function () {
          // DESKTOP — animação completa com pin
          gsap.to(letterSpans, {
            visibility: "visible",
            ease: "none",
            stagger: { each: 0.004 },
            scrollTrigger: {
              trigger: ".sobre-mim",
              start: "top top",
              end: "+=150%",
              scrub: 1.2,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
            },
          });
        },

        "(max-width: 767px)": function () {
          // deixa tudo invisível para iniciar a digitação
          gsap.set(letterSpans, { visibility: "hidden" });

          // função de digitar no mobile
          function typeWriterMobile() {
            let index = 0;
            const speed = 12; // ms por caractere (ajuste à vontade)

            function revealNext() {
              if (index < letterSpans.length) {
                letterSpans[index].style.visibility = "visible";
                index++;
                setTimeout(revealNext, speed);
              }
            }

            revealNext();
          }

          // Observer para detectar quando o usuário chegou na seção
          const observer = new IntersectionObserver(
            (entries, observerSelf) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  typeWriterMobile(); // inicia a digitação
                  observerSelf.disconnect(); // roda só uma vez
                }
              });
            },
            { threshold: 0.3 }
          ); // 30% da seção visível já inicia

          observer.observe(document.querySelector(".sobre-mim"));
        },
      });
    }
  } catch (err) {
    // se GSAP/ScrollTrigger não existirem (durante dev), não quebrar
    console.warn(
      "GSAP/ScrollTrigger não disponível — usando fallback JS para a maioria das animações.",
      err
    );
  }

  // ------------------ Mobile Navbar (mantive intacto) ------------------
  class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
      this.mobileMenu = document.querySelector(mobileMenu);
      this.navList = document.querySelector(navList);
      this.navLinks = document.querySelectorAll(navLinks);
      this.activeClass = "active";
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
      this.navList.classList.toggle(this.activeClass);
      this.mobileMenu.classList.toggle(this.activeClass);
      // animateLinks left as original (if you had implementation)
    }
    addClickEvent() {
      this.mobileMenu &&
        this.mobileMenu.addEventListener("click", this.handleClick);
    }
    init() {
      if (this.mobileMenu) this.addClickEvent();
      return this;
    }
  }
  const mobileNavbar = new MobileNavbar(
    ".ham-lines",
    ".menu-ul",
    ".menu-ul li"
  );
  mobileNavbar.init();
});

// ===== MENU ACTIVE com IntersectionObserver ESTÁVEL =====

(function () {
  const menuLinks = document.querySelectorAll(".menu-ul a[href^='#']");
  const sections = [];

  // Coletar seções reais que existam na página
  menuLinks.forEach((link) => {
    const id = link.hash.replace("#", "");
    const sec = document.getElementById(id);
    if (sec) sections.push(sec);
  });

  function activateLink(id) {
    menuLinks.forEach((link) => {
      const target = link.hash.replace("#", "");
      link.classList.toggle("active", target === id);
    });
  }

  // Observer mais tolerante (ativa quando 20% da seção aparece)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.2, // basta 20% da seção aparecer
      rootMargin: "0px 0px -10% 0px", // melhora ativação do HOME
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Ativar link inicial ao carregar
  window.addEventListener("load", () => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      activateLink(hash);
    } else {
      // ativa "home" se não houver hash
      activateLink(sections[0].id);
    }
  });

  // Ativar ao clicar em um link
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.hash.replace("#", "");
      activateLink(id);
    });
  });
})();
// DOMContentLoaded end

// FALLING LEAVES — realistic, continuous, spaced
(function initFallingLeaves() {
  const leafCount = 10;
  const minSpacing = 8;
  const sizeRange = [10, 20];
  const speedRange = [40, 90];
  const swayRange = [8, 35];
  const angularRange = [20, 90];
  const root = document.createElement("div");
  root.className = "leaf-layer";
  document.body.appendChild(root);

  const vw = () =>
    Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = () =>
    Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

  const rand = (a, b) => a + Math.random() * (b - a);

  const sampleX = (existing, attempts = 40) => {
    for (let i = 0; i < attempts; i++) {
      const x = Math.random() * 100;
      if (!existing.some((e) => Math.abs(e - x) < minSpacing)) return x;
    }
    return Math.random() * 100;
  };

  function makeLeaf(existingX) {
    const el = document.createElement("img");
    el.className = "falling-leaf";
    el.src = "src/img/icons/leaf.svg";
    el.alt = "";

    const size = rand(sizeRange[0], sizeRange[1]);
    const startXvw = sampleX(existingX);
    existingX.push(startXvw);

    const W = vw();
    const H = vh();

    const x = (startXvw / 100) * W;

    // AGORA: largura de spawn MUITO maior e aleatória
    const y = -rand(0, H * 1.2);

    const vy = rand(speedRange[0], speedRange[1]);
    const swayAmp = rand(swayRange[0], swayRange[1]);
    const swayFreq = rand(0.6, 1.6);
    const rotSpeed =
      rand(angularRange[0], angularRange[1]) * (Math.random() < 0.5 ? -1 : 1);
    const drift = rand(-12, 12);
    const lifeJitter = rand(0, 2);

    el.style.width = `${Math.round(size)}px`;
    el.style.opacity = `${rand(0.55, 0.9)}`;

    el._leaf = {
      x,
      y,
      vy,
      swayAmp,
      swayFreq,
      rot: rand(-45, 45),
      rotSpeed,
      drift,
      lifeJitter,
    };

    root.appendChild(el);
    return el;
  }

  const existingX = [];
  const leaves = [];
  for (let i = 0; i < leafCount; i++) {
    leaves.push(makeLeaf(existingX));
  }

  // ---------------- scroll-driven speed control ----------------
  let last = performance.now();
  let windPhase = Math.random() * 1000;

  // controle de scroll: detecta direção (+1 down, -1 up, 0 none) e quando ocorreu
  let lastScrollEventTime = 0;
  let scrollDir = 0; // +1 = pra baixo, -1 = pra cima

  // parâmetros ajustáveis:
  const SCROLL_ACTIVE_WINDOW = 80; // ms: por quanto tempo consideramos "ainda rolando"
  const SCROLL_DOWN_MULT = 1.4; // multiplicador enquanto rola pra baixo
  const SCROLL_UP_MULT = 0.6; // multiplicador enquanto rola pra cima
  const MIN_MULT = 0.3; // nunca deixe muito baixo (safety)

  // wheel (desktop): atualiza direção e timestamp
  window.addEventListener(
    "wheel",
    (e) => {
      scrollDir = Math.sign(e.deltaY) || 0;
      lastScrollEventTime = performance.now();
    },
    { passive: true }
  );

  // touch (mobile): detecta direção via touchmove (simples)
  let lastTouchY = null;
  window.addEventListener(
    "touchstart",
    (e) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      const y = e.touches[0]?.clientY ?? null;
      if (lastTouchY !== null && y !== null) {
        const dy = lastTouchY - y;
        scrollDir = Math.sign(dy) || 0;
        lastScrollEventTime = performance.now();
      }
      lastTouchY = y;
    },
    { passive: true }
  );

  // fallback: scroll event (useful para teclas/pageup/pagedown)
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const delta = window.scrollY - lastScrollY;
      if (Math.abs(delta) > 0) {
        scrollDir = Math.sign(delta);
        lastScrollEventTime = performance.now();
      }
      lastScrollY = window.scrollY;
    },
    { passive: true }
  );
  // ---------------------------------------------------------------

  let cursorX = null;
  let cursorY = null;

  // pega cursor na tela (desktop)
  window.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // mobile: o dedo também conta como cursor
  window.addEventListener(
    "touchmove",
    (e) => {
      cursorX = e.touches[0].clientX;
      cursorY = e.touches[0].clientY;
    },
    { passive: true }
  );

  function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.05); // segundos, clamp pra estabilidade
    last = now;

    // wind slowly changes
    windPhase += dt * 0.12;
    const globalWind = Math.sin(windPhase) * 20; // px/s wind variation

    const W = vw(),
      H = vh();

    // calcula multiplicador de velocidade por scroll (aplica só enquanto evento for recente)
    const msSinceScroll = performance.now() - lastScrollEventTime;
    let scrollMult = 1;
    if (msSinceScroll < SCROLL_ACTIVE_WINDOW) {
      // usuário está rolando agora
      if (scrollDir > 0) {
        scrollMult = SCROLL_DOWN_MULT;
      } else if (scrollDir < 0) {
        scrollMult = SCROLL_UP_MULT;
      }
      // segurança: nunca menor que MIN_MULT
      scrollMult = Math.max(MIN_MULT, scrollMult);
    } else {
      // nenhum scroll recente -> normal
      scrollMult = 1;
      scrollDir = 0; // reseta direção após window expirar
    }

    leaves.forEach((el, idx) => {
      const s = el._leaf;
      // vertical integration usa multiplicador de scroll
      s.y += s.vy * dt * scrollMult;

      // sway: sinusoidal side-to-side plus small per-leaf drift and global wind
      const sway =
        Math.sin((now / 1000) * s.swayFreq + idx + s.lifeJitter) * s.swayAmp;
      s.x += (s.drift + globalWind * 0.08) * dt;
      const tx = s.x + sway;
      const ty = s.y;

      // rotation
      s.rot += s.rotSpeed * dt;

      // ---------- REPULSÃO DO CURSOR ----------
      if (cursorX !== null && cursorY !== null) {
        const dx = tx - cursorX;
        const dy = ty - cursorY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const repelRadius = 140; // raio de repulsão
        const repelForce = 160; // força do empurrão

        if (dist < repelRadius) {
          // Intensidade diminui conforme afasta do cursor
          const strength = 1 - dist / repelRadius;

          // adiciona força oposta à direção do cursor → folha
          s.x += (dx / dist) * repelForce * strength * dt;
          s.y += (dy / dist) * repelForce * strength * dt * 0.6;

          // rotação extra ao ser empurrada
          s.rot += strength * 180 * dt;
        }
      }
      // ----------------------------------------

      // apply transform
      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${s.rot}deg)`;

      // opacidade: agora só reduz próximo ao final (já existente)
      const progress = s.y / (H * 1.8);
      const fade = Math.max(0.25, Math.min(1, 1 - progress));
      el.style.opacity = fade;

      // reset when below viewport or off to the sides
      if (s.y > H + 80 || s.x < -100 || s.x > W + 100) {
        // remove old xvw aproximado (se existir) - nota: existenteX armazena vw iniciais
        // aqui fazemos apenas re-seed simples mantendo espaçamento básico
        const newStartXvw = sampleX(existingX);
        existingX.push(newStartXvw);

        s.x = (newStartXvw / 100) * W;
        s.y = -rand(10, 200);
        s.vy = rand(speedRange[0], speedRange[1]);
        s.swayAmp = rand(swayRange[0], swayRange[1]);
        s.swayFreq = rand(0.6, 1.6);
        s.rot = rand(-40, 40);
        s.rotSpeed =
          rand(angularRange[0], angularRange[1]) *
          (Math.random() < 0.5 ? -1 : 1);
        s.drift = rand(-12, 12);
        s.lifeJitter = rand(0, 2);

        const newSize = rand(sizeRange[0], sizeRange[1]);
        el.style.width = `${Math.round(newSize)}px`;
        el.style.opacity = `${rand(0.5, 0.9)}`;
      }
    });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
// === TROCA AUTOMÁTICA ENTRE FOLHAS E ESTRELAS ===
function updateLeafIcons() {
  const isDark = document.body.classList.contains("dark-mode");
  const newSrc = isDark
    ? "src/img/icons/leaf-autumn.svg" // modo escuro
    : "src/img/icons/leaf.svg"; // modo claro

  document.querySelectorAll(".falling-leaf").forEach((el) => {
    el.src = newSrc;
  });
}

// Chama quando o site carrega
updateLeafIcons();

// Chama sempre que o tema for trocado
document.getElementById("theme-toggle").addEventListener("click", () => {
  // A troca do tema aconteceria aqui no seu código
  setTimeout(updateLeafIcons, 10); // pequeno delay para garantir
});

// TEMA ESCURO
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Troca o ícone conforme o tema
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fi-sc-moon");
    themeIcon.classList.add("fi-sr-sun");
  } else {
    themeIcon.classList.remove("fi-sr-sun");
    themeIcon.classList.add("fi-sc-moon");
  }

  function updateBackgroundLeaves() {
    const leaves = document.querySelectorAll(".bg-leaf");

    leaves.forEach((leaf) => {
      if (document.body.classList.contains("dark-mode")) {
        leaf.src = "src/img/icons/leaf-autumn.svg"; // imagem para o modo escuro
      } else {
        leaf.src = "src/img/icons/leaf.svg"; // imagem para o modo claro
      }
    });
  }
  updateBackgroundLeaves();

  // Animação suave do modo escuro
  document.documentElement.style.transition =
    "background-color .4s ease, color .4s ease";
  setTimeout(() => {
    document.documentElement.style.transition = "";
  }, 500);
});

// --- Cursor Glow ---
const glow = document.getElementById("cursorGlow");

document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});
