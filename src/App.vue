<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import {
  CameraEventType,
  Cartesian3,
  Cesium3DTileset,
  KeyboardEventModifier,
  Viewer,
} from 'cesium'

export default defineComponent({
  name: 'App',
  setup: () => {
    const customLink = ref('')
    const position = reactive({
      lonlat: ['', ''],
      height: 200,
    })

    const links = reactive([
      {
        title: '测试模型1',
        link: '/tilesets/TilesetWithDiscreteLOD/tileset.json',
        id: '1',
        isLoad: false,
      },
      {
        title: '测试模型2',
        link: '/tilesets/TilesetWithExpiration/tileset.json',
        id: '2',
        isLoad: false,
      },
      {
        title: '测试模型3',
        link: '/tilesets/TilesetWithRequestVolume/tileset.json',
        id: '3',
        isLoad: false,
      },
      {
        title: '测试模型4',
        link: '/tilesets/TilesetWithTreeBillboards/tileset.json',
        id: '4',
        isLoad: false,
      },
    ])
    onMounted(() => {
      window.map = new Viewer('map', {
        animation: false,
        timeline: false,
      })
      window.map.scene.screenSpaceCameraController.tiltEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.PINCH,
        {
          eventType: CameraEventType.LEFT_DRAG,
          modifier: KeyboardEventModifier.CTRL,
        },
        {
          eventType: CameraEventType.RIGHT_DRAG,
          modifier: KeyboardEventModifier.CTRL,
        },
      ]
      window.map.scene.screenSpaceCameraController.zoomEventTypes = [
        CameraEventType.MIDDLE_DRAG,
        CameraEventType.WHEEL,
        CameraEventType.PINCH,
      ]
    })
    const handleClick = (model: { link: any; isLoad: boolean }) => {
      let primitiveIndex = -1

      const { primitives } = window.map.scene
      for (let i = 0; i < primitives.length; i += 1) {
        if (primitives.get(i).url === model.link)
          primitiveIndex = i
      }
      if (primitiveIndex > 0) {
        const tileSet = window.map.scene.primitives.get(primitiveIndex)
        window.map.zoomTo(tileSet)
        return
      }
      const titleSet: Cesium3DTileset = window.map.scene.primitives.add(
        new Cesium3DTileset({
          url: model.link,
        }),
      )
      titleSet.readyPromise.then((tileset) => {
        window.map.zoomTo(tileset)
        links.forEach((link, index) => {
          if (link.link === model.link)
            links[index].isLoad = true
        })
      })
    }

    const customLoad = () => {
      const titleSet: Cesium3DTileset = window.map.scene.primitives.add(
        new Cesium3DTileset({
          url: customLink.value,
        }),
      )

      titleSet.readyPromise.then((tileset) => {
        window.map.zoomTo(tileset)
      })
    }
    const toCustomLonLat = () => {
      const destination = Cartesian3.fromDegrees(
        parseFloat(position.lonlat[0]),
        parseFloat(position.lonlat[1]),
        position.height,
      )
      window.map.camera.flyTo({
        destination,
      })
    }
    return {
      links,
      handleClick,
      customLoad,
      customLink,
      position,
      toCustomLonLat,
    }
  },
})
</script>

<template lang="pug">
.map#map
.view
  a-divider(orientation="left")
    | 测试tileSet加载
  div(v-for="item in links" :key="item.id" class="model-row")
    a-button(@click="handleClick(item)")
      | {{item.isLoad ? "前往" : "加载"}}
  a-divider(orientation="left")
    | 自定义加载
  a-input(
    v-model="customLink"
    placeholder="请输入自定义tileSet地址"
  )
  a-button(@click="customLoad")
    | 加载
  a-divider(orientation="left")
    | 自定义位置
  a-input(
    v-model="position.lonlat[0]"
    placeholder="请输入经度"
  )
  a-input(
    v-model="position.lonlat[1]"
    placeholder="请输入纬度"
  )
  a-input(
    v-model="position.height"
    placeholder="请输入高度"
  )
  a-button(@click="toCustomLonLat")
    | 前往
</template>

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
