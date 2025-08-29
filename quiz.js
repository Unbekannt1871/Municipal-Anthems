let selectedMode = "all";
let filteredData = [];
let currentIndex = 0;

// 初期化：イベントリスナーの設定
document.addEventListener("DOMContentLoaded", () => {
  const modeSelector = document.getElementById("modeSelector");
  const startBtn = document.getElementById("startBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (modeSelector) {
    modeSelector.addEventListener("change", (e) => {
      selectedMode = e.target.value;
    });
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startQuizWithMode(selectedMode);
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", checkAnswer);
  }
});

// クイズ開始：モードに応じてデータを絞り込み
function startQuizWithMode(mode) {
  if (!Array.isArray(lyricsData) || lyricsData.length === 0) {
    alert("歌詞データが読み込まれていません");
    return;
  }

  if (mode === "all") {
    filteredData = [...lyricsData];
  } else {
    filteredData = lyricsData.filter(entry => entry.type === mode);
  }

  if (filteredData.length === 0) {
    alert("このモードにはデータがありません");
    return;
  }

  filteredData = shuffleArray(filteredData);
  currentIndex = 0;
  showNextQuestion();
}

// 問題表示：歌詞をマスクして表示
function showNextQuestion() {
  if (currentIndex >= filteredData.length) {
    document.getElementById("question").innerText = "クイズ終了！";
    document.getElementById("submitBtn").disabled = true;
    return;
  }

  const entry = filteredData[currentIndex];
  const maskedLyrics = maskMunicipality(entry.lyrics, entry.municipality);

  document.getElementById("question").innerText = maskedLyrics;
  document.getElementById("answerInput").value = "";
  document.getElementById("result").innerText = "";
  document.getElementById("submitBtn").disabled = false;
}

// 回答判定：入力と正解を比較
function checkAnswer() {
  const userAnswer = document.getElementById("answerInput").value.trim();
  const correctAnswer = filteredData[currentIndex].municipality;

  if (userAnswer === correctAnswer) {
    document.getElementById("result").innerText = "正解！";
  } else {
    document.getElementById("result").innerText = `不正解。正解は「${correctAnswer}」です。`;
  }

  currentIndex++;
  setTimeout(showNextQuestion, 1500);
}

// 歌詞から自治体名をマスク
function maskMunicipality(lyrics, municipality) {
  const regex = new RegExp(municipality, "g");
  return lyrics.replace(regex, "◯◯");
}

// 配列シャッフル
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
