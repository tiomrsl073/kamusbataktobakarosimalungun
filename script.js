let currentLang = '';

// === NAVIGASI ===
function showDictionary(lang) {
  currentLang = lang;
  document.getElementById('languageSelection').style.display = 'none';
  ['Toba', 'Karo', 'Simalungun'].forEach(d => {
    document.getElementById(`dictionary${d}`).style.display = lang === d.toLowerCase() ? 'block' : 'none';
  });
  renderAlphabetFilter(lang);
  filterWords(lang, '');
  document.getElementById(`search${capitalize(lang)}`).value = '';
  document.getElementById(`searchResult${capitalize(lang)}`).innerHTML = '';
}

function goBack() {
  document.querySelectorAll('.dictionary-page').forEach(el => el.style.display = 'none');
  document.getElementById('languageSelection').style.display = 'block';
}

// === PENCARIAN ===
function searchWord(lang) {
  const query = document.getElementById(`search${capitalize(lang)}`).value.trim().toLowerCase();
  const resultBox = document.getElementById(`searchResult${capitalize(lang)}`);
  const dict = dictionaries[lang];

  if (query === '') {
    resultBox.innerHTML = '';
    filterWords(lang, '');
    return;
  }

  // Cari partial match di batak atau arti (Indonesia)
  const matches = Object.entries(dict).filter(([batak, arti]) => 
    batak.toLowerCase().includes(query) || arti.toLowerCase().includes(query)
  );
  if (matches.length > 0) {
    const resultsHtml = matches.map(([batak, arti]) => `
      <div class="search-result">
        <strong style="color:var(--batak-red);">${capitalizeFirst(batak)}</strong> → 
        <strong>${capitalizeFirst(arti)}</strong>
      </div>
    `).join('');
    resultBox.innerHTML = resultsHtml;
  } else {
    resultBox.innerHTML = `<div class="search-result" style="background:#ffebee; border-left-color:#c62828;">
      Kata atau kalimat "<strong>${query}</strong>" tidak ditemukan.
    </div>`;
  }

  document.getElementById(`wordList${capitalize(lang)}`).innerHTML = '';
  document.querySelectorAll(`#alpha${capitalize(lang)} .alpha-btn`).forEach(b => b.classList.remove('active'));
}

// === RENDER KATA ===
function renderWordCard(batak, arti) {
  return `
    <div class="word-card">
      <div class="word-batak" style="color:var(--batak-red);">${capitalizeFirst(batak)}</div>
      <div class="word-indo">→ ${capitalizeFirst(arti)}</div>
    </div>
  `;
}

// === FILTER & RENDER ===
function filterWords(lang, letter) {
  const wordList = document.getElementById(`wordList${capitalize(lang)}`);
  const dict = dictionaries[lang];
  const words = Object.entries(dict);

  const searchInput = document.getElementById(`search${capitalize(lang)}`).value.trim();
  if (searchInput !== '') return;

  let filtered = letter === '' ? words : words.filter(([batak]) => batak.toUpperCase().startsWith(letter));
  filtered.sort((a, b) => a[0].localeCompare(b[0]));

  document.querySelectorAll(`#alpha${capitalize(lang)} .alpha-btn`).forEach(btn => {
    btn.classList.toggle('active', (letter === '' && btn.textContent === 'SEMUA') || btn.textContent === letter);
  });

  if (filtered.length === 0) {
    wordList.innerHTML = `<div class="no-words">Tidak ada kata untuk huruf <strong>${letter}</strong>.</div>`;
    return;
  }

  wordList.innerHTML = filtered.map(([batak, arti]) => renderWordCard(batak, arti)).join('');
}

function renderAlphabetFilter(lang) {
  const container = document.getElementById(`alpha${capitalize(lang)}`);
  container.innerHTML = '';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const allBtn = document.createElement('button');
  allBtn.className = 'alpha-btn active';
  allBtn.textContent = 'SEMUA';
  allBtn.onclick = () => {
    document.getElementById(`search${capitalize(lang)}`).value = '';
    document.getElementById(`searchResult${capitalize(lang)}`).innerHTML = '';
    filterWords(lang, '');
  };
  container.appendChild(allBtn);

  letters.forEach(letter => {
    if (Object.keys(dictionaries[lang]).some(w => w.toUpperCase().startsWith(letter))) {
      const btn = document.createElement('button');
      btn.className = 'alpha-btn';
      btn.textContent = letter;
      btn.onclick = () => filterWords(lang, letter);
      container.appendChild(btn);
    }
  });
}

// === UTILS ===
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function capitalizeFirst(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}