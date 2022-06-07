<template>
  <view
    :class="['Avatar', isError ? 'Avatar-error' : '']"
    :style="{
      width: size,
      height: size,
    }"
  >
    <u-image
      class="Avatar-image"
      :src="src"
      :width="size"
      :height="size"
      @error="errorMessage"
    >
      <view class="Avatar-image-error" slot="error">
        {{ shortName }}
      </view>
    </u-image>
  </view>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "48px",
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return { isError: false };
  },
  methods: {
    errorMessage() {
      this.isError = true;
    },
  },
  computed: {
    shortName() {
      const enNameReg = /[A-Za-z0-9]$/g; //是否英文名
      if (enNameReg.test(this.name)) {
        return this.name.substr(0, 3);
      } else {
        return this.name.substr(-2);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.Avatar {
  border-radius: 12rpx;
  box-sizing: border-box;
  overflow: hidden;
  &-image {
    /deep/ .u-image__error {
      background: transparent;
    }
    &-error {
      overflow: hidden;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 8px;
      white-space: nowrap;
    }
  }
  &-error {
    background-color: #5496eb;
  }
}
</style>