<template>
  <div class="teeth-container">
    <div v-for="area in areas" :class="area.name">
      <div v-for="areaQ in area.areas" :class="areaQ">
        <div
          v-for="(tooth, index) in toothTypes"
          :key="areaQ + tooth"
          class="tooth"
          :class="[
            'tooth',
            `tooth__${tooth}`,
            {
              'tooth-decayed': checkDecayed(
                areaName.indexOf(areaQ) + 1,
                index + 1
              ),
              'tooth-missing': checkMissing(
                areaName.indexOf(areaQ) + 1,
                index + 1
              ),
              'tooth-filled': checkFilled(
                areaName.indexOf(areaQ) + 1,
                index + 1
              ),
              'tooth-highlight': checkHover(
                areaName.indexOf(areaQ) + 1,
                index + 1
              )
            },
          ]"
          @click="
            toggleTooth(areaName.indexOf(areaQ) + 1, index + 1)
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {userHoverStore} from '@/stores/toothHover'
const toothHover = userHoverStore()
const areas = [
  {
    name: "upper",
    areas: ["upper-right", "upper-left"],
  },
  {
    name: "lower",
    areas: ["lower-right", "lower-left"],
  },
];
const areaName = ["upper-right", "upper-left", "lower-left", "lower-right"];
const toothTypes = [
  "central_incisor",
  "lateral_incisor",
  "carnine",
  "biscupid1",
  "biscupid2",
  "molar1",
  "molar2",
  "wisdom",
];
interface IProps {
  missing: number[];
  decayed: number[];
  filled: number[];
}
const props = defineProps<IProps>();
const emit = defineEmits(['toggle-tooth']);
// const checkActive = (area: number, toothNumber: number): boolean => {
//   let actualNumber = area * 10 + toothNumber;
//   return props.teeth.includes(actualNumber);
// };
// const toggleTeeth = (toothNumber: number) => {
//   var filteredArray = props.teeth
//   if(props.teeth.includes(toothNumber)){
//     filteredArray = props.teeth.filter((e) => e !== toothNumber);
//   }
//   else{
//     filteredArray.push(toothNumber)
//   }
//   emit("reAdd", filteredArray);
// };
const checkDecayed = (area: number, toothNumber: number): boolean => {
  let actualNumber = area * 10 + toothNumber;
  return props.decayed.includes(actualNumber);
};
const checkMissing = (area: number, toothNumber: number): boolean => {
  let actualNumber = area * 10 + toothNumber;
  return props.missing.includes(actualNumber);
};
const checkFilled = (area: number, toothNumber: number): boolean => {
  let actualNumber = area * 10 + toothNumber;
  return props.filled.includes(actualNumber);
};
const checkHover = (area: number, toothNumber: number): boolean => {
  let actualNumber = area * 10 + toothNumber;
  return toothHover.teeth.includes(actualNumber);
};
const toggleTooth = (area: number, toothNumber: number) => {
  let actualNumber = area * 10 + toothNumber;
  emit('toggle-tooth',actualNumber)
}
onMounted(() => {
  console.log("asdasd");
});
</script>

<style scoped>
@import url("~/assets/components/teeth.scss");
</style>
