function fixDPR(canvases) {
    const dpr = window.devicePixelRatio;
    const computedStyles = getComputedStyle(canvases[0]);
    const width = parseInt(computedStyles.getPropertyValue("width"));
    const height = parseInt(computedStyles.getPropertyValue("height"));
    const side = Math.min(width, height);
    canvases.forEach((canvas) => {
        canvas.setAttribute("width", (side * dpr).toString());
        canvas.setAttribute("height", (side * dpr).toString());
    });
}

function generateRandomNumber(min, max, fractionDigits = 0) {
    const randomNumber = Math.random() * (max - min) + min;
    return Math.floor(randomNumber * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
}

const FREE_FALLING_OBJECT_ACCELERATION = 0.00125;
const MIN_DRAG_FORCE_COEFFICIENT = 0.0005;
const MAX_DRAG_FORCE_COEFFICIENT = 0.0009;
const ROTATION_SLOWDOWN_ACCELERATION = 0.00001;
const INITIAL_SHAPE_RADIUS = 6;
const INITIAL_EMOJI_SIZE = 80;
const MIN_INITIAL_CONFETTI_SPEED = 0.9;
const MAX_INITIAL_CONFETTI_SPEED = 1.7;
const MIN_FINAL_X_CONFETTI_SPEED = 0.2;
const MAX_FINAL_X_CONFETTI_SPEED = 0.6;
const MIN_INITIAL_ROTATION_SPEED = 0.03;
const MAX_INITIAL_ROTATION_SPEED = 0.07;
const MIN_CONFETTI_ANGLE = 15;
const MAX_CONFETTI_ANGLE = 82;
const SHAPE_VISIBILITY_TRESHOLD = 100;
const DEFAULT_CONFETTI_NUMBER = 250;
const DEFAULT_EMOJIS_NUMBER = 40;
const DEFAULT_CONFETTI_COLORS = [
    "#fcf403",
    "#62fc03",
    "#f4fc03",
    "#03e7fc",
    "#03fca5",
    "#a503fc",
    "#fc03ad",
    "#fc03c2",
];

function randomChoice(arr) {
    return [...arr].sort(() => 0.5 - Math.random())[0];
}

// For wide screens - fast confetti, for small screens - slow confetti
function getWindowWidthCoefficient(canvasWidth) {
    const HD_SCREEN_WIDTH = 1920;
    return Math.log(canvasWidth) / Math.log(HD_SCREEN_WIDTH);
}
function createEmojiCanvas(emoji, size) {
    const canvas = document.createElement("canvas");
    canvas.width = size * 2;
    canvas.height = size * 2;
    const canvasContext = canvas.getContext("2d");
    canvasContext.font = `${size}px serif`;
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";
    let { actualBoundingBoxAscent, actualBoundingBoxDescent } = canvasContext.measureText(emoji);
    canvasContext.fillText(emoji, size / 2, size / 2 + (actualBoundingBoxAscent - actualBoundingBoxDescent) / 2);
    canvasContext.save();
    return canvas;
}
const PreRenderedEmojis = new Map();
class ConfettiShape {
    constructor(args) {
        const { initialPosition, direction, confettiRadius, confettiColors, emojis, emojiSize, canvasWidth, } = args;
        const randomConfettiSpeed = generateRandomNumber(MIN_INITIAL_CONFETTI_SPEED, MAX_INITIAL_CONFETTI_SPEED, 3);
        const initialSpeed = randomConfettiSpeed * getWindowWidthCoefficient(canvasWidth);
        this.confettiSpeed = {
            x: initialSpeed,
            y: initialSpeed,
        };
        this.finalConfettiSpeedX = generateRandomNumber(MIN_FINAL_X_CONFETTI_SPEED, MAX_FINAL_X_CONFETTI_SPEED, 3);
        this.rotationSpeed = emojis.length
            ? 0.01
            : generateRandomNumber(MIN_INITIAL_ROTATION_SPEED, MAX_INITIAL_ROTATION_SPEED, 3) * getWindowWidthCoefficient(canvasWidth);
        this.dragForceCoefficient = generateRandomNumber(MIN_DRAG_FORCE_COEFFICIENT, MAX_DRAG_FORCE_COEFFICIENT, 6);
        this.radius = {
            x: confettiRadius,
            y: confettiRadius,
        };
        this.initialRadius = confettiRadius;
        this.rotationAngle =
            direction === "left"
                ? generateRandomNumber(0, 0.2, 3)
                : generateRandomNumber(-0.2, 0, 3);
        this.emojiSize = emojiSize;
        this.emojiRotationAngle = generateRandomNumber(0, 2 * Math.PI);
        this.radiusYUpdateDirection = "down";
        const angle = direction === "left"
            ? (generateRandomNumber(MAX_CONFETTI_ANGLE, MIN_CONFETTI_ANGLE) *
                Math.PI) /
                180
            : (generateRandomNumber(-15, -82) *
                Math.PI) /
                180;
        this.absCos = Math.abs(Math.cos(angle));
        this.absSin = Math.abs(Math.sin(angle));
        const positionShift = generateRandomNumber(-150, 0);
        const shiftedInitialPosition = {
            x: initialPosition.x +
                (direction === "left" ? -positionShift : positionShift) * this.absCos,
            y: initialPosition.y - positionShift * this.absSin,
        };
        this.currentPosition = Object.assign({}, shiftedInitialPosition);
        this.initialPosition = Object.assign({}, shiftedInitialPosition);
        this.color = emojis.length ? null : randomChoice(confettiColors);
        this.emoji = emojis.length ? randomChoice(emojis) : null;
        this.canvas = PreRenderedEmojis.get(`${this.emoji}:${emojiSize}`);
        if (this.emoji && !this.canvas) {
            this.canvas = createEmojiCanvas(this.emoji, emojiSize);
            PreRenderedEmojis.set(`${this.emoji}:${emojiSize}`, this.canvas);
        }
        this.createdAt = new Date().getTime();
        this.direction = direction;
    }
    draw(canvasContext) {
        const { currentPosition, radius, color, emoji, rotationAngle, emojiRotationAngle, emojiSize, canvas, } = this;
        const dpr = window.devicePixelRatio;
        if (color) {
            canvasContext.fillStyle = color;
            canvasContext.beginPath();
            canvasContext.ellipse(currentPosition.x * dpr, currentPosition.y * dpr, radius.x * dpr, radius.y * dpr, rotationAngle, 0, 2 * Math.PI);
            canvasContext.fill();
        }
        else if (emoji) {
            canvasContext.save();
            canvasContext.translate(dpr * currentPosition.x, dpr * currentPosition.y);
            canvasContext.rotate(emojiRotationAngle);
            canvasContext.drawImage(canvas, 0, 0);
            canvasContext.restore();
        }
    }
    updatePosition(iterationTimeDelta, currentTime) {
        const { confettiSpeed, dragForceCoefficient, finalConfettiSpeedX, radiusYUpdateDirection, rotationSpeed, createdAt, direction, } = this;
        const timeDeltaSinceCreation = currentTime - createdAt;
        if (confettiSpeed.x > finalConfettiSpeedX)
            this.confettiSpeed.x -= dragForceCoefficient * iterationTimeDelta;
        this.currentPosition.x +=
            confettiSpeed.x *
                (direction === "left" ? -this.absCos : this.absCos) *
                iterationTimeDelta;
        this.currentPosition.y =
            this.initialPosition.y -
                confettiSpeed.y * this.absSin * timeDeltaSinceCreation +
                (FREE_FALLING_OBJECT_ACCELERATION * Math.pow(timeDeltaSinceCreation, 2)) / 2;
        this.rotationSpeed -= this.emoji
            ? 0.0001
            : ROTATION_SLOWDOWN_ACCELERATION * iterationTimeDelta;
        if (this.rotationSpeed < 0)
            this.rotationSpeed = 0;
        // no need to update rotation radius for emoji
        if (this.emoji) {
            this.emojiRotationAngle +=
                (this.rotationSpeed * iterationTimeDelta) % (2 * Math.PI);
            return;
        }
        if (radiusYUpdateDirection === "down") {
            this.radius.y -= iterationTimeDelta * rotationSpeed;
            if (this.radius.y <= 0) {
                this.radius.y = 0;
                this.radiusYUpdateDirection = "up";
            }
        }
        else {
            this.radius.y += iterationTimeDelta * rotationSpeed;
            if (this.radius.y >= this.initialRadius) {
                this.radius.y = this.initialRadius;
                this.radiusYUpdateDirection = "down";
            }
        }
    }
    getIsVisibleOnCanvas(canvasHeight) {
        return this.currentPosition.y < canvasHeight + SHAPE_VISIBILITY_TRESHOLD;
    }
}

function createCanvas(dir) {
    const canvas = document.createElement("canvas");
    const side = screen.width > screen.height ? screen.height : screen.width;
    canvas.style.position = "fixed";
    canvas.style.width = `${side}px`;
    canvas.style.height = `${side}px`;
    canvas.style.bottom = "0";
    if (dir && dir === "right") {
        canvas.style.right = "0";
    }
    else {
        canvas.style.left = "0";
    }
    canvas.style.zIndex = "1000";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);
    return canvas;
}
function createCanvases() {
    return [createCanvas("right"), createCanvas("left")];
}

function normalizeConfettiConfig(confettiConfig) {
    const { confettiRadius = INITIAL_SHAPE_RADIUS, confettiNumber = confettiConfig.confettiesNumber ||
        (confettiConfig.emojis ? DEFAULT_EMOJIS_NUMBER : DEFAULT_CONFETTI_NUMBER), confettiColors = DEFAULT_CONFETTI_COLORS, emojis = confettiConfig.emojies || [], emojiSize = INITIAL_EMOJI_SIZE, } = confettiConfig;
    // deprecate wrong plural forms, used in early releases
    if (confettiConfig.emojies)
        console.error(`emojies argument is deprecated, please use emojis instead`);
    if (confettiConfig.confettiesNumber)
        console.error(`confettiesNumber argument is deprecated, please use confettiNumber instead`);
    return { confettiRadius, confettiNumber, confettiColors, emojis, emojiSize };
}

class ConfettiBatch {
    constructor(canvasContext) {
        this.canvasContext = canvasContext;
        this.shapes = [];
        this.promise = new Promise((completionCallback) => (this.resolvePromise = completionCallback));
    }
    getBatchCompletePromise() {
        return this.promise;
    }
    addShapes(...shapes) {
        this.shapes.push(...shapes);
    }
    complete() {
        var _a;
        if (this.shapes.length) {
            return false;
        }
        (_a = this.resolvePromise) === null || _a === undefined ? undefined : _a.call(this);
        return true;
    }
    processShapes(time, canvasHeight, cleanupInvisibleShapes) {
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
    constructor(jsConfettiConfig = {}) {
        this.activeConfettiBatches = [];
        const [left, right] = createCanvases();
        this.canvasLeft = left;
        this.canvasRight = right;
        this.canvasLeftContext = (this.canvasLeft.getContext("2d"));
        this.canvasRightContext = (this.canvasRight.getContext("2d"));
        this.requestAnimationFrameRequested = false;
        this.lastUpdated = new Date().getTime();
        this.iterationIndex = 0;
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }
    loop() {
        this.requestAnimationFrameRequested = false;
        fixDPR([this.canvasLeft, this.canvasRight]);
        const currentTime = new Date().getTime();
        const timeDelta = currentTime - this.lastUpdated;
        const canvasHeight = this.canvasLeft.offsetHeight;
        const cleanupInvisibleShapes = this.iterationIndex % 10 === 0;
        this.activeConfettiBatches = this.activeConfettiBatches.filter((batch) => {
            batch.processShapes({ timeDelta, currentTime }, canvasHeight, cleanupInvisibleShapes);
            // Do not remove invisible shapes on every iteration
            if (!cleanupInvisibleShapes) {
                return true;
            }
            return !batch.complete();
        });
        this.iterationIndex++;
        this.queueAnimationFrameIfNeeded(currentTime);
    }
    queueAnimationFrameIfNeeded(currentTime) {
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
    addConfetti(confettiConfig = {}) {
        const { confettiRadius, confettiNumber, confettiColors, emojis, emojiSize, } = normalizeConfettiConfig(confettiConfig);
        // Use the bounding rect rather tahn the canvas width / height, because
        // .width / .height are unset until a layout pass has been completed. Upon
        // confetti being immediately queued on a page load, this hasn't happened so
        // the default of 300x150 will be returned, causing an improper source point
        // for the confetti animation.
        const canvasRect = this.canvasLeft.getBoundingClientRect();
        const canvasWidth = canvasRect.width;
        const canvasHeight = canvasRect.height;
        const yPosition = (canvasHeight * 5) / 7;
        const leftConfettiPosition = {
            x: 0,
            y: yPosition,
        };
        const rightConfettiPosition = {
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
    clearCanvas() {
        this.activeConfettiBatches = [];
    }
    destroyCanvas() {
        this.canvasLeft.remove();
        this.canvasRight.remove();
    }
}

export { JSConfetti as default };
