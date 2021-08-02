<template>
  <div class="wrap">
    <img class="logo" :src="require('@/assets/imgs/logo_bai.png')" alt="logo" />
    <!-- <div class="btn click">{{$t('home.learnMore')}}</div> -->
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
  padding: 8rem 0;
  .logo {
    width: 34rem;
  }
  .btn {
    width: 9rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10rem;
    border: 0.1rem solid #ffffff;
    font-size: 1.5rem;
    color: #fff;
  }
}
</style>