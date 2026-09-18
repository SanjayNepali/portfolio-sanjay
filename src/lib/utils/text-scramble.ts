export class TextScramble {
  private el: HTMLElement;
  private chars = "!<>-_\\/[]{}—=+*^?#____";
  private frame = 0;
  private request = 0;
  private queue: {
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }[] = [];

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(text: string) {
    const old = this.el.textContent ?? "";
    const length = Math.max(old.length, text.length);

    this.queue = Array.from({ length }, (_, i) => {
      const start = Math.floor(Math.random() * 10);

      return {
        from: old[i] || "",
        to: text[i] || "",
        start,
        end: start + Math.floor(Math.random() * 10),
      };
    });

    cancelAnimationFrame(this.request);
    this.frame = 0;
    this.update();
  }

  /** Cancels any in-flight animation frame. Required for React cleanup. */
  stop() {
    cancelAnimationFrame(this.request);
    this.request = 0;
    this.queue = [];
  }

  private update() {
    let output = "";
    let complete = 0;

    for (const item of this.queue) {
      if (this.frame >= item.end) {
        output += item.to;
        complete++;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }

        output += `<span class="opacity-40">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }

    this.el.innerHTML = output;

    if (complete < this.queue.length) {
      this.frame++;
      this.request = requestAnimationFrame(this.update);
    }
  }
}
