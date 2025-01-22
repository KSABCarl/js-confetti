function createCanvas(dir?: "left" | "right"): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  const side = screen.width > screen.height ? screen.height : screen.width;

  canvas.style.position = "fixed";
  canvas.style.width = `${side}px`;
  canvas.style.height = `${side}px`;
  canvas.style.bottom = "0";
  if (dir && dir === "right") {
    canvas.style.right = "0";
  } else {
    canvas.style.left = "0";
  }
  canvas.style.zIndex = "1000";
  canvas.style.pointerEvents = "none";

  document.body.appendChild(canvas);

  return canvas;
}

function createCanvases(): [HTMLCanvasElement, HTMLCanvasElement] {
  return [createCanvas("right"), createCanvas("left")];
}

export { createCanvas, createCanvases };
