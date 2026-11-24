let characterSprite; // 儲存角色一的精靈圖[cite: 2]
let walkSprite; // 儲存角色一的走路精靈圖[cite: 2]
let magicSprite; // 儲存角色一的施法精靈圖[cite: 2]
let magicEffectSprite; // 儲存角色一的魔法特效精靈圖[cite: 2]

let char2StopSprite; // 儲存角色二的待機精靈圖
let char2ActionSprite; // 儲存角色二的互動動作精靈圖

let bgImg; // 儲存背景圖片[cite: 2]
let bgX = 0; // 記錄背景目前的水平位移量[cite: 2]
let characterX; // 儲存角色一在畫布上的水平中心位置[cite: 2]
let isWalking = false; // 記錄角色是否已切換為走路動畫[cite: 2]
let facingDirection = 1; // 記錄角色朝向（1 為右，-1 為左）[cite: 2]
let isCasting = false; // 記錄角色是否正在播放施法動畫[cite: 2]
let magicStartFrame = 0; // 記錄施法動畫開始時的畫面計數[cite: 2]
let magicDirection = 1; // 記錄施法時鎖定的方向[cite: 2]
let spaceIsDown = false; // 記錄空白鍵是否已按住以避免重複觸發[cite: 2]
let activeEffects = []; // 儲存目前畫面上飛行中的魔法特效[cite: 2]

// 環保議題題目與作答狀態變數
let wasNearChar2 = false; // 記錄上一個畫面是否已接近角色二
let isQuizVisible = false; // 記錄目前是否正在顯示題目方框
let currentQuestion = ""; // 儲存目前的環保題目文字
let currentOptions = []; // 儲存目前的選擇題選項
let currentAnswerIndex = 0; // 記錄正確選項在打亂後的索引（0~2）
let lastQuestionIndex = -1; // 避免連續抽到完全相同的題目
let selectedOptionIndex = -1; // 記錄玩家點選的選項索引（-1 代表尚未作答）
let optionHitboxes = []; // 儲存三個選項的可點擊矩形區域

const environmentalQuestions = [
  {
    question: "外出購物時，下列哪種做法最能減少塑膠垃圾？",
    options: ["自備環保購物袋", "每次都拿新的塑膠袋", "將塑膠袋丟入一般垃圾"],
    answer: "自備環保購物袋"
  },
  {
    question: "在日常生活中，下列哪一項屬於節約能源的行為？",
    options: ["隨手關閉不使用的電燈", "冷氣溫度調到 18 度", "長時間不關電腦螢幕"],
    answer: "隨手關閉不使用的電燈"
  },
  {
    question: "喝完的寶特瓶在丟入資源回收桶前，應該怎麼處理？",
    options: ["倒空內容物並沖洗壓扁", "直接連同飲料殘渣丟入", "放進廚餘桶一起回收"],
    answer: "倒空內容物並沖洗壓扁"
  },
  {
    question: "下列哪一種交通方式最有助於減少碳排放？",
    options: ["搭乘大眾運輸或騎腳踏車", "短程也堅持開車出門", "讓汽機車在路邊怠速等待"],
    answer: "搭乘大眾運輸或騎腳踏車"
  },
  {
    question: "落實「惜食」觀念可以減少哪方面的環境負擔？",
    options: ["廚餘產生與食物浪費", "玻璃瓶的製造數量", "紙張的印刷耗材"],
    answer: "廚餘產生與食物浪費"
  }
];

const frameCountInSprite = 10; // 設定精靈圖包含的影格數[cite: 2]
const frameWidth = 139.5; // 設定每個影格的寬度（1395 除以 10）[cite: 2]
const frameHeight = 196; // 設定每個影格的高度[cite: 2]
const walkFrameCount = 9; // 設定走路精靈圖包含的影格數[cite: 2]
const walkFrameWidth = 1246 / walkFrameCount; // 計算走路動畫每格的寬度[cite: 2]
const walkFrameHeight = 198; // 設定走路動畫每格的高度[cite: 2]
const magicFrameCount = 4; // 設定施法精靈圖包含的影格數[cite: 2]
const magicFrameWidth = 1039 / magicFrameCount; // 計算施法動畫每格的寬度[cite: 2]
const magicFrameHeight = 146; // 設定施法動畫每格的高度[cite: 2]
const effectFrameCount = 5; // 設定魔法特效精靈圖包含的影格數[cite: 2]
const effectFrameWidth = 740 / effectFrameCount; // 計算魔法特效每格的寬度[cite: 2]
const effectFrameHeight = 19; // 設定魔法特效每格的高度[cite: 2]

// 角色二精靈圖參數
const char2StopFrameCount = 8; // 角色二待機精靈圖影格數
const char2StopFrameWidth = 699 / char2StopFrameCount; // 計算待機動畫每格寬度（699 / 8）
const char2StopFrameHeight = 190; // 待機動畫每格高度
const char2ActionFrameCount = 6; // 角色二動作精靈圖影格數
const char2ActionFrameWidth = 720 / char2ActionFrameCount; // 計算動作動畫每格寬度（720 / 6）
const char2ActionFrameHeight = 190; // 動作動畫每格高度

const framesPerStep = 8; // 設定動畫每隔幾個畫面更新一格[cite: 2]

function preload() { // 在畫布建立前載入角色圖片與背景[cite: 2]
  characterSprite = loadImage("1/stop/stop.png"); // 載入角色一的十格精靈圖[cite: 2]
  walkSprite = loadImage("1/walk/walk.png"); // 載入角色一的九格走路精靈圖[cite: 2]
  magicSprite = loadImage("1/magic/magic.png"); // 載入角色一的四格施法精靈圖[cite: 2]
  magicEffectSprite = loadImage("1/magic_effect/magic_effect.png"); // 載入五格魔法特效精靈圖[cite: 2]

  char2StopSprite = loadImage("2/stop/stop.png"); // 載入角色二的八格待機精靈圖
  char2ActionSprite = loadImage("2/action/action.png"); // 載入角色二的六格動作精靈圖

  bgImg = loadImage("bg/1.png"); // 載入背景圖片[cite: 2]
} // 結束圖片載入函式[cite: 2]

// 隨機挑選一題環保議題選擇題並打亂選項
function generateEnvQuestion() {
  let idx = floor(random(environmentalQuestions.length));
  if (environmentalQuestions.length > 1 && idx === lastQuestionIndex) {
    idx = (idx + 1) % environmentalQuestions.length;
  }
  lastQuestionIndex = idx;

  const qData = environmentalQuestions[idx];
  const shuffled = shuffle([...qData.options]);
  currentQuestion = qData.question;
  currentAnswerIndex = shuffled.indexOf(qData.answer);
  currentOptions = [
    `(A) ${shuffled[0]}`,
    `(B) ${shuffled[1]}`,
    `(C) ${shuffled[2]}`
  ];
  selectedOptionIndex = -1; // 重置作答狀態
}

// 將文字依最大寬度拆分為多行，確保單行絕對不超出方框
function wrapTextToLines(str, maxWidth, fontSize) {
  textSize(fontSize);
  const lines = [];
  let currentLine = "";

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const testLine = currentLine + ch;
    if (textWidth(testLine) <= maxWidth || currentLine.length === 0) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = ch;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

// 計算最適合放入方框的字級與行數，避免超出寬高
function fitLinesInBox(str, maxWidth, maxHeight, preferredSize, minSize = 11) {
  let size = preferredSize;
  while (size >= minSize) {
    const lines = wrapTextToLines(str, maxWidth, size);
    const lineHeight = size * 1.28;
    if (lines.length * lineHeight <= maxHeight) {
      return { lines, fontSize: size, lineHeight };
    }
    size -= 1;
  }
  const lines = wrapTextToLines(str, maxWidth, minSize);
  return { lines, fontSize: minSize, lineHeight: minSize * 1.22 };
}

function setup() { // 初始化畫布與繪圖模式[cite: 2]
  createCanvas(windowWidth, windowHeight); // 建立符合視窗尺寸的畫布[cite: 2]
  imageMode(CENTER); // 讓角色座標代表影格的中心點[cite: 2]
  characterX = width / 2; // 將角色初始位置設在畫布正中間[cite: 2]
  frameRate(60); // 將動畫更新速率設定為每秒六十格[cite: 2]
  generateEnvQuestion(); // 預先產生一題環保議題題目
} // 結束初始化函式[cite: 2]

function draw() { // 每個畫面更新一次背景與角色[cite: 2]
  // 計算等比例縮放後的背景寬高（完全依照原圖比例，不加不減）[cite: 2]
  const bgHeight = height;
  const bgWidth = bgImg.width * (bgHeight / bgImg.height);

  const movingRight = keyIsDown(RIGHT_ARROW); // 檢查右方向鍵目前是否按住[cite: 2]
  const movingLeft = keyIsDown(LEFT_ARROW); // 檢查左方向鍵目前是否按住[cite: 2]
  isWalking = movingRight || movingLeft; // 沒有按住左右鍵時切回站立動畫[cite: 2]
  const movementStep = constrain(width * 0.004, 2, 8); // 計算移動速度[cite: 2]

  // 計算角色尺寸（高度為畫布 1/3，寬度依比例縮放）[cite: 2]
  const activeSprite = isCasting ? magicSprite : isWalking ? walkSprite : characterSprite;
  const activeFrameCount = isCasting ? magicFrameCount : isWalking ? walkFrameCount : frameCountInSprite;
  const activeFrameWidth = isCasting ? magicFrameWidth : isWalking ? walkFrameWidth : frameWidth;
  const activeFrameHeight = isCasting ? magicFrameHeight : isWalking ? walkFrameHeight : frameHeight;

  const characterHeight = height / 3;
  const characterScale = characterHeight / activeFrameHeight;
  const characterWidth = activeFrameWidth * characterScale;

  // 總可滾動背景寬度（例如 2 張圖的長度，讓背景可以左右滑動一段距離）[cite: 2]
  const maxBgX = 0;
  const minBgX = -bgWidth; // 限制背景最多滾動一張圖的寬度[cite: 2]

  if (movingRight) {
    isWalking = true;
    facingDirection = 1;
    // 優先捲動背景：如果背景還沒卷到最右邊界[cite: 2]
    if (bgX > minBgX) {
      bgX -= movementStep;
      if (bgX < minBgX) bgX = minBgX; // 鎖死在邊界[cite: 2]
    } else {
      // 背景到底，改由角色往右移動[cite: 2]
      characterX += movementStep;
      characterX = constrain(characterX, characterWidth / 2, width - characterWidth / 2);
    }
  } else if (movingLeft) {
    isWalking = true;
    facingDirection = -1;
    // 優先捲動背景：如果背景還沒卷到最左邊界[cite: 2]
    if (bgX < maxBgX) {
      bgX += movementStep;
      if (bgX > maxBgX) bgX = maxBgX; // 鎖死在邊界[cite: 2]
    } else {
      // 背景到底，改由角色往左移動[cite: 2]
      characterX -= movementStep;
      characterX = constrain(characterX, characterWidth / 2, width - characterWidth / 2);
    }
  }

  // 繪製 2 張無縫接續的背景圖片（絕對不變形、不模糊）[cite: 2]
  imageMode(CORNER);
  image(bgImg, bgX, 0, bgWidth, bgHeight);         // 第一張背景（最左邊背景圖）
  image(bgImg, bgX + bgWidth, 0, bgWidth, bgHeight); // 第二張緊鄰接續的背景[cite: 2]
  imageMode(CENTER); // 恢復中心點模式繪製角色[cite: 2]

  // --- 繪製角色二（顯示在最左邊背景圖的中間） ---
  const char2X = bgX + bgWidth / 2; // 角色二水平中心位於最左邊背景圖的中間
  const char2Height = height / 3; // 角色二高度同樣設為畫布的 1/3
  const char2BaseWidth = char2StopFrameWidth * (char2Height / char2StopFrameHeight); // 基準寬度用於距離判斷
  const triggerDistance = (characterWidth / 2) + (char2BaseWidth / 2) + 60; // 判斷接近的距離閾值
  const isNearChar2 = abs(characterX - char2X) < triggerDistance; // 角色一接近角色二時為 true
  isQuizVisible = isNearChar2;

  // 若剛從遠處接近角色二，重新抽一題環保議題選擇題
  if (isNearChar2 && !wasNearChar2) {
    generateEnvQuestion();
  }
  wasNearChar2 = isNearChar2;

  const activeChar2Sprite = isNearChar2 ? char2ActionSprite : char2StopSprite; // 接近改用 action.png，遠離恢復 stop.png
  const activeChar2FrameCount = isNearChar2 ? char2ActionFrameCount : char2StopFrameCount;
  const activeChar2FrameWidth = isNearChar2 ? char2ActionFrameWidth : char2StopFrameWidth;
  const activeChar2FrameHeight = isNearChar2 ? char2ActionFrameHeight : char2StopFrameHeight;

  const char2Scale = char2Height / activeChar2FrameHeight;
  const char2Width = activeChar2FrameWidth * char2Scale;
  const char2Y = height - char2Height / 2; // 角色二底部對齊畫布底部

  const char2FrameIndex = floor(frameCount / framesPerStep) % activeChar2FrameCount; // 循環播放影格
  const char2SourceX = char2FrameIndex * activeChar2FrameWidth;

  push();
  translate(char2X, char2Y);
  // 若角色二預設面向左方且需面朝右方角色一，可取消下方註解
  // scale(-1, 1);
  image(activeChar2Sprite, 0, 0, char2Width, char2Height, char2SourceX, 0, activeChar2FrameWidth, activeChar2FrameHeight);
  pop();

  if (isCasting && frameCount - magicStartFrame >= magicFrameCount * framesPerStep) { // 檢查施法動畫是否已完整播放一次[cite: 2]
    isCasting = false; // 結束施法動畫並恢復一般角色動作[cite: 2]
    activeEffects.push({ x: characterX + magicDirection * characterWidth / 2, y: height - characterHeight * 0.58, direction: magicDirection }); // 在角色前方建立朝施法方向飛行的特效[cite: 2]
  } // 結束施法動畫完成判斷[cite: 2]

  const elapsedMagicFrames = frameCount - magicStartFrame; // 計算施法動畫已播放的畫面數[cite: 2]
  const frameIndex = isCasting ? floor(elapsedMagicFrames / framesPerStep) : floor(frameCount / framesPerStep) % activeFrameCount; // 計算目前要顯示的精靈影格[cite: 2]
  const sourceX = frameIndex * activeFrameWidth; // 計算目前影格在精靈圖中的水平起點[cite: 2]
  const activeWidth = characterWidth; // 目前影格的顯示寬度[cite: 2]
  const activeHeight = characterHeight; // 目前影格的顯示高度[cite: 2]
  const characterY = height - activeHeight / 2; // 將目前角色影格底部對齊畫布底部[cite: 2]

  push(); // 暫存目前的繪圖座標轉換狀態[cite: 2]
  translate(characterX, characterY); // 將繪圖原點移至角色中心[cite: 2]
  scale(isCasting ? magicDirection : facingDirection, 1); // 依施法或角色朝向決定是否水平翻轉[cite: 2]
  image(activeSprite, 0, 0, activeWidth, activeHeight, sourceX, 0, activeFrameWidth, activeFrameHeight); // 裁切並繪製目前角色影格[cite: 2]
  pop(); // 還原繪圖座標轉換狀態[cite: 2]

  const effectScale = characterScale; // 使用相同的比例縮放讓特效適應[cite: 2]
  const effectWidth = effectFrameWidth * effectScale; // 計算特效影格的顯示寬度[cite: 2]
  const effectHeight = effectFrameHeight * effectScale; // 計算特效影格的顯示高度[cite: 2]
  const effectSpeed = max(6, width * 0.008); // 依畫布寬度計算特效飛行速度[cite: 2]
  for (let effectIndex = activeEffects.length - 1; effectIndex >= 0; effectIndex--) { // 由後往前更新所有飛行中的特效[cite: 2]
    const effect = activeEffects[effectIndex]; // 取得目前更新的特效資料[cite: 2]
    effect.x += effect.direction * effectSpeed; // 依特效方向更新水平位置[cite: 2]
    if (effect.x > width || effect.x < 0) { // 判斷特效是否已抵達畫布左右邊緣[cite: 2]
      activeEffects.splice(effectIndex, 1); // 移除已飛出畫布的特效[cite: 2]
      continue; // 略過已移除特效的繪製[cite: 2]
    } // 結束特效邊界判斷[cite: 2]
    const effectFrameIndex = floor(frameCount / framesPerStep) % effectFrameCount; // 計算特效目前播放的影格[cite: 2]
    push(); // 暫存目前的繪圖座標轉換狀態[cite: 2]
    translate(effect.x, effect.y); // 將繪圖原點移至特效中心[cite: 2]
    scale(effect.direction, 1); // 依飛行方向翻轉特效影格[cite: 2]
    image(magicEffectSprite, 0, 0, effectWidth, effectHeight, effectFrameIndex * effectFrameWidth, 0, effectFrameWidth, effectFrameHeight); // 裁切並繪製目前特效影格[cite: 2]
    pop(); // 還原繪圖座標轉換狀態[cite: 2]
  } // 結束飛行中特效更新迴圈[cite: 2]

  // --- 當角色1接近角色2時，在畫布最上層顯示透明度 90 的黃色環保議題方框 ---
  optionHitboxes = [];
  let hoveringOption = false;

  if (isNearChar2) {
    const boxWidth = width / 3;          // 寬為整個畫布的 1/3[cite: 2]
    const boxHeight = height / 2;        // 高為整個畫布高的 1/2[cite: 2]
    const boxX = (width - boxWidth) / 2; // 方框的中間對準畫布的中間[cite: 2]
    const boxY = 10;                     // 方框上方靠近畫布上方[cite: 2]

    push();
    fill(255, 235, 59, 90);              // 黃色框，透明度為 90[cite: 2]
    stroke(200, 170, 0, 180);
    strokeWeight(3);
    rectMode(CORNER);
    rect(boxX, boxY, boxWidth, boxHeight, 16);

    fill(30);
    noStroke();
    textAlign(CENTER, TOP);

    const innerPaddingX = 16;
    const innerPaddingY = 12;
    const maxTextWidth = max(40, boxWidth - innerPaddingX * 2);
    const maxTotalHeight = max(60, boxHeight - innerPaddingY * 2);
    const centerX = boxX + boxWidth / 2;

    const baseSize = constrain(min(boxWidth * 0.052, boxHeight * 0.064), 12, 22);
    const titleSize = max(12, baseSize * 0.88);
    const titleHeight = titleSize * 1.35;

    // 1. 標題
    textSize(titleSize);
    textStyle(BOLD);
    text("環保議題挑戰（請點選答案）", centerX, boxY + innerPaddingY);

    // 2. 分配「題目區」、「選項區」與「作答回饋區」高度，確保不超出方框
    const remainingHeight = max(50, maxTotalHeight - titleHeight - 6);
    const questionAreaHeight = remainingHeight * 0.28;
    const optionsAreaHeight = remainingHeight * 0.52;
    const feedbackAreaHeight = remainingHeight * 0.16;

    const questionStartY = boxY + innerPaddingY + titleHeight + 4;
    const optionsStartY = questionStartY + questionAreaHeight + remainingHeight * 0.02;
    const feedbackStartY = optionsStartY + optionsAreaHeight + remainingHeight * 0.02;

    // 3. 題目自適應縮放與換行
    textStyle(BOLD);
    const qFit = fitLinesInBox(currentQuestion, maxTextWidth, questionAreaHeight, baseSize * 0.98, 11);
    textSize(qFit.fontSize);
    const qBlockHeight = qFit.lines.length * qFit.lineHeight;
    const qTopY = questionStartY + max(0, (questionAreaHeight - qBlockHeight) / 2);
    for (let i = 0; i < qFit.lines.length; i++) {
      text(qFit.lines[i], centerX, qTopY + i * qFit.lineHeight);
    }

    // 4. 三個可點選選項按鈕
    textStyle(NORMAL);
    const singleSlotHeight = optionsAreaHeight / 3;
    const btnX = boxX + innerPaddingX;
    const btnW = maxTextWidth;

    for (let optIdx = 0; optIdx < 3; optIdx++) {
      const slotTop = optionsStartY + optIdx * singleSlotHeight;
      const btnY = slotTop + 2;
      const btnH = max(16, singleSlotHeight - 4);

      optionHitboxes.push({ x: btnX, y: btnY, w: btnW, h: btnH, index: optIdx });

      const isHover =
        mouseX >= btnX &&
        mouseX <= btnX + btnW &&
        mouseY >= btnY &&
        mouseY <= btnY + btnH;

      if (isHover && selectedOptionIndex === -1) {
        hoveringOption = true;
      }

      // 依作答與滑鼠懸停狀態決定按鈕底色與邊框
      if (selectedOptionIndex !== -1) {
        if (optIdx === currentAnswerIndex) {
          // 正確答案標示為綠色
          fill(76, 175, 80, 210);
          stroke(46, 125, 50, 240);
        } else if (optIdx === selectedOptionIndex) {
          // 選錯的選項標示為紅色
          fill(244, 67, 54, 210);
          stroke(183, 28, 28, 240);
        } else {
          fill(255, 255, 255, 130);
          stroke(160, 140, 40, 140);
        }
      } else if (isHover) {
        fill(255, 255, 255, 220);
        stroke(180, 140, 0, 230);
      } else {
        fill(255, 255, 255, 150);
        stroke(180, 150, 30, 160);
      }

      strokeWeight(1.5);
      rect(btnX, btnY, btnW, btnH, 8);

      // 繪製選項文字（已作答且高亮的選項改用白字更清楚）
      noStroke();
      if (
        selectedOptionIndex !== -1 &&
        (optIdx === currentAnswerIndex || optIdx === selectedOptionIndex)
      ) {
        fill(255);
      } else {
        fill(25);
      }

      const optFit = fitLinesInBox(
        currentOptions[optIdx],
        btnW - 12,
        btnH - 4,
        baseSize * 0.9,
        10
      );
      textSize(optFit.fontSize);
      const optBlockHeight = optFit.lines.length * optFit.lineHeight;
      const optTopY = btnY + max(0, (btnH - optBlockHeight) / 2);
      for (let lineIdx = 0; lineIdx < optFit.lines.length; lineIdx++) {
        text(optFit.lines[lineIdx], centerX, optTopY + lineIdx * optFit.lineHeight);
      }
    }

    // 5. 作答結果與正確答案提示區（答錯時顯示正確答案）
    if (selectedOptionIndex !== -1) {
      const isCorrect = selectedOptionIndex === currentAnswerIndex;
      const feedbackText = isCorrect
        ? "答對了！環保觀念滿分！"
        : `答錯了！正確答案是：${currentOptions[currentAnswerIndex]}`;

      textStyle(BOLD);
      const fbFit = fitLinesInBox(
        feedbackText,
        maxTextWidth,
        feedbackAreaHeight,
        baseSize * 0.88,
        10
      );
      textSize(fbFit.fontSize);
      fill(isCorrect ? color(20, 110, 30) : color(180, 20, 20));

      const fbBlockHeight = fbFit.lines.length * fbFit.lineHeight;
      const fbTopY = feedbackStartY + max(0, (feedbackAreaHeight - fbBlockHeight) / 2);
      for (let i = 0; i < fbFit.lines.length; i++) {
        text(fbFit.lines[i], centerX, fbTopY + i * fbFit.lineHeight);
      }
    }

    pop();
  }

  cursor(hoveringOption ? HAND : ARROW);
} // 繪圖函式結束[cite: 2]

function mousePressed() { // 滑鼠點擊選項作答
  if (!isQuizVisible || selectedOptionIndex !== -1) {
    return;
  }
  for (let i = 0; i < optionHitboxes.length; i++) {
    const box = optionHitboxes[i];
    if (
      mouseX >= box.x &&
      mouseX <= box.x + box.w &&
      mouseY >= box.y &&
      mouseY <= box.y + box.h
    ) {
      selectedOptionIndex = box.index;
      break;
    }
  }
}

function keyPressed() { // 按下方向鍵時切換角色狀態與朝向[cite: 2]
  if (keyCode === RIGHT_ARROW) { // 判斷是否按下右方向鍵[cite: 2]
    isWalking = true; // 啟用走路動畫[cite: 2]
    facingDirection = 1; // 讓角色面向右方[cite: 2]
    return false; // 防止方向鍵捲動網頁[cite: 2]
  } // 結束右方向鍵判斷[cite: 2]
  if (keyCode === LEFT_ARROW) { // 判斷是否按下左方向鍵[cite: 2]
    isWalking = true; // 啟用走路動畫[cite: 2]
    facingDirection = -1; // 讓角色面向左方[cite: 2]
    return false; // 防止方向鍵捲動網頁[cite: 2]
  } // 結束左方向鍵判斷[cite: 2]
  if (keyCode === 32) { // 判斷是否按下空白鍵[cite: 2]
    if (!spaceIsDown && !isCasting) { // 僅在空白鍵新按下且角色未施法時觸發[cite: 2]
      isCasting = true; // 開始播放施法動畫[cite: 2]
      magicStartFrame = frameCount; // 記錄施法動畫的起始畫面[cite: 2]
      magicDirection = facingDirection; // 鎖定施法當下角色面向[cite: 2]
    } // 結束施法啟動判斷[cite: 2]
    spaceIsDown = true; // 記錄空白鍵已按住以避免連續觸發[cite: 2]
    return false; // 防止空白鍵捲動網頁[cite: 2]
  } // 結束空白鍵判斷[cite: 2]

  // 支援鍵盤按 A/B/C 或 1/2/3 快速作答
  if (isQuizVisible && selectedOptionIndex === -1) {
    const upperKey = key.toUpperCase();
    if (upperKey === "A" || key === "1") selectedOptionIndex = 0;
    else if (upperKey === "B" || key === "2") selectedOptionIndex = 1;
    else if (upperKey === "C" || key === "3") selectedOptionIndex = 2;
  }
} // 結束按鍵事件處理函式[cite: 2]

function keyReleased() { // 鍵盤按鍵放開時更新按鍵狀態[cite: 2]
  if (keyCode === 32) { // 判斷放開的是否為空白鍵[cite: 2]
    spaceIsDown = false; // 允許下次按空白鍵重新施法[cite: 2]
  } // 結束空白鍵放開判斷[cite: 2]
} // 結束按鍵放開事件處理函式[cite: 2]

function windowResized() { // 視窗尺寸改變時重新調整畫布[cite: 2]
  resizeCanvas(windowWidth, windowHeight); // 將畫布同步為新的視窗尺寸[cite: 2]
  characterX = constrain(characterX, 1, width - 1); // 將角色位置限制在縮放後畫布內[cite: 2]
} // 結束視窗縮放處理函式[cite: 2]