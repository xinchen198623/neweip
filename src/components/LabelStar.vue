<template>
  <div class="label-star-wrapper clearfix">
    <a class="label-text" v-if="labelInfo.isOuter" :target='labelInfo.target' :href='labelInfo.url'>{{labelInfo.text}}</a>
    <p class="label-text" v-else @click="toPage">{{labelInfo.text}}</p>
    <p :class="{'label-star': true, 'is-selected': isSelected}" @click.stop="triggerSelected"><i></i></p>
  </div>
</template>

<script>
  export default {
    props: {
      labelInfo: {
        default: function() {
          return {
            text: '考勤确认'
          }
        }
      },
      isSelected: false
    },
    data() {
      return {};
    },
    methods: {
      triggerSelected() {
        // 触发父级方法
        this.$emit('addMenu', this.labelInfo.key, this.isSelected);
      },
      toPage () {
        let {url, text, type} = this.labelInfo;
        this.$router.push({path: url, query: {params: encodeURIComponent(text), type: type}});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .label-star-wrapper {
    width: 80px;
    display: inline-block;
    line-height: 17px;

    p,a {
      margin: 0;
      font-size: 12px;
      color: #666;
      cursor: pointer;
    }
    .label-text {
      float: left;
    }
    .label-star {
      float: right;
    }
    i {
      display: inline-block;
      background: url(../assets/img/star-outline.png) no-repeat;
      background-size: 100% 100%;
      width: 12px;
      height: 12px;
      margin-bottom: -1px;
    }
  }

  .is-selected {
    i {
      background: url(../assets/img/star.png) no-repeat;
    }
  }

  .label-star-wrapper:hover {
    p, a {
      color: #2F83FF;
    }
    i {
      background: url(../assets/img/star-hover.png) no-repeat;
      background-size: 100% 100%;
    }
  }

  .clearfix:after {
    content:"";
    display: block;
    clear:both;
  }
</style>
