<template>
  <div class="container">
    <div
      class="upper-container"
      :class="[
        {
          'upper-container-minimize': mode == 2,
        },
      ]"
    >
      <div
        v-if="mode != 2"
        class="upper-container__page-image"
        :class="[
          {
            'upper-container__page-image-active': mode == 1,
          },
        ]"
      >
        <img src="/img/page.jpg" />
        <div class="upper-container__page-image__overlay-text">
          <div class="page-text" v-if="mode == 0">
            WELCOME TO THE DENTAL SERVICE
          </div>
        </div>
      </div>
      <transition name="fade">
        <div class="upper-container__nav-bar" v-if="mode == 2">
          <div @click="mode = 0" class="upper-container__nav-bar__button">
            <v-icon icon="mdi-chevron-left"></v-icon>
            <span>BACK</span>
          </div>
        </div>
      </transition>
      <div
        v-if="mode != 2"
        class="upper-container__recorder"
        :class="[
          {
            'upper-container__recorder-center': mode == 1,
          },
        ]"
      >
        <div class="upper-container__recorder__top" v-if="mode != 1">
          <div
            class="upper-container__recorder__top__input"
            @click="openFileInput"
          >
            <v-icon icon="mdi-tray-arrow-up"></v-icon> UPLOAD
          </div>
        </div>
        <div class="upper-container__recorder__center">
          <div class="page-text">START A REPORT FROM A VOICE RECORDING</div>
          <div class="page-text"></div>
          <Recorder @change-mode="changeMode" @set-data="setData" :is-loading="isLoading" @toggle-load="toggleLoading"</Recorder>
        </div>
      </div>
      <!-- </transition> -->
    </div>
    <transition name="fade">
      <div class="lower-container">
        <div class="lower-container__teeth-info">
          <div class="lower-container__teeth-info__layout">
            <div class="lower-container__teeth-info__layout__right">RIGHT</div>
            <TeethLayout
            :missing="missing"
            :decayed="decayed"
            :filled="filled"
            @toggle-tooth="processNumber"
            ></TeethLayout>
            <div class="lower-container__teeth-info__layout__left">LEFT</div>
          </div>
          <div class="lower-container__teeth-info__teeth-condition">
            <div v-for="check in conditionChecks">
              <ConditionCheck
                :is-check="check.isCheck"
                :text="check.text"
                :color="check.color"
              />
            </div>
          </div>
          <TeethTable :teeth-list="teeth" @re-add=""></TeethTable>
        </div>
        <div class="lower-container__teeth-treatment">
          <div class="lower-container__teeth-treatment__header">
            List of treatments
          </div>
          <div
            class="lower-container__teeth-treatment__empty-container"
            v-if="treatmentPlan.length == 0"
          >
            There are no treatment for you right now
          </div>
          <div v-else class="lower-container__teeth-treatment__container">
            <div v-for="treatment in treatmentPlan">
              <TreatmentPlan
              :applicable-teeth="treatment.applicableTeeth"
              :treatment="treatment.treatment"
              ></TreatmentPlan>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div class="hidden">
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileInputChange"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
interface ITreatmentPlan {
  treatment: string;
  applicableTeeth: number[];
}
const mode = ref<number>(0);
const missing = ref<number[]>([]);
const decayed = ref<number[]>([]);
const filled = ref<number[]>([]);
const teeth = computed(() => {
  return missing.value.concat(decayed.value, filled.value);
});
const conditionChecks = computed(() => {
  return [
    {
      text: "Missing",
      isCheck: missing.value.length > 0,
      color: "#b09144",
    },
    {
      text: "Decayed",
      isCheck: decayed.value.length > 0,
      color: "#9144b0",
    },
    {
      text: "Filled",
      isCheck: filled.value.length > 0,
      color: "#44b091",
    },
  ];
});
const isLoading = ref<boolean>(false);
const treatmentPlan = ref<ITreatmentPlan[]>([]);
const selectedFile = ref();
const fileInput = ref<any>(null);
const changeMode = (newMode: number) => {
  mode.value = newMode;
};
// const removeFromTeeth = (toothNumbers: number[]) => {
//   teeth.value = toothNumbers;
//   console.log(teeth.value);
// };
// watch((treatmentPlan),()=>{
//   console.log(treatmentPlan.value)
// })
const openFileInput = () => {
  fileInput.value?.click();
};
const handleFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  if (!input.files[0].type.startsWith("audio/")) {
    return;
  }
  selectedFile.value = input.files[0];
  const url = URL.createObjectURL(selectedFile.value);
  const formData = new FormData();
  formData.append("files", selectedFile.value, selectedFile.value.name);
  isLoading.value = true;
  $fetch(`${config.public.API_BASE_URL}/speech_recognition_to_report`, {
    method: "POST",
    body: formData,
  })
    .then((res: any) => {
      if (res.code == 200) {
        setData(res)
        mode.value = 2
      } else {
        console.log('Something happen during the processing')
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      isLoading.value = false;
      input.value = ''
    });
};
const setData = (res: any)=>{
  decayed.value = res.data.status.decayed;
  missing.value = res.data.status.missing;
  filled.value = res.data.status.filled;
  treatmentPlan.value = []
  let tempList: any[] = res.data.treatment;
  treatmentPlan.value = tempList.map(treatment => ({
      treatment: treatment.treatment_name,
      applicableTeeth: treatment.teeth
  }));
  console.log(treatmentPlan.value)
  toggleLoading();
}
const toggleLoading = () => {
  isLoading.value = !isLoading.value
}
const processNumber = (num:any) => {
    const index1 = missing.value.indexOf(num);
    const index2 = decayed.value.indexOf(num);
    const index3 = filled.value.indexOf(num);
    
    if (index1 === -1 && index2 === -1 && index3 === -1) {
        missing.value.push(num);
    } else if (index1 !== -1) {
        missing.value.splice(index1, 1);
        decayed.value.push(num);
    } else if (index2 !== -1) {
        decayed.value.splice(index2, 1);
        filled.value.push(num);
    } else if (index3 !== -1) {
        filled.value.splice(index3, 1);
    }
}
</script>

<style scoped>
@import url("~/assets/pages/D-A01.scss");
</style>
