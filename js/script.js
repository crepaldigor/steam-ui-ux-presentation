/* Altere somente este objeto para personalizar os créditos. */
const CREDITOS = {
  integrantes: 'Maria Eduarda, Igor, Vinicius, Vitoria, Livia',
  curso: 'Frontend',
  disciplina: 'UI/UX',
  professor: 'Richard Cesar',
  instituicao: 'PROA'
};
const METRICAS = [["Usabilidade", 4, "Tarefas centrais são claras; fluxos avançados exigem adaptação."], ["Design visual", 4, "Identidade forte, mas áreas promocionais podem ficar densas."], ["Navegação", 4, "Seções principais claras; menus secundários extensos."], ["Acessibilidade", 0, "Não classificada: exige auditoria de contraste, teclado e tecnologias assistivas."], ["Engajamento", 5, "Variedade de mecanismos de descoberta e interação social."], ["Organização", 4, "Biblioteca bem estruturada; loja reúne muitos blocos."], ["Consistência", 3, "Padrões comuns, com variações entre áreas."], ["Experiência geral", 4, "Ecossistema funcional, com oportunidades de simplificação."]];

// Estado e navegação da apresentação, sem dependências externas.
const pages = [...document.querySelectorAll('.chapter-page')];
const chapters = [...document.querySelectorAll('.chapter')];
const sidebar = document.querySelector('#sidebar');
const toggle = document.querySelector('#menu-toggle');
const previous = document.querySelector('#prev');
const next = document.querySelector('#next');
const full = document.querySelector('#fullscreen');
const progress = document.querySelector('.progress');
const toast = document.querySelector('#toast');
let current = 0;
let toastTimer;
const mobile = window.matchMedia('(max-width: 900px)');

document.querySelectorAll('[data-field]').forEach(el => {
  el.textContent = CREDITOS[el.dataset.field] ?? '';
});
function setMenu(open, returnFocus = false) {
  sidebar.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu de capítulos' : 'Abrir menu de capítulos');
  if (open && mobile.matches) chapters[current].focus();
  if (!open && returnFocus) toggle.focus();
}
function navigate(index, focusHeading = true) {
  current = Math.min(pages.length - 1, Math.max(0, index));
  pages.forEach((page, i) => { page.hidden = i !== current; });
  chapters.forEach((chapter, i) => {
    if (i === current) chapter.setAttribute('aria-current', 'step');
    else chapter.removeAttribute('aria-current');
  });
  document.querySelectorAll('.topnav button').forEach(btn => {
    const n = Number(btn.dataset.go);
    btn.classList.toggle('active', n === 1 ? current === 1 : n === 2 ? current >= 2 && current <= 7 : current === 8);
  });
  const label = pages[current].getAttribute('aria-label');
  document.querySelector('#progress-text').textContent = `${String(current + 1).padStart(2, '0')} / ${pages.length} · ${label}`;
  document.querySelector('#progress-fill').style.width = `${(current + 1) / pages.length * 100}%`;
  progress.setAttribute('aria-valuenow', String(current + 1));
  previous.disabled = current === 0;
  next.disabled = current === pages.length - 1;
  setMenu(false);
  if (focusHeading) pages[current].querySelector('h1,h2').focus({preventScroll:true});
  window.scrollTo({top:0, behavior:'instant'});
}
document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => navigate(Number(btn.dataset.go))));
previous.addEventListener('click', () => navigate(current - 1));
next.addEventListener('click', () => navigate(current + 1));
toggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
mobile.addEventListener('change', () => setMenu(false));
function message(text) {
  clearTimeout(toastTimer); toast.textContent = text; toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else message('Tela cheia indisponível neste navegador. Tente o modo de tela cheia nativo.');
  } catch { message('O navegador não permitiu ativar a tela cheia. Tente o modo nativo.'); }
}
full.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  const active = Boolean(document.fullscreenElement);
  full.setAttribute('aria-label', active ? 'Sair da tela cheia' : 'Ativar tela cheia');
  full.querySelector('span').textContent = active ? 'Sair da tela cheia' : 'Tela cheia';
  full.title = active ? 'Sair da tela cheia (F)' : 'Tela cheia (F)';
});
// Evita sequestrar teclas de controles, campos, links e tecnologias assistivas.
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) return;
  const target = event.target;
  const interactive = target instanceof Element && target.closest('button, a, summary, input, select, textarea, [contenteditable], [role="button"]');
  if (event.key === 'Escape' && sidebar.classList.contains('open')) { setMenu(false, true); return; }
  if (interactive && [' ', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  const actions = {'ArrowRight': () => navigate(current + 1), 'ArrowLeft': () => navigate(current - 1), ' ': () => navigate(current + 1), Home: () => navigate(0), End: () => navigate(pages.length - 1), f: toggleFullscreen, F: toggleFullscreen};
  if (Object.hasOwn(actions, event.key)) { event.preventDefault(); actions[event.key](); }
});
// Heurísticas expansíveis e estado do controle global.
const expand = document.querySelector('#expand-heur');
const heuristics = [...document.querySelectorAll('.heur-grid details')];
function updateExpand() {
  const allOpen = heuristics.every(item => item.open);
  expand.textContent = allOpen ? 'Recolher todos' : 'Expandir todos';
  expand.setAttribute('aria-expanded', String(allOpen));
}
expand.addEventListener('click', () => {
  const open = !heuristics.every(item => item.open);
  heuristics.forEach(item => {item.open = open;}); updateExpand();
});
heuristics.forEach(item => item.addEventListener('toggle', updateExpand));
// Alternância entre protótipos (os elementos internos são ilustrações estáticas).
const before = document.querySelector('#before');
const after = document.querySelector('#after');
function selectPrototype(redesigned) {
  before.setAttribute('aria-pressed', String(!redesigned));
  after.setAttribute('aria-pressed', String(redesigned));
  document.querySelector('#prototype-before').hidden = redesigned;
  document.querySelector('#prototype-after').hidden = !redesigned;
  document.querySelector('#version-label').textContent = redesigned ? 'Redesign acadêmico · proposta não oficial' : 'Organização atual · representação';
}
before.addEventListener('click', () => selectPrototype(false));
after.addEventListener('click', () => selectPrototype(true));
// Gráfico qualitativo: cada barra abre a justificativa do critério.
const metricButtons = [...document.querySelectorAll('.metric')];
metricButtons.forEach((button, i) => button.addEventListener('click', () => {
  const [title, score, explanation] = METRICAS[i];
  metricButtons.forEach((btn, n) => btn.setAttribute('aria-pressed', String(n === i)));
  document.querySelector('#metric-name').textContent = title;
  document.querySelector('#metric-score').textContent = score ? `${score}/5` : 'N/A';
  document.querySelector('#metric-desc').textContent = explanation;
}));
navigate(0, false);
