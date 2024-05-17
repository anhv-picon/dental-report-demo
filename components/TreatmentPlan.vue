<template>
  <div class="treatment-container">
    <v-text-field
      label="Treatment Name"
      variant="outlined"
      bg-color="white"
      color="black"
      :hide-details="true"
      v-model="props.treatment"
    ></v-text-field>
    <div class="treatment-container__applicable-teeth">
      Apply to teeth:
      <div class="treatment-container__applicable-teeth__teeth-list" @mouseenter="hoverOver(props.applicableTeeth)" 
      @mouseleave="hoverOver([])">
        {{listText}}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {userHoverStore} from '@/stores/toothHover'

interface IProps {
  treatment: string;
  applicableTeeth: number[];
}
const hoverTeeth = userHoverStore()
const props = defineProps<IProps>()
const treatmentName = ref<string>()
const listText = computed(()=>{
 return props.applicableTeeth.join(', ')
})
onMounted(()=>{
  treatmentName.value = props.treatment
})
const hoverOver = (teethList: number[])=>{
  hoverTeeth.setHover(teethList)
  console.log(hoverTeeth)
}
</script>

<style scoped>
@import url("~/assets/components/treatmentCom.scss");
</style>
