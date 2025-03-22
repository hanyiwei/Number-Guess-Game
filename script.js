//获取元素
const startBtn = document.getElementById('startBtn');
const input = document.getElementById('input');
const inputContainer = document.querySelector('.input-container');
const startGame = document.querySelector('.startGame');
const numCard = document.querySelector('.numCard');
const text = document.querySelector('.text');
const garden = document.querySelector('.garden');
const confirmBtn = document.getElementById('confirmBtn');
const history = document.querySelector('.history');
const hint = document.querySelector('.hint');
const back = document.querySelector('.back');
const color = [
      'hue-rotate(0deg)',
      'hue-rotate(280deg)',
      'hue-rotate(50deg)',
      'hue-rotate(240deg)',
];
const flowerNum = 500;
//花背景
const flowers = Array.from({ length: flowerNum }, createFlower);
flowers.forEach(flower => garden.appendChild(flower));

function createFlower() {
      const flower = document.createElement('div');
      flower.classList.add('flower');
      flower.innerHTML = '🌸';

      //移入变色
      flower.addEventListener('mouseenter', () => {
            // flower.style.filter = 'grayscale(0)' 放弃了 原打算恢复色相
            flower.style.transform = 'scale(1.1)';
            flower.style.opacity = 0.4;
            flower.style.rotate = '-10deg';
            //filter=color数组里随机
            flower.style.filter = color[Math.floor(Math.random() * color.length)];

            flower.addEventListener('mouseleave', () => {
                  setTimeout(() => {
                        flower.style.transform = 'scale(1)';
                        flower.style.opacity = 0.15;
                  }, 2000);
            });
      })
      return flower;
}

function flipCard() {
      numCard.classList.toggle('flipped');
}


numCard.addEventListener('mouseenter', () => {
      if (numCard.classList.contains('flipped')) return;

      hint.classList.remove('hidden');
      // 强制浏览器重绘
      void hint.offsetHeight;
      if (startGame.classList.contains('active') && !history.classList.contains('hidden')) {
            hint.style.marginTop = '-82%';
      } else if (history.classList.contains('hidden') && !startGame.classList.contains('active')) {
            hint.style.marginTop = '-82%';
      } else {
            hint.style.marginTop = '-72%';
      }
})

numCard.addEventListener('mouseleave', () => {

      if (startGame.classList.contains('active')) {
            hint.style.marginTop = '-68%';
      } else {
            hint.style.marginTop = '-78%';
      }

      setTimeout(() => hint.classList.add('hidden'), 300);
})


let timer = 50;
let intervalId;
// 旋转角度
let rotates = () => -360 / 50 * timer;


startBtn.addEventListener('click', () => {
      clearInterval(intervalId);
      timer = 50;
      startGame.classList.add('active');
      hint.textContent = '🤡 Sneak a look?';
      hint.style.marginTop = '-68%';
      input.placeholder = `${lastTimes} chances left`;
      if (numCard.classList.contains('flipped')) {
            numCard.classList.remove('flipped');
            // 卡片背面是答案
            numCard.addEventListener('transitionend', () => {
                  backNum();
            }, { once: true })
      } else {
            backNum();
      }

      history.classList.remove('hidden');
      history.style.visibility = 'hidden';

      //去掉text > p标签 h1改为倒计时
      text.children[1].classList.add('hidden');
      document.querySelector('h1').textContent = `0:` + `${timer}`;
      document.querySelector('.timeIcon').classList.remove('hidden');
      // 旋转
      document.querySelector('.timeIcon').style.rotate = `${rotates()}deg`;

      // setInterval按指定时间重复一次(每秒timer--) 最后10s时间变红
      intervalId = setInterval(() => {
            timer--;
            // 0:XX、0:0X
            (timer > 9) ? document.querySelector('h1').textContent = `0:` + `${timer}`
                  : document.querySelector('h1').textContent = `0:0` + `${timer}`;
            // 更新旋转
            document.querySelector('.timeIcon').style.rotate = `${rotates()}deg`;

            if (timer <= 0) {
                  clearInterval(intervalId);
                  gameOver();
                  return;
            } else if (timer <= 10) {
                  document.querySelector('h1').style.color = 'red';
                  document.querySelector('.timeIcon').classList.add('timeRed');
                  document.querySelector('.timeRed').style.rotate = `${rotates()}deg`;
            }
      }, 1000);

      // 监听过渡结束，再focus()
      startGame.addEventListener('transitionend', () => {
            input.focus();
      }, { once: true });
})


let random;
// 生成随机数
const randomNum = () => {
      random = Math.floor(Math.random() * 100) + 1;
}
randomNum();
// 答案
const backNum = () => {
      back.querySelector('span').textContent = `${random}`;
      back.querySelector('span').style.color = 'var(--color-panel-x)';
      back.querySelector('span').style.opacity = '1';
      back.querySelector('span').style.filter = 'hue-rotate(0deg)';
}


let lastTimes = 10;
let inputValues = [];

function checkNumber() {
      const inputValue = parseInt(input.value);

      //超出范围没 是不是空
      if (isNaN(inputValue) || inputValue < 1 || inputValue > 100 || inputValue === '') {
            wrong();
            clearInput();
            return;
      }
      //是不是重复了
      if (inputValues.includes(inputValue)) {
            duplicated();
            clearInput();
            return;
      }

      //比大小
      if (inputValue === random) {
            winner();
      } else if (inputValue > random) {
            big();
      } else if (lastTimes === 1) {
            gameOver();
      } else {
            small();
      }

      //history
      if (inputValue !== random) {
            lastTimes--;
            inputValues.push(inputValue);
            //history展示inputValues
            history.style.visibility = 'visible';
            history.innerHTML = `Recent: ` + `${inputValues.join(' ')}`;
      }
}


function wrong() {
      input.value = '';
      input.placeholder = 'Between 1 and 100';
      input.classList.add('highlight');
      // 添加自动移除延时
      setTimeout(() => {
            input.classList.remove('highlight');
            input.placeholder = `${lastTimes} chances left`;
      }, 1500);
      input.focus();
}


const duplicated = () => {
      input.value = '';
      input.placeholder = 'Duplicated entry';
      input.classList.add('highlight');
      // 添加自动移除延时
      setTimeout(() => {
            input.classList.remove('highlight');
            input.placeholder = `${lastTimes} chances left`;
      }, 1500);
      input.focus();
}


function winner() {
      clearInterval(intervalId);
      document.querySelector('.timeIcon').classList.add('hidden');
      document.getElementById('confirmBtn').classList.add('hidden');
      document.querySelector('h1').textContent = '✨You Win!✨';
      document.querySelector('h1').style.color = 'var(--color-panel-x)';
      numCard.classList.add('flipped');
      input.classList.add('hidden');
      document.getElementById('restartBtn').classList.remove('hidden');
      // history.classList.add('hidden');
      history.remove();
      hint.remove();
      update();
}


function restart() {
      location.reload();
}


function gameOver() {
      clearInterval(intervalId);
      document.querySelector('.timeIcon').classList.add('hidden');
      document.getElementById('confirmBtn').classList.add('hidden');
      document.querySelector('h1').textContent = 'Game Over!';
      document.querySelector('h1').style.color = 'var(--color-panel-x)';
      numCard.classList.add('flipped');
      input.classList.add('hidden');
      document.getElementById('restartBtn').classList.remove('hidden');
      history.remove();
      document.querySelector('.text > p').classList.remove('hidden');
      text.children[1].style.marginBottom = '0';
      hint.remove();

      (lastTimes === 1) ? text.children[1].textContent = 'Out of Chances!'
            : text.children[1].textContent = "Time's up";
}


function big() {
      input.value = '';
      input.placeholder = 'Too high';
      input.classList.add('tooHigh');
      // 添加自动移除延时
      setTimeout(() => {
            input.classList.remove('tooHigh');
            input.placeholder = `${lastTimes} chances left`;
      }, 1500);
      input.focus();
}


function small() {
      input.value = '';
      input.placeholder = 'Too low';
      input.classList.add('highlight');
      // 添加自动移除延时
      setTimeout(() => {
            input.classList.remove('highlight');
            input.placeholder = `${lastTimes} chances left`;
      }, 1500);
      input.focus();
}

const clearInput = () => {
      input.value = '';
      input.focus();
}


//回车也行
input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
            checkNumber();
      }
});


//完结撒花
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d', { alpha: true });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const colors = [
      "#FF6B6B", "#FFE66D",  // 红/黄
      "#4ECDC4", "#45B7D1",  // 青/蓝
      "#96CEB4", "#FFEEAD",  // 绿/米黄
      "#FF9999", "#FFD099"   // 粉红/橙
];

const papers = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      speed: 4 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: Math.random() * 2,
      width: 8 + Math.random() * 8,
      height: 6 + Math.random() * 6,
      angle: Math.random() * 360,
      rotateSpeed: (Math.random() - 0.5) * 3,
}));

function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      papers.forEach(p => {
            //垂直下落
            p.y += p.speed;
            p.x += Math.sin(Date.now() / 1000) * p.sway;
            p.angle += p.rotateSpeed;

            if (p.y > canvas.height) {
                  p.y = -20;
                  p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);

            ctx.fillStyle = p.color;
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);

            ctx.restore();
      });

      requestAnimationFrame(update);
}
