class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

HTMLCanvasElement.prototype.getContext = () => null
HTMLCanvasElement.prototype.toDataURL = () => ''

HTMLElement.prototype.setPointerCapture = () => {}
HTMLElement.prototype.releasePointerCapture = () => {}
HTMLElement.prototype.hasPointerCapture = () => false
