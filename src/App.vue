<template>
  <div class="map" id="map"></div>
  <div class="view">
    <a-divider orientation="left"> 测试tileSet加载 </a-divider>
    <div class="model-row" v-for="item in links" :key="item.id">
      {{ item.title }}
      <a-button @click="handleClick(item)">{{
        item.isLoad ? "前往" : "加载"
      }}</a-button>
    </div>

    <a-divider orientation="left"> 自定义tileset加载 </a-divider>
    <a-input v-model:value="customLink" placeholder="输入tileset路径" />
    <a-button @click="customLoad">加载</a-button>
    <a-divider orientation="left"> 跳转到位置 </a-divider>
    经度：
    <a-input v-model:value="position.lonlat[0]" placeholder="输入经度" /> 维度：
    <a-input v-model:value="position.lonlat[1]" placeholder="输入维度" />
    高度：
    <a-input v-model:value="position.height" placeholder="输入高度" />
    <a-button @click="toCustomLonLat">前往</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import {
  Cartesian3,
  Cesium3DTileset,
  Viewer,
  CameraEventType,
  KeyboardEventModifier
} from "cesium";

export default defineComponent({
  name: "App",
  setup: () => {
    const customLink = ref("");
    const position = reactive({
      lonlat: ["", ""],
      height: 200
    });

    const links = reactive([
      {
        title: "测试模型1",
        link: "/tilesets/TilesetWithDiscreteLOD/tileset.json",
        id: "1",
        isLoad: false
      },
      {
        title: "测试模型2",
        link: "/tilesets/TilesetWithExpiration/tileset.json",
        id: "2",
        isLoad: false
      },
      {
        title: "测试模型3",
        link: "/tilesets/TilesetWithRequestVolume/tileset.json",
        id: "3",
        isLoad: false
      },
      {
        title: "测试模型4",
        link: "/tilesets/TilesetWithTreeBillboards/tileset.json",
        id: "4",
        isLoad: false
      }
    ]);
    onMounted(() => {
      window.map = new Viewer("map", {
        animation: false,
        timeline: false
      });
      window.map.scene.screenSpaceCameraController.tiltEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.PINCH,
        {
          eventType: CameraEventType.LEFT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        },
        {
          eventType: CameraEventType.RIGHT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        }
      ];
      window.map.scene.screenSpaceCameraController.zoomEventTypes = [
        CameraEventType.MIDDLE_DRAG,
        CameraEventType.WHEEL,
        CameraEventType.PINCH
      ];
    });
    const handleClick = (model: { link: any; isLoad: boolean }) => {
      let index = -1;
      const primitives = window.map.scene.primitives;
      for (let i = 0; i < primitives.length; i++) {
        if (primitives.get(i).url === model.link) {
          index = i;
        }
      }
      if (index > 0) {
        const tileSet = window.map.scene.primitives.get(index);
        window.map.zoomTo(tileSet);
        return;
      }
      const titleSet: Cesium3DTileset = window.map.scene.primitives.add(
        new Cesium3DTileset({
          url: model.link
        })
      );
      titleSet.readyPromise.then(function (tileset) {
        window.map.zoomTo(tileset);
        model.isLoad = true;
      });
    };

    const customLoad = () => {
      const titleSet: Cesium3DTileset = window.map.scene.primitives.add(
        new Cesium3DTileset({
          url: customLink.value
        })
      );

      titleSet.readyPromise.then(function (tileset) {
        window.map.zoomTo(tileset);
      });
    };
    const toCustomLonLat = () => {
      const destination = Cartesian3.fromDegrees(
        parseFloat(position.lonlat[0]),
        parseFloat(position.lonlat[1]),
        position.height
      );
      window.map.camera.flyTo({
        destination
      });
    };
    return {
      links,
      handleClick,
      customLoad,
      customLink,
      position,
      toCustomLonLat
    };
  }
});
</script>

<style lang="sass">
*
  margin: 0
  padding: 0
html,body,#app,#map
  height: 100%
.cesium-viewer-bottom
  display: none
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
.view
  position: absolute
  top: 10px
  left: 10px
  width: 20%
  display: inline-block
  background: rgba(#ffffff,.8)
  padding: 10px
  .model-row
    padding: 5px 0
</style>
