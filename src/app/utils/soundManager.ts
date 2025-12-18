const sounds: Record<string, HTMLAudioElement> = {
  click: new Audio('/sounds/click.mp3'),
  move: new Audio('/sounds/move.mp3'),
  hit: new Audio('/sounds/hit.mp3'),
  win: new Audio('/sounds/win.mp3'),
  lose: new Audio('/sounds/lose.mp3'),
};

let bgm: HTMLAudioElement | null = null;

export function playSound(name: keyof typeof sounds) {
  const sound = sounds[name];
  if (!sound) return;

  sound.currentTime = 0;
  sound.volume = 0.8;
  sound.play().catch(err => {
    console.warn('Sound blocked:', err);
  });
}

export function playBGM(file: string) {
  stopBGM();

  bgm = new Audio(`/sounds/${file}.mp3`);
  bgm.loop = true;
  bgm.volume = 0.3;
  bgm.play().catch(err => {
    console.warn('BGM blocked:', err);
  });
}

export function stopBGM() {
  if (bgm) {
    bgm.pause();
    bgm.currentTime = 0;
    bgm = null;
  }
}
