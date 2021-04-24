import { createApp } from "vue";
import { Button, Input, Divider } from "ant-design-vue";
import App from "./App.vue";
import "ant-design-vue/dist/antd.css";

const app = createApp(App);
app.use(Button);
app.use(Input);
app.use(Divider);
app.mount("#app");
