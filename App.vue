<script>
export default {
  onLaunch() {
    this.$store.commit("user/set_loginStatus", false);
    this.$store.commit("user/set_connectStatus", 1);
  },
  onShow() {},
  onHide() {},
  methods: {},
};
</script>
<style lang="scss">
@import "@/uni_modules/uview-ui/index.scss";
@import "@/style/index.scss";
</style>
