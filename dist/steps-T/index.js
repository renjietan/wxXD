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
      steps.forEach(function (step, index) {
        step.status = _this.getStatus(index);
      });
      this.set({
        steps: steps,
      });
    },
    getStatus: function getStatus(index) {
      var active = this.data.active;
      if (index < active) {
        return 'finish';
      } else if (index === active) {
        return 'process';
      }
      return '';
    },
    handleEditStatus(e){
      let params = {
        index: e.currentTarget.dataset.index,
        name: e.currentTarget.dataset.name
      }
      this.$emit("submit", params)
    }
    // handleEditStatus(e){
    //   let es = [...this.data.steps]
    //   es.forEach((item, i) => {
    //     if(i != e.currentTarget.dataset.name){
    //       item.isEditStatus = false
    //     }else{
    //       item.isEditStatus = !item.isEditStatus
    //     }
    //   })
    //   // es[e.currentTarget.dataset.name].isEditStatus = !es[e.currentTarget.dataset.name].isEditStatus
    //   this.set({
    //     steps: es
    //   })
    // }
  }
});