import { Viewer } from "cesium";
declare global {
  interface Window {
    map: Viewer;
  }
}
