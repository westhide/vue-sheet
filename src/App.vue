<script setup lang="ts">
import Worksheet from "./core/worksheet";

const data = $ref([
  ...Array(10)
    .fill(0)
    .map((_, index) => ({ "-": index, A: `A${index}`, B: `B${index}` })),
]);

const worksheetRef = $ref<HTMLElement>();
const worksheet = new Worksheet({
  // teleport: { to:"#worksheetId" },
  data,
  columns: [],
});
worksheet.init();
console.log(worksheet);
</script>

<template>
  <div id="worksheetId" ref="worksheetRef" class="p-2"></div>

  <div class="p-2">
    <MyWorksheet :worksheet="worksheet" />
  </div>
</template>

<style>
#app {
}
</style>
