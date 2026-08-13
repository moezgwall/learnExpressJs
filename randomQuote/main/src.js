const btn = document.getElementById('getSurah');
const verse = document.getElementById('verse');
const surahName = document.getElementById('surahName');
const chapterNumber = document.getElementById('chapterNumber');
const err = document.getElementById('err');

async function fetchRandomVerse() {
  const res = await fetch('/api/verse');
  if (!res.ok) throw new Error("unable to fetch data");
  return res.json();
}

async function updateUi() {
  btn.disabled = true;
  err.textContent = '';
  try {
    const data = await fetchRandomVerse();
    verse.innerHTML = `<span>${data.text}</span> <span>${data.verseNumber}</span>`;
    surahName.textContent = data.chapterName;
    chapterNumber.textContent = `[${data.chapterNumber}:${data.verseNumber}]`;
  } catch (e) {
    console.error(e);
    err.textContent = "Couldn't load a verse — try again.";
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener('click', () => {
  updateUi();
});
updateUi();