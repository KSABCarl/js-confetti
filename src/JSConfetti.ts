import { fixDPR } from "./fixDPR";
import { ConfettiShape } from "./ConfettiShape";
import { createCanvases } from "./createCanvas";
import { normalizeConfettiConfig } from "./normalizeConfettiConfig";
import { IPosition, IJSConfettiConfig, IAddConfettiConfig } from "./types";

class ConfettiBatch {
  private resolvePromise?: () => void;
  private promise: Promise<void>;
  private shapes: ConfettiShape[];

  constructor(private canvasContext: CanvasRenderingContext2D) {
    this.shapes = [];
    this.promise = new Promise(
      (completionCallback) => (this.resolvePromise = completionCallback)
    );
  }

  getBatchCompletePromise(): Promise<void> {
    return this.promise;
  }

  addShapes(...shapes: ConfettiShape[]): void {
    this.shapes.push(...shapes);
  }

  complete(): boolean {
    if (this.shapes.length) {
      return false;
    }

    this.resolvePromise?.();

    return true;
  }

  processShapes(
    time: { timeDelta: number; currentTime: number },
    canvasHeight: number,
    cleanupInvisibleShapes: boolean
  ): void {
    const { timeDelta, currentTime } = time;

    this.shapes = this.shapes.filter((shape) => {
      // Render the shapes in this batch
      shape.updatePosition(timeDelta, currentTime);
      shape.draw(this.canvasContext);

      // Only cleanup the shapes if we're being asked to
      if (!cleanupInvisibleShapes) {
        return true;
      }

      return shape.getIsVisibleOnCanvas(canvasHeight);
    });
  }
}

class JSConfetti {
  private readonly canvasLeft: HTMLCanvasElement;
  private readonly canvasRight: HTMLCanvasElement;
  private readonly canvasLeftContext: CanvasRenderingContext2D;
  private readonly canvasRightContext: CanvasRenderingContext2D;

  private activeConfettiBatches: ConfettiBatch[];
  private lastUpdated: number;

  private iterationIndex: number;
  private requestAnimationFrameRequested: boolean;

  public constructor(jsConfettiConfig: IJSConfettiConfig = {}) {
    this.activeConfettiBatches = [];

    const [left, right] = createCanvases();
    this.canvasLeft = left;
    this.canvasRight = right;
    this.canvasLeftContext = <CanvasRenderingContext2D>(
      this.canvasLeft.getContext("2d")
    );
    this.canvasRightContext = <CanvasRenderingContext2D>(
      this.canvasRight.getContext("2d")
    );

    this.requestAnimationFrameRequested = false;

    this.lastUpdated = new Date().getTime();
    this.iterationIndex = 0;

    this.loop = this.loop.bind(this);

    requestAnimationFrame(this.loop);
  }

  private loop(): void {
    this.requestAnimationFrameRequested = false;

    fixDPR([this.canvasLeft, this.canvasRight]);

    const currentTime = new Date().getTime();
    const timeDelta = currentTime - this.lastUpdated;

    const canvasHeight = this.canvasLeft.offsetHeight;
    const cleanupInvisibleShapes = this.iterationIndex % 10 === 0;

    this.activeConfettiBatches = this.activeConfettiBatches.filter((batch) => {
      batch.processShapes(
        { timeDelta, currentTime },
        canvasHeight,
        cleanupInvisibleShapes
      );

      // Do not remove invisible shapes on every iteration
      if (!cleanupInvisibleShapes) {
        return true;
      }

      return !batch.complete();
    });

    this.iterationIndex++;

    this.queueAnimationFrameIfNeeded(currentTime);
  }

  private queueAnimationFrameIfNeeded(currentTime?: number): void {
    if (this.requestAnimationFrameRequested) {
      // We already have a pended animation frame, so there is no more work
      return;
    }

    if (this.activeConfettiBatches.length < 1) {
      // No shapes to animate, so don't queue another frame
      return;
    }

    this.requestAnimationFrameRequested = true;

    // Capture the last updated time for animation
    this.lastUpdated = currentTime || new Date().getTime();
    requestAnimationFrame(this.loop);
  }

  public addConfetti(
    confettiConfig: IAddConfettiConfig = {}
  ): Promise<[void, void]> {
    const {
      confettiRadius,
      confettiNumber,
      confettiColors,
      emojis,
      emojiSize,
    } = normalizeConfettiConfig(confettiConfig);

    // Use the bounding rect rather tahn the canvas width / height, because
    // .width / .height are unset until a layout pass has been completed. Upon
    // confetti being immediately queued on a page load, this hasn't happened so
    // the default of 300x150 will be returned, causing an improper source point
    // for the confetti animation.
    const canvasRect = this.canvasLeft.getBoundingClientRect();
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;

    const yPosition = (canvasHeight * 5) / 7;

    const leftConfettiPosition: IPosition = {
      x: 0,
      y: yPosition,
    };
    const rightConfettiPosition: IPosition = {
      x: canvasWidth,
      y: yPosition,
    };

    const confettiGroupLeft = new ConfettiBatch(this.canvasLeftContext);
    const confettiGroupRight = new ConfettiBatch(this.canvasRightContext);

    for (let i = 0; i < confettiNumber / 2; i++) {
      const confettiOnTheRight = new ConfettiShape({
        initialPosition: leftConfettiPosition,
        direction: "right",
        confettiRadius,
        confettiColors,
        confettiNumber,
        emojis,
        emojiSize,
        canvasWidth,
      });

      const confettiOnTheLeft = new ConfettiShape({
        initialPosition: rightConfettiPosition,
        direction: "left",
        confettiRadius,
        confettiColors,
        confettiNumber,
        emojis,
        emojiSize,
        canvasWidth,
      });

      confettiGroupRight.addShapes(confettiOnTheRight);
      confettiGroupLeft.addShapes(confettiOnTheLeft);
    }

    this.activeConfettiBatches.push(confettiGroupRight, confettiGroupLeft);

    this.queueAnimationFrameIfNeeded();

    return Promise.all([
      confettiGroupRight.getBatchCompletePromise(),
      confettiGroupLeft.getBatchCompletePromise(),
    ]);
  }

  public clearCanvas(): void {
    this.activeConfettiBatches = [];
  }

  public destroyCanvas(): void {
    this.canvasLeft.remove();
    this.canvasRight.remove();
  }
}

export { JSConfetti };
