<template>
  <div class="recorder">
    <div class="recorder__record">
      <div class="recorder__record__action-button">
        <div class="recorder__record__action-button__cancel" v-if="isRecording">
          <v-btn
            @click="cancelRecording"
            rounded="circle"
            height="50"
            width="50"
            color="black"
            :ripple="false"
            v-if="isRecording"
          >
            <v-icon icon="mdi-cancel" color="white" size="20" />
          </v-btn>
        </div>
        <div class="recorder__record__action-button__record">
          <v-btn
            @click="toggleRecording"
            rounded="circle"
            height="100"
            width="100"
            :color="recordButtonColor"
            :ripple="false"
            :disabled="props.isLoading"
          >
            <v-progress-circular
              v-if="props.isLoading"
              indeterminate
              :width="3"
              :size="60"
            ></v-progress-circular>
            <v-icon
              icon="mdi-microphone"
              color="black"
              v-if="!isRecording && !props.isLoading"
              size="60"
            />
            <v-icon
              icon="mdi-stop"
              color="white"
              v-if="isRecording && !props.isLoading"
              size="60"
            />
          </v-btn>
        </div>
        <div class="recorder__record__action-button__pause" v-if="isRecording">
          <v-btn
            @click="pauseRecording"
            rounded="circle"
            height="50"
            width="50"
            color="black"
            :ripple="false"
            v-if="isRecording && !paused"
          >
            <v-icon icon="mdi-pause" color="white" size="20" />
          </v-btn>
          <v-btn
            @click="resumeRecording"
            rounded="circle"
            height="50"
            width="50"
            color="#c6dbf3"
            :ripple="false"
            v-if="isRecording && paused"
          >
            <v-icon icon="mdi-play" color="white" size="20" />
          </v-btn>
        </div>
      </div>
      <div class="recorder__record__time">
        <p v-if="isRecording && !props.isLoading && !isError && !isSendError">
          {{ "time limit is 5 minutes" }}
        </p>
        <p v-if="isRecording">
          {{ "time elapse: " + formatTime(elapsedTime) }}
        </p>
        <p v-if="isError" class="recorder__record__time__error-text">
          {{ "error1" }}
        </p>
        <p v-if="isError" class="recorder__record__time__error-text">
          {{ "error 2" }}
        </p>
        <p v-if="isSendError" class="recorder__time__error-text">
          {{ "error 3" }}
        </p>
        <p v-if="props.isLoading">{{ "sending" }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
interface IProps {
  isLoading: boolean;
}
const props = defineProps<IProps>();
const paused = ref<boolean>(false);
let startTime: number = 0;
const elapsedTime = ref<number>(0);
let timerInterval: any = null;
const isRecording = ref(false);
const recordButtonColor = computed(() => {
  const color = isRecording.value ? "#FE363A" : "white";
  return color;
});
let recorder: MediaRecorder | null = null;
const audioChunks = ref<Blob[]>([]);
let pauseStartTime: number | null = null;
const isSendError = ref(false);
const isError = ref(false);
const emit = defineEmits(["change-mode",'setData','toggle-load']);
const isCanceling = ref(false);

const toggleRecording = () => {
  if (!isRecording.value) {
    startRecording();
    isCanceling.value = false;
    emit("change-mode", 1);
  } else {
    stopRecording();
    emit("change-mode", 0);
  }
};

const startRecording = () => {
  isError.value = false;
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorder.ondataavailable = (e: BlobEvent) => {
        if (!paused.value) {
          audioChunks.value.push(e.data);
        }
      };
      recorder.onstop = () => {
        if (!isCanceling.value) {
          emit('toggle-load')
          const audioBlob = new Blob(audioChunks.value, { type: "audio/webm" });
          const randomName = generateRandomName();
          console.log(randomName);
          const formData = new FormData();
     
          formData.append(
            "files",
            audioBlob,
            `recorded_audio_${randomName}.webm`
          );
          $fetch(
            `${config.public.API_BASE_URL}/speech_recognition_to_report`,
            {
              method: "POST",
              body: formData,
            }
          )
            .then((res: any) => {
              if (res.code == 200) {
                console.log(res);
                emit('setData',res)
                emit("change-mode", 2);
              } else {
                console.error("Failed to upload audio");
                isSendError.value = true;
              }
            })
            .catch((error) => {
              console.error("Error uploading audio:", error);
            })
            .finally(() => {
              emit('toggle-load')
            });
          clearInterval(timerInterval);
        }
      };
      recorder.start();
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    })

    .catch((error) => {
      console.error("Error accessing microphone:", error);
    });
  isRecording.value = true;
};

const stopRecording = () => {
  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
  }
  elapsedTime.value = 0;
  isRecording.value = false;
  paused.value = false;
};

const cancelRecording = () => {
  isCanceling.value = true;
  stopRecording();
  emit("change-mode", 0);
};

const pauseRecording = () => {
  if (recorder && recorder.state === "recording") {
    recorder.pause();
    paused.value = true;
    pauseStartTime = Date.now();
    clearInterval(timerInterval);
  }
};

const resumeRecording = () => {
  if (recorder && recorder.state === "paused") {
    recorder.resume();
    paused.value = false;
    if (pauseStartTime) {
      startTime += Date.now() - pauseStartTime; // Update start time to account for paused time
      pauseStartTime = null; // Reset pause start time
      timerInterval = setInterval(updateTimer, 1000);
    }
  }
};

const updateTimer = () => {
  elapsedTime.value = Math.floor((Date.now() - startTime) / 1000);
  if (elapsedTime.value >= 300) {
    stopRecording();
  }
};
const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const generateRandomName = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomName = "";
  for (let i = 0; i < 8; i++) {
    randomName += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomName;
};
</script>

<style scoped>
@import url("~/assets/components/recorder.scss");
</style>
