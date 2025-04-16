export class PausableInterval {
  private callback: () => void;
  private interval: number;
  private timerId: number | null = null;
  private isPaused: boolean = false;
  private isCleared: boolean = false;

  constructor(callback: () => void, interval: number) {
    this.callback = callback;
    this.interval = interval;
    this.start();
  }

  private start(): void {
    if (this.isCleared) return;
    this.timerId = window.setTimeout(() => {
      if (!this.isPaused) {
        this.callback();
      }
      this.start(); // reprograma la siguiente iteración
    }, this.interval);
  }

  /** Pausa el intervalo */
  pause(): void {
    this.isPaused = true;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /** Reanuda el intervalo */
  resume(): void {
    if (!this.isCleared && this.isPaused) {
      this.isPaused = false;
      this.start();
    }
  }

  /** Cancela el intervalo */
  clear(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.isCleared = true;
  }
}
