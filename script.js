let synth = new Tone.Synth({
  oscillator: {
    type: 'square' // クリック音に適した波形
  },
  envelope: {
    attack: 0.005, // 音の開始が速い
    decay: 0.1,    // 音がすぐに減衰する
    sustain: 0,    // サステイン（持続時間）はなし
    release: 0.1   // 音がすぐに消える
  }
}).toDestination();


const sampler = new Tone.Sampler({
  "A5": "./metronome-click_01.wav" // C4の音階でこのサンプルを再生
}).toDestination();


let loop;

function startMetronome() {
  loop = new Tone.Loop(time => {
    sampler.triggerAttackRelease("A5", "8n", time);
    blink();
  }, "4n");

  Tone.Transport.start();
  loop.start(0);
}

function stopMetronome() {
  loop.stop();
  Tone.Transport.stop();
}

let isPlaying = false;
let metronome;


document.getElementById('start-stop').addEventListener('click', async function () {
  // Tone.jsがまだ起動していない場合にのみTone.start()を呼び出す
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }

  if (!isPlaying) {
    setAndchangeTempo(slider.value);
    startMetronome();
    this.textContent = 'STOP';
  } else {
    stopMetronome();
    this.textContent = 'START';
  }
  isPlaying = !isPlaying;
});

function blink(time) {
  const blinkElement = document.getElementById('blink');
  blinkElement.style.opacity = 1;
  setTimeout(() => blinkElement.style.opacity = 0.3, 50);
}

const slider = document.getElementById('tempo-slider');

slider.addEventListener('input', function () {
  document.getElementById('tempo-text').textContent = this.value + ' BPM';
  if (isPlaying) {
    setAndchangeTempo(this.value);
  }
});

slider.addEventListener('change', function () {
  if (isPlaying) {
    setAndchangeTempo(this.value);
  }
});

document.getElementById('tempo-up').addEventListener('click', function () {
  // Tone.jsがまだ起動していない場合にのみTone.start()を呼び出す
  slider.value++;
  setAndchangeTempo(slider.value);
});

document.getElementById('tempo-down').addEventListener('click', function () {
  // Tone.jsがまだ起動していない場合にのみTone.start()を呼び出す
  slider.value--;
  setAndchangeTempo(slider.value);
});


document.addEventListener("keydown", function (e) {
  if (e.code === "KeyD") slider.value++;
  if (e.code === "KeyS") slider.value--;
  setAndchangeTempo(slider.value);
});

function setAndchangeTempo(bpm) {
  document.getElementById('tempo-text').textContent = slider.value + ' BPM';
  Tone.Transport.bpm.value = bpm;
}

// "quick-tempo" クラスを持つすべてのボタン要素を取得
const buttons = document.querySelectorAll('button.quick-tempo');

// 各ボタンに対してイベントリスナーを追加
buttons.forEach(button => {
  button.addEventListener('click', function () {
    slider.value = this.textContent;
    setAndchangeTempo(Number(this.textContent));
  });
});


document.getElementById("getMemory").addEventListener("click", function () {
  const tempo = document.getElementById("memory").textContent;
  console.log(tempo);
  slider.value = tempo;
  setAndchangeTempo(Number(tempo));
})

document.getElementById("setMemory").addEventListener("click", function () {
  document.getElementById("memory").textContent = slider.value;
})

document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
     event.preventDefault();
  }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
      event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
