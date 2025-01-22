function fixDPR(canvases: Array<HTMLCanvasElement>): void {
  const dpr = window.devicePixelRatio
  const computedStyles = getComputedStyle(canvases[0])

  const width = parseInt(computedStyles.getPropertyValue('width'))
  const height = parseInt(computedStyles.getPropertyValue('height'))
  const side = Math.min(width, height);
  canvases.forEach(canvas => {
    canvas.setAttribute('width', (side * dpr).toString())
    canvas.setAttribute('height', (side * dpr).toString())
  })
}

export { fixDPR }
