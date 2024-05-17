<template>
  <div class="check">
    <div class="check__square" :style="bgColor">
      <svg
        v-if="isCheck"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path fill="none" stroke="black" stroke-width="2" d="M-2 12l8 8L26 2" />
      </svg>
    </div>
    <div class="check__text">
      {{ props.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  isCheck: boolean;
  text: string;
  color: string;
}
const bgColor = computed(() => "background-color:" + props.color + ";");

const props = defineProps<IProps>();
</script>

<style scoped>
@import url("~/assets/components/conditionCheck.scss");
</style>
