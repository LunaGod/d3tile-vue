import type { Viewer } from 'cesium'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    map: Viewer
  }
}
