<template>
  <div class="wrap">
    <img class="logo" :src="require('@/assets/imgs/logo_bai.png')" alt="logo" />
    <!-- <div class="btn click">了解更多</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160px 0;
  .logo {
    width: 570px;
  }
  .btn {
    // margin-top: 60px;
    width: 140px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 90px;
    border: 1px solid #ffffff;
    font-size: 20px;
    color: #fff;
  }
}
</style>