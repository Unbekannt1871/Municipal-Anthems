let currentIndex = 0;
let filteredLyrics = [];

// ページ読み込み時にイベント設定
document.addEventListener("DOMContentLoaded", () => {
  const modeSelector = document.getElementById("mode");
  const startButton = document.getElementById("quiz-start");
  const submitButton = document.getElementById("quiz-submit");

  if (startButton) {
    startButton.addEventListener("click", () => {
      const selectedMode = modeSelector ? modeSelector.value : "all";
      startQuiz(selectedMode);
    });
  }

  if (submitButton) {
    submitButton.addEventListener("click", checkAnswer);
  }
});

// クイズ開始：モードに応じて歌詞データを絞り込み
function startQuiz(mode) {
  if (!Array.isArray(lyricsData) || lyricsData.length === 0) {
    alert("歌詞データが読み込まれていません");
    return;
  }

  filteredLyrics = mode === "all"
    ? [...lyricsData]
    : lyricsData.filter(entry => entry.type === mode);

  if (filteredLyrics.length === 0) {
    alert("このモードにはデータがありません");
    return;
  }

  filteredLyrics = shuffleArray(filteredLyrics);
  currentIndex = 0;
  showQuestion();
}

// 歌詞表示（マスク済み前提）
function showQuestion() {
  const entry = filteredLyrics[currentIndex];

  document.getElementById("quiz-lyrics").textContent = entry.lyrics;
  document.getElementById("quiz-answer").value = "";
  document.getElementById("quiz-result").textContent = "";
  document.getElementById("quiz-submit").disabled = false;
}

// 回答判定
function checkAnswer() {
  const userInput = document.getElementById("quiz-answer").value.trim();
  const correct = filteredLyrics[currentIndex].municipality;

  if (userInput === correct) {
    document.getElementById("quiz-result").textContent = "正解！";
  } else {
    document.getElementById("quiz-result").textContent = `不正解。正解は「${correct}」です。`;
  }

  currentIndex++;
  if (currentIndex < filteredLyrics.length) {
    setTimeout(showQuestion, 1500);
  } else {
    document.getElementById("quiz-lyrics").textContent = "クイズ終了！";
    document.getElementById("quiz-submit").disabled = true;
  }
}

// 配列シャッフル
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
