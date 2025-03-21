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
const flowers = Array.from({ length: flowerNum }, () => {
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
}).forEach(flower =>
      garden.appendChild(flower)
);

function flipCard() {
      numCard.classList.toggle('flipped');
}


numCard.addEventListener('mouseenter', () => {
      if (numCard.classList.contains('flipped')) return;

      hint.classList.remove('hidden');
      // 强制浏览器重绘
      void hint.offsetHeight;
      if (startGame.classList.contains('active')) {
            hint.style.marginTop = '-72%';
      } else {
            hint.style.marginTop = '-82%';
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
      startGame.classList.add('active');
      hint.textContent = '🤡 Sneak a look?';
      hint.style.marginTop = '-68%';
      input.placeholder = `${lastTimes} chances left`;
      if (numCard.classList.contains('flipped')) {
            numCard.classList.remove('flipped');

            // 卡片背面变成生成答案
            numCard.addEventListener('transitionend', () => {
                  backNum();
            }, { once: true })
      } else {
            backNum();
      }


      //去掉text > p标签 h1改为倒计时
      // text.removeChild(text.children[1]);
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
      } else if (lastTimes <= 0) {
            gameOver();
      } else {
            small();
      }

      //history
      if (inputValue !== random) {
            inputValues.push(inputValue);
            lastTimes--;
            //history展示inputValues
            history.classList.remove('hidden');
            history.innerHTML = `Recent: ` + `${inputValues.join(' ')}`;
      }
}


function wrong() {
      input.value = '';
      input.placeholder = 'Enter an integer between 1 and 100';
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
      input.placeholder = 'You have already entered this';
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
      history.classList.add('hidden');
      hint.remove();
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
      history.classList.add('hidden');
      text.children[1].classList.remove('hidden');
      hint.remove();

      (lastTimes <= 0) ? text.children[1].textContent = 'Out of Chances!'
            : text.children[1].textContent = "Time's up!";
}


function big() {
      input.value = '';
      input.placeholder = 'Too high!';
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
      input.placeholder = 'Too low!';
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






