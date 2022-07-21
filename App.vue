<script>
import { mapGetters } from "vuex";
export default {
  onLaunch() {
    this.$store.commit("user/set_loginStatus", false);
    this.$store.commit("user/set_connectStatus", 1);
    if (process.env.NODE_ENV === "development") {
      // this.$store.commit("message/clear_allLocalConversationMessage");
    }
  },
  onShow() {},
  onHide() {},
  methods: {},
  computed: {
    ...mapGetters(["userID"]),
  },
};
</script>
<style lang="scss">
@import "@/uni_modules/uview-ui/index.scss";
@import "@/style/index.scss";
</style>
