require('dotenv').config();
const urlbase = process.env.API_URL;

let surahList = null;
const EDITION = 'quran-uthmani';

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

/* supposed to return an array of data [{,}] */
async function getSurahList() {
    if (surahList) return surahList;
    const res = await fetch(`${urlbase}/surah`);
    if (!res.ok) throw new Error("failed to get surah");
    const json = await res.json();
    const data = json.data;
    if (!data) throw new Error("failed to get  data");
    surahList = data;
    return data;
}

function pickRandomReference(surahs) {
    const surah = surahs[Math.floor(Math.random() * surahs.length)];
    const ayahNum = Math.floor(Math.random() * surah.numberOfAyahs) + 1;
    return `${surah.number}:${ayahNum}`;
}


async function getRandomVerse() {
    const surahs = await getSurahList();
    const reference = pickRandomReference(surahs);
    const res = await fetch(`${urlbase}/ayah/${reference}/${EDITION}`);
    if (!res.ok) throw new Error("failed to get ayah");
    const json = await res.json();
    if (!json.data) throw new Error("failed to get certain data");
    return json.data;
}

async function show(req, res, next) {

    const data = await getRandomVerse();
    return res.status(200).json({
        text: data.text,
        chapterNumber: data.surah?.number,
        verseNumber: data.numberInSurah,
        chapterName: data.surah?.name

    });


}

module.exports = { getSurahList, getRandomVerse, show: asyncHandler(show) };