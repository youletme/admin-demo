<template>
  <div id="near">
    <div id="amap-main"></div>
  </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
export default {
  name: "map-drag",
  created() {
    if (window.AMap && window.AMapUI) {
      this.initMap();
    }
  },
  methods: {
    initMap() {
      lazyAMapApiLoaderInstance.load().then(() => {
        // 初始化地图

        // 这个是添加AMapUI的点标注
        // eslint-disable-next-line no-undef
        AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
          // eslint-disable-next-line no-undef
          const map = new AMap.Map("amap-main", {
            resizeEnable: true,
            zoom: 20,
            // eslint-disable-next-line no-undef
            center: new AMap.LngLat(121.549792, 29.868407)
          });
          const a = new PositionPicker({
            mode: "dragMap", // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
            map: map // 依赖地图对象
          });
          // a.on("success", positionResult => {
          //   // this.$emit('drag', positionResult)
          // });
          a.on("fail", function(positionResult) {
            console.log(positionResult);
          });
          a.start();
        });
      });
    }
  }
};
</script>

<style lang="scss">
#near {
  #amap-main {
    width: 100%;
    height: 100%;
  }
}
</style>
