import { defineStore } from 'pinia';

interface hoverTeeth {
  teeth: number[];
}

export const userHoverStore = defineStore('hover', {
  state: (): hoverTeeth => ({
    teeth: [],
  }),
  actions: {
    setHover(teethList: number[]) {
      this.teeth = teethList
    }
  },
});
