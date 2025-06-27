let currentLevel = 1;
let posX = 0, posY = 0;
let gameWidth, gameHeight, velocityY = 0;
let platformX = 0, platformSpeed = 0, platformMin = 0, platformMax = 0;
let keys = { left: false, right: false, onGround: false, e: false };
const gravity = 0.1;
const jumpPower = -8;
const step = 1.2;
const game = document.getElementById('game');
const player = document.getElementById('player');
let frameIndex = 0;
let frameDelay = 0;
const totalFrames = 7; // кількість кадрів бігу
const frameWidth = 32;
const frameHeight = 32;
const runRowY = 96; // вертикальна позиція спрайту (рядок бігу)
let facingLeft = false;
const jumpX = 32;      // координата кадру стрибка
const jumpY = 128;     // рядок стрибка
let isJumping = false; // флаг у повітрі
let dialogBox;
let dialogContainer;
let choicesDiv;
let dialogueVerif = false;
let moveVerif = true;
let customInput = ``;
let awaitingTextInput;
let currentUserPass = false;
let currentUser = false;
let currentUserHistory = [];
let menuVerif = true;
let  currentCameraX = 0;
let chestVerif = false;
let files = ``;
let code = ` `;
let fileList
let typeSound = document.getElementById(`type-sound`);
let pastPos;
let pastFacing;
let congratSound = document.getElementById(`congrat-sound`);
let failSound = document.getElementById(`fail-sound`);
let jumpSound = document.getElementById(`jump-sound`);
congratSound.volume = 0.2;
failSound.volume = 0.2;
jumpSound.volume = 0.2;
let loadVerif = false;
let globMusic = document.getElementById(`glob-music`);
globMusic.volume = 0.2;
let tempLogin = localStorage.getItem(`currentUser`) || false;
let tempPassword = localStorage.getItem(`currentUserPass`) || false;

$(`.menu`).hide();

axios.post(`http://localhost:3000/signIn`,{
  login:tempLogin,
  password:tempPassword
})
.then(res => {
  if(res.data != `Incorrect login` && res.data != `Incorrect password`){
    localStorage.setItem(`currentUser`, tempLogin);
    localStorage.setItem(`currentUserPass`,tempPassword);
    currentUserPass =  tempPassword;
    currentUser = tempLogin;
    currentUserHistory = res.data.history;
    closeAllForms();
  } else {
    localStorage.removeItem(`currentUser`);
    localStorage.removeItem(`currentUserPass`);
    currentUserPass = false;
    currentUser = false;
    closeAllForms();
  }
});

function updateCamera() {
  const viewportWidth = document.getElementById('viewport').clientWidth;
  const cameraX = Math.min(
    Math.max(0, posX - viewportWidth / 2), // тримати гравця в центрі
    game.offsetWidth - viewportWidth // не виходити за межі
  );
  
 
  let playerScreenX = posX - currentCameraX;
  let screenWidth = document.getElementById('viewport').clientWidth + 40;
  if (playerScreenX > screenWidth) {
    currentCameraX += screenWidth;
    screenWidth += screenWidth;
  } else if (playerScreenX < 0) {
    currentCameraX -= screenWidth;
    if (currentCameraX < 0) currentCameraX = 0;
  }

  game.style.transform = `translateX(-${currentCameraX}px)`;
  document.getElementById(`menu`).style.transfrom = `translateX(${currentCameraX}px)`
  if(dialogContainer && choicesDiv){
    dialogContainer.style.transform = `translateX(${currentCameraX}px)`;
    choicesDiv.style.transform = `translateX(${currentCameraX}px)`;
  }

}

function loadLevel(level) {
  // Скидання
  const background1 = document.getElementById(`background1`);
  const background2 = document.getElementById(`background2`);
  const background3 = document.getElementById(`background3`);
  game.innerHTML = ''; // очищення
  game.appendChild(player);
  game.appendChild(background1);
  game.appendChild(background2);
  game.appendChild(background3);
  update();
  game.classList.remove('fade-in');
  game.classList.add('fade-out');
  const npc = document.createElement('div');
  npc.id = 'npc';
  npc.style.position = 'absolute';
  npc.style.left = '70%';
  npc.style.bottom = '5%';
  npc.style.width = '5%';
  npc.style.height = '10%';
  npc.transition = `0`
  // npc.style.background = 'blue';
  game.appendChild(npc);


  const npcIndicator = document.createElement('div');
  npcIndicator.id = 'npcIndicator';
  npcIndicator.textContent = '[E]';
  npcIndicator.style.position = 'absolute';
  npcIndicator.style.display = 'none';
  npcIndicator.style.fontWeight = 'bold';
  game.appendChild(npcIndicator);

const dialogContainer = document.createElement('div');
dialogContainer.id = 'dialogContainer';
dialogContainer.innerHTML = `
    <div class="dialogImage" id="dialogImage"></div>
    <div id="dialog-box">Натисніть Enter, щоб почати діалог...</div>
    <p id="custom-input"></p>
  </div>
  
`;
game.appendChild(dialogContainer);
const choices = document.createElement(`div`);
choices.id = 'choices';
game.appendChild(choices);

const npcIndicator1 = document.createElement('div');
  npcIndicator1.id = 'npcIndicator1';
  npcIndicator1.textContent = '[E]';
  npcIndicator1.style.position = 'absolute';
  npcIndicator1.style.display = 'none';
  npcIndicator1.style.fontWeight = 'bold';
  game.appendChild(npcIndicator1);
  const npc1 = document.createElement('div');
  npc1.id = 'npc1';
  npc1.style.position = 'absolute';
  npc1.transition = `0`
  game.appendChild(npc1);

  fileList = document.createElement('div');
  fileList.id = 'fileList';
  fileList.style.position = 'absolute';
  fileList.transition = `0`
  game.appendChild(fileList);
   posX = game.clientWidth * 0.1;
    posY = game.clientHeight * 0.1;
    velocityY = 0;
  if (level === 1) {
      
      createObstacle('floor', 0, 92.3, 100, 5, '');
      createObstacle('rightWall', 43.9, 71.4, 1, 40, '');
      createObstacle('leftWall', 50.2, 71.4, 1, 40, '');
      createObstacle('topWall', 43.9, 71.4, 6.3, 40, '');

      game.style.width = '4500px';
      // createFinish();
    } else if (level === 2) {
      createObstacle('floor', 0, 80.3, 100, 5, '');
      
      createFinish();
      game.style.backgroundImage = 'url(./sprites/background1.png)';

    }


  setTimeout(() => {
    // document.body.style.backgroundColor = '#fff';
  

   

    // Після завантаження — плавно показати рівень
  
    game.classList.remove('fade-out');
    game.classList.add('fade-in');
    
  }, 1000); // 0.5 секунди

  
 
}


 const dialogLines = [
      { text: "Код?", choices: ["Ввести", "Я не пам'ятаю"]},
      { text: `На щастя, ти тут не в перше. Трішки далі буде "історія", в ній все написано`,  },
      { text: "" },
      { text: "" }
    ];
const dialogLines1 = [
      { text: "Код?", choices: ["Ввести", "Я не пам'ятаю"]},
      { text: " " },
      { text: "..." },
      { text: "Ось, ваш файл" },
  ];
const dialogLines2 = [
      { text: "Код?", choices: ["Ввести", "Я не пам'ятаю"]},
      { text: " " },
      { text: "..." },
      { text: "Немає такого коду, дуй звідси, жулік!" },
  ];
const dialogLines3 = [
      { text: "Код?", choices: ["Ввести", "Я не пам'ятаю"]},
      { text: " " },
      { text: "..." },
      { text: "Ой, непередбачені проблеми, підійдіть пізніше" },
  ];

  const dialogLines5 = [
      { text: "Код?", choices: ["Ввести", "Я не пам'ятаю"]},
      { text: "Нічим не зараджу" },
      { text: "..." },
      { text: "Киш" },
  ];


   
    let currentLine = -1;
    let isTyping = false;
    let typingInterval;
    let charIndex = 0;
    let fullText = "";
    let choice = 1;

    let currentChoices = [];
    let selectedChoiceIndex = 0;
    let isChoosing = false;

    function playTypeSound() {
  if (!typeSound) return;

  typeSound.currentTime = 0; // повертаємо звук на початок
  typeSound.volume = 0.2;

  typeSound.play().catch((err) => {
    // Якщо звук не можна відтворити (наприклад, браузер блокує), просто ігноруємо
    console.warn("Не вдалося відтворити звук:", err);
  });
}

    function typeLine(text) {
      fullText = text;
      charIndex = 0;
      dialogBox.textContent = "";
      isTyping = true;

      typingInterval = setInterval(() => {
        dialogBox.textContent += fullText[charIndex];
        playTypeSound();
        charIndex++;
        if (charIndex >= fullText.length) {
          clearInterval(typingInterval);
          isTyping = false;
        }
      }, 40);
    }

    function skipTyping() {
      clearInterval(typingInterval);
      dialogBox.textContent = fullText;
      isTyping = false;
    }

    function showChoices(choices) {
      isChoosing = true;
      currentChoices = choices;
      selectedChoiceIndex = 0;
      renderChoices();
    }

    function renderChoices() {
      choicesDiv.innerHTML = "";
      currentChoices.forEach((choice, index) => {
        const btn = document.createElement("div");
        btn.className = "choice-button" + (index === selectedChoiceIndex ? " selected" : "");
        btn.textContent = choice;
        choicesDiv.appendChild(btn);
      });
    }

    function confirmChoice() {
      isChoosing = false;
      choicesDiv.innerHTML = "";
      if (selectedChoiceIndex === 0) {
        choice = 2; // "Так" → наступна позитивна репліка
      } else {
        choice = 1; // "Ні" → наступна негативна
                   // "Ні" → питання "Чому?"

      }
      showNextLine();
    }

    function showNextLine() {
      if(choice == 1){
        if(currentUser != false && currentUserPass != false){
          document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/dialogueBard.png)`;
         currentLine++;
      if (currentLine >= dialogLines.length) {
        moveVerif = true;
        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine = -1;
        choice = 1;
        dialogueVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``
        return;
      }
    
      const line = dialogLines[currentLine];
      if (line.choices) {
        typeLine(line.text);
        const waitUntilTyped = setInterval(() => {
          if (!isTyping) {
            showChoices(line.choices);
            clearInterval(waitUntilTyped);
          }
        }, 100);
      } else {
        typeLine(line.text);
      }
    }else {
       document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/dialogueBard.png)`;
         currentLine++;
      if (currentLine >= dialogLines5.length) {
        moveVerif = true;
        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine = -1;
        choice = 1;
        dialogueVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``
        return;
      }
    
      const line = dialogLines5[currentLine];
      if (line.choices) {
        typeLine(line.text);
        const waitUntilTyped = setInterval(() => {
          if (!isTyping) {
            showChoices(line.choices);
            clearInterval(waitUntilTyped);
          }
        }, 100);
      } else {
        typeLine(line.text);
      }
    }
      } else if(choice ==2){
        document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/dialogueBard.png)`;        
        currentLine++;
        if(currentLine == 1) document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/shovelDialog.png)`;
        const waitUntilTyped = setInterval(() => {
          if (!isTyping) {
            awaitingTextInput = true;
            document.getElementById(`custom-input`).style.display = "block";
            clearInterval(waitUntilTyped);
          }
        }, 100);
      if (currentLine >= dialogLines1.length) {
        moveVerif = true;  
        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine = -1;
        choice = 1;
        dialogueVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``;
        return;
      }

      const line = dialogLines1[currentLine];
      if (line.choices) {
        typeLine(line.text);
        const waitUntilTyped = setInterval(() => {
          if (!isTyping) {
            showChoices(line.choices);
            clearInterval(waitUntilTyped);
          }
        }, 100);
      } else {
        typeLine(line.text);
      }
      }else if(choice ==3){
        document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/dialogueBard.png)`;   
        currentLine++;
      if (currentLine >= dialogLines2.length) {
        moveVerif = true;
          dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine = -1;
        choice = 1;
        dialogueVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``;
        return;
      }

      const line = dialogLines2[currentLine];
      if (line.choices) {
        typeLine(line.text);
        const waitUntilTyped = setInterval(() => {
          if (!isTyping) {
            showChoices(line.choices);
            clearInterval(waitUntilTyped);
          }
        }, 100);
      } else {
        typeLine(line.text);
      }
      } else if(choice ==4){
        document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/dialogueBard.png)`;        
        currentLine++;
      if (currentLine >= dialogLines3.length) {
        moveVerif = true;  
        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine = -1;
        choice = 1;
        dialogueVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``;
        return;
      }

      const line = dialogLines3[currentLine];
      if (line.choices) {
        typeLine(line.text);
        const waitUntilTyped = setInterval(() => {
          if (!isTyping) {
            showChoices(line.choices);
            clearInterval(waitUntilTyped);
          }
        }, 100);
      } else {
        typeLine(line.text);
      }
      }
      
      
     
    }


function createObstacle(id, left, top, width, height, color, moving = false) {
  const div = document.createElement('div');
  div.classList.add('obstacle');
  div.id = id;
  div.style.position = 'absolute';
  div.style.left = left + '%';
  div.style.top = top + '%';
  div.style.width = width + '%';
  div.style.height = height + '%';
  div.style.backgroundColor = color;
  game.appendChild(div);

  if (moving) {
    platformX = (left / 100) * game.clientWidth;
    platformSpeed = game.clientWidth * 0.002;
    platformMin = platformX - game.clientWidth * 0.1;
    platformMax = platformX + game.clientWidth * 0.3;
  }
}

function createFinish() {
  const f = document.createElement('div');
  f.id = 'finish';
  f.style.position = 'absolute';
  f.style.right = '0';
  f.style.bottom = '0';
  f.style.width = '5%';
  f.style.height = '10%';
  f.style.backgroundColor = 'gold';
  f.style.border = '2px dashed #555';
  game.appendChild(f);
}




// Клавіатура

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && moveVerif) keys.left = true;
  if (e.key === 'ArrowRight' && moveVerif ) keys.right = true;
  if ((e.key === ' ' && moveVerif|| e.key === 'ArrowUp' && moveVerif) && keys.onGround  ) {
    jumpSound.play();
    velocityY = jumpPower;
    keys.onGround = false;
    
  }
  
  if(e.keyCode == 27 && loadVerif){
    moveVerif = false;
    menuVerif = false;
    $(`.menu`).show();
    game.style.filter = `brightness(5%)`;
  }

  if (e.key === 'e' && menuVerif) keys.e = true;
  
    if (awaitingTextInput && dialogueVerif && currentLine == 1 && choice == 2 && menuVerif) {
      
    if (event.key === "Enter") {
      if (customInput.trim() !== "") {  
        axios.get(`http://localhost:3000/download/${customInput.trim()}`,  {responseType: 'blob'})
        .then(res => {
          
            choice = 2;
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `share-square.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          
          
        })
        .catch(err => {  
          choice = 3;
          
        })

        awaitingTextInput = false;
        document.getElementById("custom-input").textContent = "";
        customInput = "";
        showNextLine();
      }
      return;
    } else if (event.key === "Backspace") {
      customInput = customInput.slice(0, -1);
      document.getElementById("custom-input").textContent = customInput;
    } else if (event.key.length === 1) {
      customInput += event.key;
      document.getElementById("custom-input").textContent = customInput;
    }
    return;
  }

  if (isTyping && event.key === "Enter" && dialogueVerif && menuVerif) {
      console.log(dialogueVerif)
        skipTyping();
        return;
      }

  if (isChoosing && dialogueVerif && menuVerif) {
      if (event.key === "ArrowUp") {
          selectedChoiceIndex = (selectedChoiceIndex - 1 + currentChoices.length) % currentChoices.length;
          renderChoices();
      } else if (event.key === "ArrowDown") {
          selectedChoiceIndex = (selectedChoiceIndex + 1) % currentChoices.length;
          renderChoices();
      } else if (event.key === "Enter") {
          confirmChoice();
        }
        return;
      }

  if (!isTyping && event.key === "Enter" && menuVerif && dialogueVerif) {
      showNextLine();
    }  

    

  if (isTyping1 && event.key === "Enter" && chestVerif && menuVerif) {
        skipTyping1();
        return;
      }

  if (awaitingTextInput && chestVerif && currentLine1 == 0 &&  menuVerif) {

    if (event.key === "Enter") {
      if (files != ``) {  
        awaitingTextInput = false;
       
        axios.post(`http://localhost:3000/upload/${encodeURIComponent(currentUser)}/${encodeURIComponent(currentUserPass)}`, files , {headers: { 'Content-Type': 'multipart/form-data' }})
        .then(res => {
          console.log(res)
          if(res.data == `You have exceeded the limit. Await 5 minute`){
            choice1 = 1;
            showNextLine1();
          } else if(res.data == `Files undefinded`){
            choice1 = 2;
            showNextLine1();
          } else {
            choice1 = 3;
            code = res.data;
            showNextLine1();
          }
        })
        .catch(err => {
          console.log(err);
          console.log(`svin`)
          choice1 = 4;
        })
        files = ``;
      }      
    } 
    return;
  }

  if (!isTyping1 && event.key === "Enter" && menuVerif && chestVerif) {
      showNextLine1();
    }  

})


document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' ) keys.left = false;
  if (e.key === 'ArrowRight' ) keys.right = false;
   if (e.key === 'e' ) keys.e = false;

});

function update() {
  gameWidth = game.clientWidth;
  gameHeight = game.clientHeight;

  
  // console.log(posX)
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;

  // Горизонтальний рух
  if(moveVerif){
    if (keys.left) posX -= step;
    if (keys.right) posX += step;
  }
  if (posX < 0) posX = 0;
  if (posX + playerWidth > gameWidth) posX = gameWidth - playerWidth;

  // Гравітація
  velocityY += gravity;
  posY += velocityY;
  keys.onGround = false;

   document.querySelectorAll('.obstacle').forEach(ob => {
    const rect = ob.getBoundingClientRect();
    const gRect = game.getBoundingClientRect();
    const obX = rect.left - gRect.left;
    const obY = rect.top - gRect.top;
    const obW = ob.offsetWidth;
    const obH = ob.offsetHeight;

    const playerRight = posX + playerWidth;
    const playerBottom = posY + playerHeight;

    const collides = (
      playerRight > obX &&
      posX < obX + obW &&
      playerBottom > obY &&
      posY < obY + obH
    );

    if (collides) {
      const overlapBottom = playerBottom - obY;
      const overlapTop = obY + obH - posY;
      const overlapLeft = playerRight - obX;
      const overlapRight = obX + obW - posX;

      const minOverlap = Math.min(overlapBottom, overlapTop, overlapLeft, overlapRight);

      if (minOverlap === overlapBottom && velocityY >= 0) {
        // Колізія зверху (приземлення)
        posY = obY - playerHeight;
        velocityY = 0;
        keys.onGround = true;

        if (ob.id === 'platform1') {
          posX += platformSpeed;
        }

      } else if (minOverlap === overlapLeft) {
        // Колізія зліва
        posX = obX - playerWidth;

      } else if (minOverlap === overlapRight) {
        // Колізія справа
        posX = obX + obW;
      }
    }
  });

  // Підлога
  if (posY + playerHeight > gameHeight) {
    posY = gameHeight - playerHeight;
    velocityY = 0;
    keys.onGround = true;
    
  }

  // Рух платформи
  const platform = document.getElementById('platform1');
  if (platform) {
    platformX += platformSpeed;
    if (platformX < platformMin || platformX + platform.offsetWidth > platformMax) {
      platformSpeed *= -1;
    }
    platform.style.left = (platformX / gameWidth) * 100 + '%';
  }

  // Позиції
  player.style.left = (posX / gameWidth) * 100 + '%';
  player.style.top = (posY / gameHeight) * 100 + '%';

  // Перевірка фінішу
  const finish = document.getElementById('finish');
  if (finish) {
    const fRect = finish.getBoundingClientRect();
    const gRect = game.getBoundingClientRect();

    const fX = fRect.left - gRect.left;
    const fY = fRect.top - gRect.top;
    const fW = finish.offsetWidth;
    const fH = finish.offsetHeight;

    const pRight = posX + player.offsetWidth;
    const pBottom = posY + player.offsetHeight;

    if (
      pRight > fX &&
      posX < fX + fW &&
      pBottom > fY &&
      posY < fY + fH
    ) {
      currentLevel++;
      loadLevel(currentLevel);
      return;
    }
  }
  const npc = document.getElementById(`npc`);
  const npcIndicator = document.getElementById(`npcIndicator`);
  const npc1 = document.getElementById(`npc1`);
  const npcIndicator1 = document.getElementById(`npcIndicator1`);
  dropZone = document.getElementById('npc1');
  fileList = document.getElementById('file-list');
  
 
      

    
  if(npc && npcIndicator){
     if(dialogueVerif == true){
      npcIndicator.style.display = 'none';
     }else{
    const npcX = npc.offsetLeft;
    const npcY = npc.offsetTop;
    const distance = Math.abs(npcX - posX);
    if (distance < 200) {
      npcIndicator.style.display = 'block';
      // npcIndicator.style.left = (npcX / gameWidth) * 100 + '%';
      // npcIndicator.style.top = (npc.offsetTop - 20) + 'px';
      // console.log(keys.e)
      if (keys.e == true) {
        moveVerif = false;
        dialogueVerif = true;
         dialogContainer.style.opacity = `100%`
         choicesDiv.style.opacity = `100%`;
               document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/dialogueBard.png)`;

      }
    } else {
      npcIndicator.style.display = 'none';  
    }
  }
  }

  if(npc1 && npcIndicator1){
    const npcX = npc1.offsetLeft;
    const npcY = npc1.offsetTop;
    const distance = Math.abs(npcX - posX);
    if(chestVerif == true){
      npcIndicator1.style.display = 'none';

    }else {
      if (distance < 100) {
      npcIndicator1.style.display = 'block';
      // npcIndicator1.style.left = (npcX / gameWidth) * 100 + '%';
      // npcIndicator1.style.top = (npc.offsetTop - 20) + 'px';
      // console.log(keys.e)
      if (keys.e == true) {
        moveVerif = false;
        chestVerif = true;
         dialogContainer.style.opacity = `100%`
      document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/shovelDialog.png)`;
      document.getElementById(`npc1`).style.backgroundImage = `url(./sprites/chestOpen.png)`;
      pastPos = posX;
      pastFacing = facingLeft;
      player.style.backgroundImage = `url(./sprites/shovelKnightCalm.png)`;
          
      // player.style.left = ;
      }
    } else {
      npcIndicator1.style.display = 'none';
    }
    }
    
  }
  
    if(!chestVerif){
  if (keys.onGround == false) {
    player.style.backgroundImage = `url(./sprites/shovelKnightJump.png)`
  
  } else if (keys.left || keys.right) {
 
    frameDelay++;
    if (frameDelay > 30) {
      frameIndex = (frameIndex + 1) % totalFrames;
      frameDelay = 0;
    }

  // const offsetX = frameIndex * frameWidth;
  // player.style.backgroundPosition = `-${offsetX}px -${runRowY}px`;

 
    console.log(chestVerif)
  if(frameIndex == 1) {
      player.style.backgroundImage = `url(./sprites/shovelKnightRun.png)`;
    
    } else if(frameIndex == 2) {
      player.style.backgroundImage = `url(./sprites/shovelKnightRun1.png)`;
    
    } else if(frameIndex == 3) {
      player.style.backgroundImage = `url(./sprites/shovelKnightRun2.png)`;
    
    } else if(frameIndex == 4) {
      player.style.backgroundImage = `url(./sprites/shovelKnightRun3.png)`;
    
    }else if(frameIndex == 5) {
      player.style.backgroundImage = `url(./sprites/shovelKnightRun4.png)`;
    
    }else if(frameIndex == 6) {
      player.style.backgroundImage = `url(./sprites/shovelKnightRun5.png)`;
    }
 

  // Напрямок
  if (keys.left) {
    player.style.transform = 'scaleX(-1)';
    facingLeft = true;
  } else if (keys.right) {
    player.style.transform = 'scaleX(1)';
    facingLeft = false;
  }
} else {
  // Статичний кадр (idle)
  frameIndex = 0;
  frameDelay = 0;
  player.style.backgroundImage = `url(./sprites/shovelKnightCalm.png)`;
  // player.style.backgroundPosition = `0px -${runRowY}px`;
}
}

  updateCamera();
  requestAnimationFrame(update);
}

window.addEventListener('DOMContentLoaded', () => {
  
 
    
});

const registerBtn = document.getElementById(`registerBtn`);
const loginBtn = document.getElementById(`loginBtn`);
const logoutBtn = document.getElementById(`logoutBtn`); 
const registerContainer = document.getElementById(`registerContainer`);
const regInpNick = document.getElementById(`regInpNick`);
const regInpPass = document.getElementById(`regInpPass`);
const logInpNick = document.getElementById(`logInpNick`);
const logInpPass = document.getElementById(`logInpPass`);
const loginContainer = document.getElementById(`loginContainer`);
const registerFetch = document.getElementById(`register`); 
const loginFetch = document.getElementById(`login`); 
const logClose = document.getElementById(`logClose`);
const regClose = document.getElementById(`regClose`);

function closeAllForms() {
  if(currentUser == false && currentUserPass == false){
  registerBtn.style.display = `block`;
  historyBtn.style.display = `none`;
  loginBtn.style.display = `block`;
  registerContainer.style.display = `none`;
  logoutBtn.style.display = `none`;
  logInpNick.value = ``;
  logInpPass.value = ``;
  loginContainer.style.display = `none`;
  logInpNick.style.border = `none`;
  logInpNick.style.color = `black`;
  logInpPass.style.border = `none`;
  logInpPass.style.color = `black`;
  logInpNick.classList.remove('placeholder-red');
  logInpPass.classList.remove('placeholder-red');
  logInpNick.classList.add('placeholder-gray');
  logInpPass.classList.add('placeholder-gray');
  logoutBtn.style.display = `none`;
  regInpNick.value = ``;
  regInpPass.value = ``;
  loginContainer.style.display = `none`;
  regInpNick.style.border = `none`;
  regInpNick.style.color = `black`;
  regInpPass.style.border = `none`;
  regInpPass.style.color = `black`;
  regInpNick.classList.remove('placeholder-red');
  regInpPass.classList.remove('placeholder-red');
  regInpNick.classList.add('placeholder-gray');
  regInpPass.classList.add('placeholder-gray');
  regInpPass.placeholder = `Пароль`;
  regInpNick.placeholder = `Нікнейм`;
  logInpPass.placeholder = `Пароль`;
  logInpNick.placeholder = `Нікнейм`;
  historyContainer.style.display = `none`;
  } else {

    registerBtn.style.display = `none`;
  loginBtn.style.display = `none`;
  registerContainer.style.display = `none`;
  logoutBtn.style.display = `block`;
  historyBtn.style.display = `block`;
  logInpNick.value = ``;
  logInpPass.value = ``;
  loginContainer.style.display = `none`;
  logInpNick.style.border = `none`;
  logInpNick.style.color = `black`;
  logInpPass.style.border = `none`;
  logInpPass.style.color = `black`;
  logInpNick.classList.remove('placeholder-red');
  logInpPass.classList.remove('placeholder-red');
  logInpNick.classList.add('placeholder-gray');
  logInpPass.classList.add('placeholder-gray');
  registerContainer.style.display = `none`;
  regInpNick.value = ``;
  regInpPass.value = ``;
  loginContainer.style.display = `none`;
  regInpNick.style.border = `none`;
  regInpNick.style.color = `black`;
  regInpPass.style.border = `none`;
  regInpPass.style.color = `black`;
  regInpNick.classList.remove('placeholder-red');
  regInpPass.classList.remove('placeholder-red');
  regInpNick.classList.add('placeholder-gray');
  regInpPass.classList.add('placeholder-gray');
  regInpPass.placeholder = `Пароль`;
  regInpNick.placeholder = `Нікнейм`;
  logInpPass.placeholder = `Пароль`;
  logInpNick.placeholder = `Нікнейм`;
  historyContainer.style.display = `none`;
  }
}

registerBtn.addEventListener(`click`,() => {
  registerBtn.style.display = `none`;
  historyBtn.style.display = `none`;
  loginBtn.style.display = `none`;
  registerContainer.style.display = `flex`;
  logoutBtn.style.display = `none`;
  regInpNick.value = ``;
  regInpPass.value = ``;
  loginContainer.style.display = `none`;
  regInpNick.style.border = `none`;
  regInpNick.style.color = `black`;
  regInpPass.style.border = `none`;
  regInpPass.style.color = `black`;
  regInpNick.classList.remove('placeholder-red');
  regInpPass.classList.remove('placeholder-red');
  regInpNick.classList.add('placeholder-gray');
  regInpPass.classList.add('placeholder-gray');
  regInpPass.placeholder = `Пароль`;
  regInpNick.placeholder = `Нікнейм`;
  logInpPass.placeholder = `Пароль`;
  logInpNick.placeholder = `Нікнейм`;
  historyContainer.style.display = `none`;
  
}); 

regClose.addEventListener(`click`, () => {
  closeAllForms();
});

loginBtn.addEventListener(`click`,() => {
  registerBtn.style.display = `none`;
  historyBtn.style.display = `none`;
  loginBtn.style.display = `none`;
  registerContainer.style.display = `none`;
  logoutBtn.style.display = `none`;
  logInpNick.value = ``;
  logInpPass.value = ``;
  loginContainer.style.display = `flex`;
  logInpNick.style.border = `none`;
  logInpNick.style.color = `black`;
  logInpPass.style.border = `none`;
  logInpPass.style.color = `black`;
  logInpNick.classList.remove('placeholder-red');
  logInpPass.classList.remove('placeholder-red');
  logInpNick.classList.add('placeholder-gray');
  logInpPass.classList.add('placeholder-gray');
  regInpPass.placeholder = `Пароль`;
  regInpNick.placeholder = `Нікнейм`;
  logInpPass.placeholder = `Пароль`;
  logInpNick.placeholder = `Нікнейм`;
  historyContainer.style.display = `none`;
}); 

logClose.addEventListener(`click`, () => {
  closeAllForms();
});

historyBtn.addEventListener(`click`, () => {
  registerBtn.style.display = `none`;
  historyBtn.style.display = `none`;
  loginBtn.style.display = `none`;
  registerContainer.style.display = `none`;
  logoutBtn.style.display = `none`;
  regInpNick.value = ``;
  regInpPass.value = ``;
  loginContainer.style.display = `none`;
  regInpNick.style.border = `none`;
  regInpNick.style.color = `black`;
  regInpPass.style.border = `none`;
  regInpPass.style.color = `black`;
  regInpNick.classList.remove('placeholder-red');
  regInpPass.classList.remove('placeholder-red');
  regInpNick.classList.add('placeholder-gray');
  regInpPass.classList.add('placeholder-gray');
  regInpPass.placeholder = `Пароль`;
  regInpNick.placeholder = `Нікнейм`;
  logInpPass.placeholder = `Пароль`;
  logInpNick.placeholder = `Нікнейм`;
  historyContainer.style.display = `flex`;
  currentUserHistory.forEach((e) => {
    $(`#historyContainer`).append(
    `<div class="item">
      <p>${e.code}</p>
      <button id="del${e.code}" class="delete"></button>
      <button id="upl${e.code}" class="upload"></button>
    </div>`
  )
  })
  
});

document.getElementById(`crossMark`).addEventListener(`click`, () => {
  $(`.menu`).hide();
  menuVerif = true;
  moveVerif = true;
  game.style.filter = `brightness(100%)`;
  closeAllForms();

})

registerFetch.addEventListener(`click`, () => {
  const login = regInpNick.value;
  const password = regInpPass.value;
  if(login != `` && password != ``){
    if(login.length<20){
      
      if(password.length>7){
        if(!/\s/.test(password)){
          if(/[^a-zA-Z0-9]/.test(password)){
            axios.post(`http://localhost:3000/registration`, {
              password:password,
              login: login
            })
            .then(res => {
              if(res.data == `Login is occupied`){
                regInpPass.value = ``;
            regInpNick.value = ``;
            regInpNick.classList.remove('placeholder-gray');
            regInpPass.classList.remove('placeholder-gray');
            regInpNick.classList.add('placeholder-red');
            regInpPass.classList.add('placeholder-red');
            regInpPass.placeholder = `Цей нікнейм зайнято`;
            regInpNick.style.border = `2px solid red`;
            regInpNick.style.color = `red`;
            regInpPass.style.border = `2px solid red`;
            regInpPass.style.color = `red`;       
              }else {
                localStorage.setItem(`currentUser`, login);
                localStorage.setItem(`currentUserPass`, password);
                currentUserPass = password;
                currentUser = login;
                closeAllForms();
              }
            })
          } else {
            regInpPass.value = ``;
            regInpNick.value = ``;
            regInpNick.classList.remove('placeholder-gray');
            regInpPass.classList.remove('placeholder-gray');
            regInpNick.classList.add('placeholder-red');
            regInpPass.classList.add('placeholder-red');
            regInpPass.placeholder = `Пароль повинен містити хоча би одни спеціальний символ`;
            regInpNick.style.border = `2px solid red`;
            regInpNick.style.color = `red`;
            regInpPass.style.border = `2px solid red`;
            regInpPass.style.color = `red`;   
          }
        } else {
          regInpPass.value = ``;
            regInpNick.value = ``;
            regInpNick.classList.remove('placeholder-gray');
            regInpPass.classList.remove('placeholder-gray');
            regInpNick.classList.add('placeholder-red');
            regInpPass.classList.add('placeholder-red');
            regInpPass.placeholder = `Пароль не повинен містити пробілів`;
          regInpNick.style.border = `2px solid red`;
          regInpNick.style.color = `red`;
          regInpPass.style.border = `2px solid red`;
          regInpPass.style.color = `red`;
        }
      } else {
        regInpPass.value = ``;
        regInpNick.value = ``;
        regInpNick.classList.remove('placeholder-gray');
            regInpPass.classList.remove('placeholder-gray');
        regInpNick.classList.add('placeholder-red');
            regInpPass.classList.add('placeholder-red');
        regInpPass.placeholder = `Пароль повинен містити більше семи символів`; 
        regInpNick.style.border = `2px solid red`;
        regInpNick.style.color = `red`;
        regInpPass.style.border = `2px solid red`;
        regInpPass.style.color = `red`;
      }

    } else {
       regInpPass.value = ``;
        regInpNick.value = ``;
        regInpNick.classList.remove('placeholder-gray');
            regInpPass.classList.remove('placeholder-gray');
        regInpNick.classList.add('placeholder-red');
            regInpPass.classList.add('placeholder-red');
        regInpNick.placeholder = `Нік повинен містити менше двадцяти символів`; 
      regInpNick.style.border = `2px solid red`;
      regInpNick.style.color = `red`;
      regInpPass.style.border = `2px solid red`;
      regInpPass.style.color = `red`;
      regInpNick.value = ``;  
    }
  
  } else {
     regInpPass.value = ``;
        regInpNick.value = ``;
        regInpNick.classList.remove('placeholder-gray');
            regInpPass.classList.remove('placeholder-gray');
        regInpNick.classList.add('placeholder-red');
            regInpPass.classList.add('placeholder-red');
        regInpNick.placeholder = `Поля повинні бути заповнені`; 
    regInpNick.style.border = `2px solid red`;
    regInpNick.style.color = `red`;
    regInpPass.style.border = `2px solid red`;
    regInpPass.style.color = `red`;
  }
});

logoutBtn.addEventListener(`click`, () => {
  localStorage.removeItem(`currentUser`);
  localStorage.removeItem(`currentUserPass`);
  currentUserPass = false;
  currentUser = false;
  closeAllForms();
});


loginFetch.addEventListener(`click`, () => {
  
  axios.post(`http://localhost:3000/signIn`,{
  login:logInpNick.value,
  password:logInpPass.value
})
.then(res => {
  if(res.data != `Incorrect login` && res.data != `Incorrect password`){
    localStorage.setItem(`currentUser`, logInpNick.value);
    localStorage.setItem(`currentUserPass`,logInpPass.value);
    currentUserPass = logInpPass.value;
    currentUser = logInpNick.value;
    currentUserHistory = res.data.history;
    closeAllForms();
  } else {
     logInpPass.value = ``;
        logInpNick.value = ``;
        logInpNick.classList.remove('placeholder-gray');
            logInpPass.classList.remove('placeholder-gray');
        logInpNick.classList.add('placeholder-red');
            logInpPass.classList.add('placeholder-red');
        logInpNick.placeholder = `Неправильний нік або пароль`; 
      logInpNick.style.border = `2px solid red`;
      logInpNick.style.color = `red`;
      logInpPass.style.border = `2px solid red`;
      logInpPass.style.color = `red`;
      logInpNick.value = ``;  

  }
});
});

let dialogLines4 = [
  {text:`Потрібно додати файли в скриньку`},
  {text: `Код: ...`},
  {text:` `},
  {text: `Відмінно! Файли в надійних руках `}
];
let dialogLines6 = [
  {text:`Потрібно додати файли в скриньку`},
  {text: `Код: ...`},
  {text:` Скринька сердиться якщо її турбувати частіше ніж раз в п'ять хвилин`},
  {text:  `Попробую пізніше`}
];
let dialogLines7 = [
  {text:`Потрібно додати файли в скриньку`},
  {text: `Код: ...`},
  {text:` `},
  {text:`Відмінно! Файли в надійних руках`}
];
let dialogLines8 = [
  {text:`Потрібно додати файли в скриньку`},
  {text: `Код: ...`},
  {text:` Ой, з файлами щось не те`},
  {text:`Попробую якось ще`}
];
let dialogLines9 = [
  {text:`Потрібно додати файли в скриньку`},
  {text: `Код: ...`},
  {text:`Ой, з файлами щось не те`},
  {text:`Попробую якось ще`}
];



    let currentLine1 = -1;
    let isTyping1 = false;
    let typingInterval1;
    let charIndex1 = 0;
    let fullText1 = "";
    let choice1 = 0;

    function typeLine1(text) {
      fullText1 = text;
      charIndex1 = 0;
      dialogBox.textContent = "";
      isTyping1 = true;

      typingInterval = setInterval(() => {
        dialogBox.textContent += fullText1[charIndex1];
        playTypeSound();
        charIndex1++;
        if (charIndex1 >= fullText1.length) {
          clearInterval(typingInterval);
          isTyping1 = false;
        }
      }, 40);
    }

    function skipTyping1() {
      clearInterval(typingInterval);
      dialogBox.textContent = fullText1;
      isTyping1 = false;
    }

    function showNextLine1() {
      document.getElementById(`dialogImage`).style.backgroundImage = `url(./sprites/shovelDialog.png)`;
      currentLine1++;
      console.log(choice)
      if(choice1 == 0){
        if(currentLine1 < 0) {
          player.style.backgroundImage = `url(./sprites/shovelKnightCalm.png)`;
        };
        if(currentLine1 > 0) {
          player.style.backgroundImage = `url(./sprites/shovelBow.png)`;
          posX = 2104.6999999999985;
          player.style.transform = 'scaleX(1)';
        };
        if(currentLine1 == 0){ 
        
        const waitUntilTyped = setInterval(() => {
          if (!isTyping1) {
            awaitingTextInput = true;
            document.getElementById(`custom-input`).style.display = "block";
            clearInterval(waitUntilTyped);
          }
        }, 100);
      }
      if (currentLine1 >= dialogLines4.length) {
        document.getElementById(`npc1`).style.backgroundImage = `url(./sprites/chestLocked.png)`;

        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine1 = -1;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        files = ``;
        choice1 = 0;
        $(`#fileList`).empty();

        customInput = ``
        setTimeout(() => {
          congratSound.play();
          posX = pastPos;
          player.style.backgroundImage = `url(./sprites/shovelCongrat.png)`;
          // player.style.height = `170px`;
          // player.style.width = `100px`;
          // player.style.backgroundPosition = `bottom`;
          if(pastFacing){
          player.style.transform = 'scaleX(-1)';
          }else{
          player.style.transform = 'scaleX(1)';
          }
          setTimeout(() => {
            player.style.backgroundImage = `url(./sprites/shovelKnightJump.png)`;
            
            setTimeout(() => {
              player.style.height = `100px`;
              player.style.width = `112px`;
          player.style.backgroundPosition = `center`;
              moveVerif = true;
            chestVerif = false;
            },200)
          },200)
        },200) 
        return;
        
      }
    
      const line = dialogLines4[currentLine1];
      
      typeLine1(line.text);
      } else if(choice1 == 1){
        
        if(currentLine1 > 0) {
          
          player.style.backgroundImage = `url(./sprites/shovelBow.png)`;
          posX = 2104.6999999999985;
          player.style.transform = 'scaleX(1)';
        };
        if (currentLine1 >= dialogLines6.length) {
        failSound.play();
        document.getElementById(`npc1`).style.backgroundImage = `url(./sprites/chestLocked.png)`;
        moveVerif = true;
        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine1 = -1;
        chestVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``
        files = ``;
        choice1 = 0;
                $(`#fileList`).empty();

        return;
        
        
      }
    
      const line = dialogLines6[currentLine1];
      console.log(line)
      
      typeLine1(line.text);
      } else if(choice1 == 2){
         if(currentLine1 <= 0) {
          player.style.backgroundImage = `url(./sprites/shovelKnightCalm.png)`;
        };
        if(currentLine1 > 0) {
        failSound.play();

          player.style.backgroundImage = `url(./sprites/shovelBow.png)`;
          posX = 2104.6999999999985;
          player.style.transform = 'scaleX(1)';
        };
        if (currentLine1 >= dialogLines8.length) {
        document.getElementById(`npc1`).style.backgroundImage = `url(./sprites/chestLocked.png)`;

        moveVerif = true;
        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine1 = -1;
        chestVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``
        files = ``;
        choice1 = 0;
                $(`#fileList`).empty();

        return;
      }
    
      const line = dialogLines8[currentLine1];
      
      typeLine1(line.text);
      } else if(choice1 == 3){
         if(currentLine1 <= 0) {
          player.style.backgroundImage = `url(./sprites/shovelKnightCalm.png)`;
        };
         if(currentLine1 > 0) {
          player.style.backgroundImage = `url(./sprites/shovelBow.png)`;
          posX = 2104.6999999999985;
          player.style.transform = 'scaleX(1)';
        };
        if (currentLine1 > dialogLines7.length) {
        document.getElementById(`npc1`).style.backgroundImage = `url(./sprites/chestLocked.png)`;

dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine1 = -1;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        files = ``;
        choice1 = 0;
        $(`#fileList`).empty();

        customInput = ``
        setTimeout(() => {
          congratSound.play();
          posX = pastPos;
          player.style.backgroundImage = `url(./sprites/shovelCongrat.png)`;
          // player.style.height = `170px`;
          // player.style.width = `100px`;
          // player.style.backgroundPosition = `bottom`;
          if(pastFacing){
          player.style.transform = 'scaleX(-1)';
          }else{
          player.style.transform = 'scaleX(1)';
          }
          setTimeout(() => {
            player.style.backgroundImage = `url(./sprites/shovelKnightJump.png)`;
            
            setTimeout(() => {
              player.style.height = `100px`;
              player.style.width = `112px`;
          player.style.backgroundPosition = `center`;
              moveVerif = true;
            chestVerif = false;
            },200)
          },200)
        },200) 
        return;

      }
      
      if(currentLine1 == 2 ){
        typeLine1(`${code}`); 
        return; 
      } else {
        const line = dialogLines7[currentLine1];
        typeLine1(line.text);
      }
      
      
      }else if(choice1 ==4){
         if(currentLine1 <= 0) {
          player.style.backgroundImage = `url(./sprites/shovelKnightCalm.png)`;
        };
         if(currentLine1 > 0) {
          player.style.backgroundImage = `url(./sprites/shovelBow.png)`;
          posX = 2104.6999999999985;
          player.style.transform = 'scaleX(1)';
        };
       if (currentLine1 >= dialogLines9.length) {
        document.getElementById(`npc1`).style.backgroundImage = `url(./sprites/chestLocked.png)`;

        failSound.play();
        moveVerif = true;
        dialogBox.textContent = "";
        dialogContainer.style.opacity = `0%`
        choicesDiv.style.opacity = `0%`
        currentLine1 = -1;
        chestVerif = false;
        awaitingTextInput = false;
        document.getElementById(`custom-input`).textContent = "";
        customInput = ``;
        files = ``;
        choice1 = 0;
                $(`#fileList`).empty();

        return;
      }
    
      const line = dialogLines9[currentLine1];
      
      typeLine1(line.text);
    } 
      };

      window.addEventListener('load', () => {
  const startScreen = document.getElementById('startScreen');
  const pressEnter = document.getElementById('pressEnter');
  // const gameLogo = document.getElementById('gameLogo');

  function handleStart(e) {
    if (e.key === 'Enter') {
      
      document.removeEventListener('keydown', handleStart);

      // Показуємо лого
      pressEnter.style.display = 'none';
      // gameLogo.style.display = 'block';

      // Зачекай трохи, потім розсуваємо штори
      setTimeout(() => {
        startScreen.classList.add('open');

        // Після анімації повністю приховуємо заставку
        setTimeout(() => {
          startScreen.style.display = 'none';
          loadLevel(currentLevel);
           update();

    globMusic.play();
  
          loadVerif = true;

           dialogBox = document.getElementById("dialog-box");
    choicesDiv = document.getElementById("choices");
    typeSound = document.getElementById("type-sound");
    dialogContainer = document.getElementById(`dialogContainer`);
  const dropZone = document.getElementById(`npc1`);
  fileList = document.getElementById(`fileList`);
  
    dropZone.addEventListener('dragover', (e) => {
      if(chestVerif && currentLine1 <= 0){
        e.preventDefault();
        dropZone.classList.add('dragover');
      }
        
    });

    dropZone.addEventListener('dragleave', () => {
      if(chestVerif && currentLine1 <= 0){
      dropZone.classList.remove('dragover');
      }
    });

    dropZone.addEventListener('drop', (e) => {
      if(chestVerif && currentLine1 <= 0){
      e.preventDefault();
      dropZone.classList.remove('dragover');
      fileList = document.getElementById(`fileList`);
      fileList.innerHTML = '';
      files = e.dataTransfer.files;
     
      for (let i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${files[i].name} (${Math.round(files[i].size / 1024)} KB)`;
        fileList.appendChild(li);
      }
       const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
          console.log(files[i])
          formData.append('files', files[i]); 
      };
      files = formData;
    }
    });
   
    player.addEventListener('dragover', (e) => {
      if(chestVerif && currentLine1 <= 0){
        e.preventDefault();
        dropZone.classList.add('dragover');
      }
        
    });

    player.addEventListener('dragleave', () => {
      if(chestVerif && currentLine1 <= 0){
      dropZone.classList.remove('dragover');
      }
    });

    player.addEventListener('drop', (e) => {
      if(chestVerif && currentLine1 <= 0){
      e.preventDefault();
      dropZone.classList.remove('dragover');
      fileList = document.getElementById(`fileList`);
      fileList.innerHTML = '';
      files = e.dataTransfer.files;
     
      for (let i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${files[i].name} (${Math.round(files[i].size / 1024)} KB)`;
        fileList.appendChild(li);
      }
       const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
          console.log(files[i])
          formData.append('files', files[i]); 
      };
      files = formData;
    }
    });
   
  
 
        }, 1200); // відповідає transition в CSS
      }, 1000);
    }
  }

  document.addEventListener('keydown', handleStart);
});

document.onclick = function(e) {
  console.log(e.target.id.substring(0, 3))
  if(e.target.id.substring(0, 3) == `del`){
    console.log(e.target.id.substring(3))
    axios.delete(`/deleteUrl/${e.target.id.substring(3)}/${encodeURIComponent(currentUser)}/${encodeURIComponent(currentUserPass)}`)
    .then(res => {
      console.log(res)
    })
  }

   if(e.target.id.substring(0, 3) == `upl`){
    console.log(e.target.id.substring(3))
    axios.get(`http://localhost:3000/download/${customInput.trim()}`,  {responseType: 'blob'})
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `share-square.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          
          
        })
        .catch(err => {  
          
          
        })

  }
  }
