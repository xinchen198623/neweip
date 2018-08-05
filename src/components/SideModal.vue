<template>
  <div class="side-modal-wrapper">
    <transition name="modal">
      <div class="side-modal-main" v-if="isShow">
        <i class="modal-close" @click="closeModal"></i>
        <header>
          <h3>{{title}}</h3>
        </header>
        <slot></slot>
      </div>
    </transition>
    <div class="side-modal-shade" v-if="isShow"></div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        default: '替换审批人'
      },
      isShow: {
        default: false
      }
    },
    data() {
      return {

      }
    },
    methods: {
      closeModal() {
        // this.isShow = false;
        this.$emit('closeModal');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';

  .side-modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    .side-modal-main {
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      width: 373px;
      background: #fff;
      padding: 25px 0 0 32px;

      h3 {
        font-size: $headerSize;
        color: $major;
        margin: 15px 0 62px 0;
      }
      i {
        position: absolute;
        right: 23px;
        width: 30px;
        height: 30px;
        background: url(../assets/img/modal-close.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .side-modal-shade {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, .5);
      z-index: -1;
    }
  }

  .modal-enter-active, .modal-leave-active {
    transition: all .5s;
  }
  .modal-enter, .modal-leave-to {
    transform: translateX(373px);
  }
</style>
