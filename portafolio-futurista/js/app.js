/*
 * NEMPHISTO — PORTAFOLIO PERSONAL
 * JavaScript sin dependencias: navegación, temas, fondo animado y laboratorio numérico.
 * Puedes editar este archivo directamente en Visual Studio Code.
 */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // -------------------------------------------------------
  // 1. TEMA Y NAVEGACIÓN
  // -------------------------------------------------------
  const themeButton = $('#themeToggle');
  try {
    if (localStorage.getItem('nemphisto-theme') === 'light') {
      document.body.classList.add('theme-light');
    }
  } catch (_) { /* El sitio funciona aunque se bloquee el almacenamiento. */ }
  themeButton.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    try { localStorage.setItem('nemphisto-theme', isLight ? 'light' : 'dark'); } catch (_) {}
    drawChart();
  });

  const nav = $('#siteNav');
  const menuToggle = $('#menuToggle');
  function closeMenu() {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  }
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  let scrollQueued = false;
  function updateScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    $('#scrollProgress').style.width = `${Math.max(0, Math.min(100, (scrollY / maxScroll) * 100))}%`;
    $('#header').classList.toggle('scrolled', scrollY > 25);
    scrollQueued = false;
  }
  addEventListener('scroll', () => {
    if (!scrollQueued) { requestAnimationFrame(updateScroll); scrollQueued = true; }
  }, { passive: true });
  updateScroll();
  if ('IntersectionObserver' in window) {
    const sectionWatcher = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('.nav-link').forEach(link => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-27% 0px -60% 0px' });
    $$('#inicio,#sobre-mi,#proyectos,#laboratorio,#contacto').forEach(section => sectionWatcher.observe(section));

    const revealWatcher = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealWatcher.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach(el => revealWatcher.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
  }
  $('#currentYear').textContent = new Date().getFullYear();

  // -------------------------------------------------------
  // 2. TEXTO ANIMADO EN PORTADA
  // -------------------------------------------------------
  const typed = $('#typewriter');
  const phrases = ['métodos numéricos', 'programación', 'tecnología y redes', 'crear y aprender'];
  if (!reducedMotion.matches) {
    let phraseIndex = 0, letterIndex = phrases[0].length, deleting = true;
    const animateText = () => {
      const phrase = phrases[phraseIndex];
      if (deleting) letterIndex--;
      else letterIndex++;
      typed.textContent = phrase.slice(0, Math.max(0, letterIndex));
      if (deleting && letterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(animateText, 200);
      } else if (!deleting && letterIndex >= phrases[phraseIndex].length) {
        deleting = true;
        setTimeout(animateText, 2100);
      } else {
        setTimeout(animateText, deleting ? 45 : 87);
      }
    };
    setTimeout(animateText, 2500);
  }

  // -------------------------------------------------------
  // 3. FONDO DE ESTRELLAS DINÁMICO
  // -------------------------------------------------------
  const starsCanvas = $('#starfield');
  const starsCtx = starsCanvas.getContext('2d');
  let stars = [], starWidth = 0, starHeight = 0, starAnimationId = 0;
  function resizeStars() {
    if (!starsCtx) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    starWidth = innerWidth;
    starHeight = innerHeight;
    starsCanvas.width = Math.round(starWidth * dpr);
    starsCanvas.height = Math.round(starHeight * dpr);
    starsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(125, Math.max(38, Math.floor(starWidth * starHeight / 9800)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * starWidth,
      y: Math.random() * starHeight,
      radius: .35 + Math.random() * 1.2,
      alpha: .1 + Math.random() * .55,
      speed: .08 + Math.random() * .3,
      phase: Math.random() * Math.PI * 2,
    }));
    paintStars(0);
  }
  function paintStars(timestamp) {
    if (!starsCtx) return;
    starsCtx.clearRect(0, 0, starWidth, starHeight);
    stars.forEach(star => {
      const light = star.alpha * (.77 + .23 * Math.sin(timestamp * .001 * star.speed + star.phase));
      starsCtx.beginPath();
      starsCtx.fillStyle = `rgba(137,214,252,${Math.max(.03, light)})`;
      starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starsCtx.fill();
      if (!reducedMotion.matches) {
        star.y -= star.speed * .18;
        if (star.y < 0) star.y = starHeight;
      }
    });
  }
  function animateStars(timestamp) {
    if (!document.hidden) paintStars(timestamp);
    starAnimationId = requestAnimationFrame(animateStars);
  }
  resizeStars();
  if (!reducedMotion.matches && starsCtx) starAnimationId = requestAnimationFrame(animateStars);

  // -------------------------------------------------------
  // 4. FILTROS DE PROYECTOS
  // -------------------------------------------------------
  const projectCards = $$('.project-card');
  $$('.filter-chip').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      $$('.filter-chip').forEach(chip => {
        const selected = chip === button;
        chip.classList.toggle('selected', selected);
        chip.setAttribute('aria-pressed', String(selected));
      });
      let visible = 0;
      projectCards.forEach(card => {
        const show = filter === 'todos' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visible++;
      });
      $('#projectEmpty').hidden = visible > 0;
    });
  });

  // -------------------------------------------------------
  // 5. LABORATORIO DE BISECCIÓN: f(x) = x³ - x - 2
  // -------------------------------------------------------
  const f = (x) => x * x * x - x - 2;
  const tolerance = 1e-6;
  const maximumIterations = 100;
  const inputA = $('#minInterval');
  const inputB = $('#maxInterval');
  const message = $('#validationMessage');
  const chartCanvas = $('#functionChart');
  const chartCtx = chartCanvas.getContext('2d');
  const tableBody = $('#iterationTable');
  const formatValue = (value, digits = 6) => Number.isFinite(value) ? value.toFixed(digits) : '—';
  let state = { a: 1, b: 2, rows: [], current: null, finished: false };

  function readInterval() {
    const a = Number(inputA.value), b = Number(inputB.value);
    if (!inputA.value.trim() || !inputB.value.trim() || !Number.isFinite(a) || !Number.isFinite(b)) {
      return { error: 'Escribe dos números válidos.' };
    }
    if (a >= b) return { error: 'El valor de a debe ser menor que b.' };
    if (Math.abs(a) > 1000 || Math.abs(b) > 1000) return { error: 'Utiliza límites entre −1000 y 1000.' };
    if (f(a) * f(b) >= 0) return { error: 'No hay cambio de signo: f(a) · f(b) debe ser menor que 0.' };
    return { a, b };
  }

  function resetLab(showValidation = true) {
    const interval = readInterval();
    state = { a: interval.a ?? Number(inputA.value), b: interval.b ?? Number(inputB.value), rows: [], current: null, finished: false };
    message.classList.remove('success');
    message.textContent = showValidation ? (interval.error || '') : '';
    $('#iterationValue').textContent = '00';
    $('#rootValue').textContent = '—';
    $('#errorValue').textContent = '—';
    $('#iterationCount').textContent = '0 registros';
    tableBody.innerHTML = '<tr class="table-placeholder"><td colspan="6">Presiona «Siguiente iteración» para comenzar.</td></tr>';
    $('#nextStep').disabled = false;
    $('#solveAll').disabled = false;
    drawChart();
  }

  function stepBisection() {
    if (state.finished) return false;
    if (state.rows.length === 0) {
      const initial = readInterval();
      if (initial.error) { message.textContent = initial.error; return false; }
      state.a = initial.a; state.b = initial.b;
    }
    message.textContent = '';
    message.classList.remove('success');
    const { a, b } = state;
    const c = (a + b) / 2;
    const fc = f(c);
    const error = (b - a) / 2;
    if (!Number.isFinite(c) || !Number.isFinite(fc)) {
      message.textContent = 'No se pudo evaluar la función con esos límites.';
      return false;
    }
    const row = { iteration: state.rows.length + 1, a, b, c, fc, error };
    state.rows.push(row);
    state.current = c;
    if (Math.abs(fc) < tolerance || error < tolerance || state.rows.length >= maximumIterations) {
      state.finished = true;
      $('#nextStep').disabled = true;
      $('#solveAll').disabled = true;
    } else if (f(a) * fc < 0) {
      state.b = c;
    } else {
      state.a = c;
    }
    return true;
  }

  function updateLabUi() {
    const latest = state.rows.at(-1);
    if (!latest) return;
    $('#iterationValue').textContent = String(latest.iteration).padStart(2, '0');
    $('#rootValue').textContent = formatValue(latest.c);
    $('#errorValue').textContent = formatValue(latest.error);
    $('#iterationCount').textContent = `${state.rows.length} ${state.rows.length === 1 ? 'registro' : 'registros'}`;
    tableBody.replaceChildren();
    state.rows.forEach(record => {
      const tr = document.createElement('tr');
      const values = [String(record.iteration), formatValue(record.a), formatValue(record.b), formatValue(record.c), formatValue(record.fc), formatValue(record.error)];
      values.forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
    if (state.finished) {
      message.classList.add('success');
      message.textContent = `Resultado: x ≈ ${formatValue(latest.c, 8)}. Criterio de parada alcanzado.`;
    }
    drawChart();
  }
  $('#nextStep').addEventListener('click', () => {
    if (stepBisection()) updateLabUi();
  });
  $('#solveAll').addEventListener('click', () => {
    let changed = false;
    while (!state.finished && state.rows.length < maximumIterations) {
      if (!stepBisection()) break;
      changed = true;
    }
    if (changed) updateLabUi();
  });
  $('#resetLab').addEventListener('click', () => resetLab());
  [inputA, inputB].forEach(input => input.addEventListener('input', () => resetLab()));

  function drawChart() {
    if (!chartCtx) return;
    const rect = chartCanvas.getBoundingClientRect();
    const width = rect.width, height = rect.height;
    if (width <= 1 || height <= 1) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    chartCanvas.width = Math.round(width * dpr);
    chartCanvas.height = Math.round(height * dpr);
    chartCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    chartCtx.clearRect(0, 0, width, height);

    const margins = { left: 44, right: 22, top: 23, bottom: 33 };
    const plotWidth = width - margins.left - margins.right;
    const plotHeight = height - margins.top - margins.bottom;
    if (plotWidth <= 0 || plotHeight <= 0) return;
    const interval = readInterval();
    let a = interval.error ? 1 : interval.a;
    let b = interval.error ? 2 : interval.b;
    if (state.rows.length > 0) { a = state.rows[0].a; b = state.rows[0].b; }
    const span = Math.max(2.2, (b - a) * 1.75);
    const center = (a + b) / 2;
    const xMin = center - span / 2;
    const xMax = center + span / 2;
    const samples = Array.from({length:180}, (_,i) => f(xMin + (xMax - xMin) * i / 179));
    const maxAbsoluteY = Math.max(1, ...samples.map(y => Math.abs(y))) * 1.15;
    const yMin = -maxAbsoluteY, yMax = maxAbsoluteY;
    const px = x => margins.left + (x - xMin) / (xMax - xMin) * plotWidth;
    const py = y => margins.top + (yMax - y) / (yMax - yMin) * plotHeight;
    const light = document.body.classList.contains('theme-light');
    const lineColor = light ? 'rgba(183,204,238,.23)' : 'rgba(161,180,225,.2)';
    const axisColor = light ? '#a3a9c2' : '#8496b7';
    chartCtx.font = '10px monospace';
    chartCtx.textAlign = 'center';

    // Cuadrícula y marcadores
    for (let tick = 0; tick <= 4; tick++) {
      const x = margins.left + plotWidth * tick / 4;
      const y = margins.top + plotHeight * tick / 4;
      chartCtx.strokeStyle = lineColor;
      chartCtx.lineWidth = 1;
      chartCtx.beginPath(); chartCtx.moveTo(x, margins.top); chartCtx.lineTo(x, margins.top + plotHeight); chartCtx.stroke();
      chartCtx.beginPath(); chartCtx.moveTo(margins.left, y); chartCtx.lineTo(margins.left + plotWidth, y); chartCtx.stroke();
      chartCtx.fillStyle = axisColor;
      chartCtx.fillText((xMin + (xMax - xMin) * tick / 4).toFixed(1), x, height - 11);
      chartCtx.textAlign = 'right';
      chartCtx.fillText((yMax - (yMax - yMin) * tick / 4).toFixed(1), margins.left - 10, y + 4);
      chartCtx.textAlign = 'center';
    }
    chartCtx.strokeStyle = 'rgba(131,164,219,.55)';
    chartCtx.lineWidth = 1;
    if (xMin <= 0 && xMax >= 0) {
      chartCtx.beginPath(); chartCtx.moveTo(px(0), margins.top); chartCtx.lineTo(px(0), height - margins.bottom); chartCtx.stroke();
    }
    chartCtx.beginPath(); chartCtx.moveTo(margins.left, py(0)); chartCtx.lineTo(width - margins.right, py(0)); chartCtx.stroke();

    // Intervalo vigente resaltado
    const currentA = state.rows.length ? state.a : a;
    const currentB = state.rows.length ? state.b : b;
    chartCtx.fillStyle = 'rgba(92,234,223,.06)';
    chartCtx.fillRect(px(currentA), margins.top, Math.max(1, px(currentB) - px(currentA)), plotHeight);
    [currentA, currentB].forEach((value, idx) => {
      chartCtx.setLineDash([5, 5]);
      chartCtx.strokeStyle = idx ? 'rgba(165,139,255,.48)' : 'rgba(80,230,220,.48)';
      chartCtx.beginPath(); chartCtx.moveTo(px(value), margins.top); chartCtx.lineTo(px(value), height - margins.bottom); chartCtx.stroke();
    });
    chartCtx.setLineDash([]);

    // Curva original f(x)
    chartCtx.beginPath();
    for (let i = 0; i <= 220; i++) {
      const x = xMin + (xMax - xMin) * i / 220;
      if (i === 0) chartCtx.moveTo(px(x), py(f(x)));
      else chartCtx.lineTo(px(x), py(f(x)));
    }
    chartCtx.strokeStyle = '#5ceadf';
    chartCtx.lineWidth = 2.7;
    chartCtx.shadowColor = 'rgba(90,242,228,.55)';
    chartCtx.shadowBlur = 13;
    chartCtx.stroke();
    chartCtx.shadowBlur = 0;

    if (state.current !== null) {
      chartCtx.strokeStyle = 'rgba(193,166,255,.85)';
      chartCtx.setLineDash([4, 4]);
      chartCtx.beginPath(); chartCtx.moveTo(px(state.current), margins.top); chartCtx.lineTo(px(state.current), height - margins.bottom); chartCtx.stroke();
      chartCtx.setLineDash([]);
      chartCtx.beginPath(); chartCtx.arc(px(state.current), py(f(state.current)), 5, 0, Math.PI * 2);
      chartCtx.fillStyle = '#c3a2ff'; chartCtx.fill();
      chartCtx.lineWidth = 3; chartCtx.strokeStyle = '#10182a'; chartCtx.stroke();
    }
  }

  let resizeTimeout = null;
  addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => { resizeStars(); drawChart(); }, 140);
  }, { passive: true });
  resetLab(false);

  // -------------------------------------------------------
  // 6. COPIAR USUARIO DE GITHUB
  // -------------------------------------------------------
  let toastTimer;
  function showToast(text) {
    const toast = $('#toast');
    toast.textContent = text;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2700);
  }
  $('#copyGithub').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('Nemphisto');
      $('#copyFeedback').textContent = 'Usuario copiado: Nemphisto';
      showToast('✓ Usuario de GitHub copiado');
    } catch (_) {
      $('#copyFeedback').textContent = 'Mi usuario de GitHub es: Nemphisto';
      showToast('Usuario: Nemphisto');
    }
  });
})();
