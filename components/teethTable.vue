<template>
  <div class="table-container">
    <table>
      <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
        <td
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :class="{ 'pre-filled': rowIndex === 0 || rowIndex === 3 }"
          @mouseenter="setHoverTable(rowIndex, colIndex)"
          @mouseleave="emptyHover"
        >
          <div class="cell-content">
            <span v-if="rowIndex === 0 || rowIndex === 3">{{ cell }}</span>
            <svg v-else-if="cell == 1" class="drawn-x" viewBox="0 0 100 100">
              <line x1="10" y1="10" x2="90" y2="90" />
              <line x1="90" y1="10" x2="10" y2="90" />
            </svg>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { userHoverStore } from "@/stores/toothHover";
interface IProps {
  teethList: number[];
}
const hoverTeeth = userHoverStore();
const props = defineProps<IProps>();
const emit = defineEmits(["re-add"]);
const tableData = computed(() => {
  let tempTable = [
    [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  ];
  props.teethList.forEach((num) => {
    for (let rowIndex = 0; rowIndex < tempTable.length; rowIndex++) {
      const colIndex = tempTable[rowIndex].indexOf(num);
      if (colIndex !== -1) {
        if (rowIndex > 0) {
          tempTable[rowIndex - 1][colIndex] = 1;
        } else if (rowIndex < tempTable.length - 1) {
          tempTable[rowIndex + 1][colIndex] = 1;
        }
      }
    }
  });
  return tempTable;
});
const fillCell = (rowIndex: number, colIndex: number) => {
  console.log(rowIndex, colIndex);
  if (rowIndex != 0 && rowIndex != 3) {
    tableData.value[rowIndex][colIndex] = 1;
    let teethFDI;
    if (rowIndex == 1) teethFDI = tableData.value[0][colIndex];
    else teethFDI = tableData.value[3][colIndex];
    toggleTeeth(teethFDI);
  }
};
const toggleTeeth = (toothNumber: number) => {
  var filteredArray = props.teethList;
  if (props.teethList.includes(toothNumber)) {
    filteredArray = props.teethList.filter((e) => e !== toothNumber);
  } else {
    filteredArray.push(toothNumber);
  }
  emit("re-add", filteredArray);
};
const setHoverTable = (rowIndex: number, colIndex: number) => {
  let exactRow = rowIndex == 1 ? 0 : rowIndex == 2 ? 3 : rowIndex;
  console.log(exactRow);
  const teethFDI = tableData.value[exactRow][colIndex];
  hoverTeeth.setHover([teethFDI]);
};
const emptyHover = () => {
  hoverTeeth.setHover([]);
};
</script>

<style scoped>
@import url("~/assets/components/teethTable.scss");
</style>
