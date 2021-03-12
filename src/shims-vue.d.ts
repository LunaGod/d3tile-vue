import { Viewer } from "cesium";

declare module "*.vue" {
  // @ts-ignore
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare global {
  interface Window {
    map: Viewer;
  }
}
