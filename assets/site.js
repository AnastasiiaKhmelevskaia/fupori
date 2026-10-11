// Fupori home page: the companion playground, the mood picker and scroll reveals.
// Everything here is optional. Without it the page shows Mochi the Shiba Inu.
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Rise in when scrolled to.
  const revealed = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    revealed.forEach((element) => observer.observe(element));
  } else {
    revealed.forEach((element) => element.classList.add('is-in'));
  }

  const stageArt = $('#stage-art');
  if (!stageArt) return;

  // The app changes a companion's form at level 3 and at level 7.
  const levelOfForm = { 1: 1, 2: 3, 3: 7 };
  const checksPerForm = 3;
  const state = { kind: 'shibaInu', name: 'Mochi', form: 1, checks: 0, mood: 'Happy' };
  let timer;

  const art = (pose) => `assets/companions/${state.kind}${pose}.svg`;
  const escapeHTML = (text) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const named = (text) => text.replaceAll('{name}', escapeHTML(state.name));

  const plate = $('#stage-plate');
  const progress = $('#stage-progress');
  const status = $('#stage-status');
  const again = $('#stage-again');
  const checks = $$('.check');
  const moodArt = $('#mood-art');
  const moodNote = $('#mood-note');

  const moodNotes = {
    Happy: 'Care is on track. {name} is happy to see you.',
    Worried: 'Care is slipping. {name} is starting to worry.',
    Sad: 'A habit was missed, and {name} noticed.',
    Packed: '{name} packed a bag. Keep completing your habit or you risk losing them.',
  };

  const pop = (element) => {
    if (reduceMotion) return;
    element.classList.remove('is-pop');
    void element.offsetWidth;
    element.classList.add('is-pop');
  };

  let statusTemplate = '{name} is cheering you on. Check in three times.';
  const say = (html = statusTemplate) => { statusTemplate = html; status.innerHTML = named(html); };

  const renderNames = () => {
    $$('[data-name]').forEach((node) => { node.textContent = state.name; });
    say();
    renderMood();
  };

  const renderMood = () => {
    moodArt.src = art(`Level2${state.mood}`);
    moodArt.alt = `${state.name} looking ${state.mood === 'Packed' ? 'ready to leave' : state.mood.toLowerCase()}`;
    moodNote.innerHTML = named(moodNotes[state.mood]);
  };

  const renderArt = () => {
    stageArt.src = art(`Level${state.form}Happy`);
    stageArt.alt = `${state.name} the companion`;
    $$('[data-art]').forEach((image) => { image.src = art(image.dataset.art); });
    renderMood();
  };

  const renderProgress = () => {
    $('#stage-level').textContent = levelOfForm[state.form];
    $('#stage-next').textContent = state.form === 3 ? 'Max level' : `Next form at level ${levelOfForm[state.form + 1]}`;
    $('.fp-progress__fill', progress).style.width = `${state.form === 3 ? 100 : (state.checks / checksPerForm) * 100}%`;
    progress.setAttribute('aria-valuenow', state.form === 3 ? checksPerForm : state.checks);
    $$('.growth figure').forEach((figure) => figure.classList.toggle('is-current', Number(figure.dataset.form) === state.form));
  };

  const resetChecks = () => {
    state.checks = 0;
    checks.forEach((button) => { button.setAttribute('aria-pressed', 'false'); button.disabled = false; });
  };

  const restart = () => {
    clearTimeout(timer);
    state.form = 1;
    resetChecks();
    again.hidden = true;
    stageArt.src = art('Level1Happy');
    renderProgress();
    say('{name} is cheering you on. Check in three times.');
  };

  const evolve = (habit) => {
    state.form += 1;
    stageArt.src = art(`Level${state.form}Happy`);
    pop(plate);
    if (state.form === 3) {
      renderProgress();
      say(`<strong>New form!</strong> {name} has grown into a brand-new form thanks to ${escapeHTML(habit)}!`);
      again.hidden = false;
      return;
    }
    resetChecks();
    renderProgress();
    say('<strong>Level up!</strong> {name} grew. A new day, three more check-ins.');
  };

  checks.forEach((button) => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true' || state.form === 3) return;
    button.setAttribute('aria-pressed', 'true');
    state.checks += 1;
    renderProgress();
    progress.classList.remove('is-gaining');
    void progress.offsetWidth;
    progress.classList.add('is-gaining');

    if (state.checks < checksPerForm) {
      const left = checksPerForm - state.checks;
      say(`Nice. ${left === 1 ? 'One more check-in' : 'Two more check-ins'} and {name} grows.`);
      return;
    }
    checks.forEach((other) => { other.disabled = true; });
    timer = setTimeout(() => evolve(button.dataset.habit), reduceMotion ? 0 : 650);
  }));

  again.addEventListener('click', () => { restart(); checks[0].focus(); });

  $$('input[name="kind"]').forEach((input) => input.addEventListener('change', () => {
    state.kind = input.value;
    renderArt();
    pop(plate);
  }));

  const ownName = $('#own-name');
  $$('input[name="name"]').forEach((input) => input.addEventListener('change', () => {
    state.name = input.value;
    ownName.value = '';
    renderNames();
  }));
  ownName.addEventListener('input', () => {
    const typed = ownName.value.trim();
    const chosen = $('input[name="name"]:checked');
    if (typed && chosen) chosen.checked = false;
    if (!typed && !chosen) $('input[name="name"]').checked = true;
    state.name = typed || $('input[name="name"]:checked').value;
    renderNames();
  });

  $$('input[name="mood"]').forEach((input) => input.addEventListener('change', () => {
    state.mood = input.value;
    renderMood();
    pop($('#mood-plate'));
  }));

  // Browsers may restore form controls on reload, so read them back once.
  state.kind = $('input[name="kind"]:checked')?.value ?? state.kind;
  state.mood = $('input[name="mood"]:checked')?.value ?? state.mood;
  state.name = ownName.value.trim() || $('input[name="name"]:checked')?.value || state.name;
  renderArt();
  renderNames();
  renderProgress();
})();
