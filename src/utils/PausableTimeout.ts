export class PausableTimeout {
  private callback: () => void;
  private remaining: number;
  private timerId: number | null = null;
  private startTime: number = 0;
  private isCleared: boolean = false;

  constructor(callback: () => void, delay: number) {
    this.callback = callback;
    this.remaining = delay;
    this.start();
  }

  private start(): void {
    this.startTime = Date.now();
    this.timerId = window.setTimeout(() => {
      this.callback();
      // Opcional: marcar como finalizado si se desea no permitir reanudar
      this.isCleared = true;
    }, this.remaining);
  }

  /** Pausa el timeout y guarda el tiempo restante */
  pause(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
      this.remaining -= Date.now() - this.startTime;
    }
  }

  /** Reanuda el timeout con el tiempo restante */
  resume(): void {
    if (this.timerId === null && !this.isCleared && this.remaining > 0) {
      this.start();
    }
  }

  /** Cancela el timeout definitivamente */
  clear(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.isCleared = true;
  }
}
