<template>
  <div style="display: flex; flex-direction: row">
    <TeethLayout :teeth="teeth" @re-add="removeFromTeeth"></TeethLayout>
    <div>
      <v-text-field v-model="textValue"></v-text-field>
      <v-btn @click="addToTeeth">Add</v-btn>
      <v-btn @click="teeth=[]">Claser</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const teeth = ref<number[]>([]);
const textValue = ref<string>();

const addToTeeth = () => {
  if(textValue.value){
    let teethNumber = parseInt(textValue.value)
    console.log(teethNumber)
    teeth.value.push(teethNumber)
  }
};
const removeFromTeeth = (toothNumbers: number[]) => {
  teeth.value = toothNumbers
};
</script>
