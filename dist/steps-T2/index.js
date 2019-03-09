import { VantComponent } from '../common/component';
import { GREEN } from '../common/color';
VantComponent({
  props: {
    icon: String,
    steps: Array,
    active: Number,
    direction: {
      type: String,
      value: 'horizontal'
    },
    activeColor: {
      type: String,
      value: GREEN
    }
  },
  watch: {
    steps: 'formatSteps',
    active: 'formatSteps'
  },
  created: function created() {
    this.formatSteps();
  },
  methods: {
    formatSteps: function formatSteps() {
      var _this = this;
      var steps = this.data.steps;
      this.set({
        steps: steps,
      });
    },
    handleIsDelete(e) {
      this.$emit("delete", { foId: e.currentTarget.dataset.id, status: e.currentTarget.dataset.status})
    },
    handleIsEdit(e){
      this.$emit("edit", { foId: e.currentTarget.dataset.id, type: e.currentTarget.dataset.type})
    }
  }
});