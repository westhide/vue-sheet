<script setup lang="ts">
const data = $ref([
  ...Array(100)
    .fill(0)
    .map((_, index) => ({
      "-": index,
      A: `A${index}`,
      B: `B${index}`,
      C: `C${index}`,
      D: `D${index}`,
      E: `E${index}`,
    })),
]);

const worksheetRef = $ref<HTMLElement>();
const worksheet = new Worksheet({
  // teleport: { to: "#worksheetId" },
  data,
  columns: [],
  rows: [],
  filter(row) {
    return row.A !== "A2";
  },
});
worksheet.init();

function onClick() {
  arrayReplace(
    worksheet.options.classList.table,
    "border-inherit",
    "border-red-500"
  );

  arrayReplace(worksheet.options.columns[0].classList, [
    ["w-24", "w-40"],
    ["", "bg-[#f3f3f3]"],
  ]);
}

function onReset() {
  arrayReplace(worksheet.options.classList.table, [
    ["border-red-500", "border-inherit"],
  ]);

  arrayReplace(worksheet.options.columns[0].classList, [["w-40", "w-24"]]);
  console.log(worksheet);
}
</script>

<template>
  <!--  TODO: set global Layout scroll-smooth-->
  <div class="scroll-smooth">
    <div id="worksheetId" ref="worksheetRef" class="p-2"></div>

    <button @click="onClick" class="border mx-2">Click</button>
    <button @click="onReset" class="border mx-2">Reset</button>
    <div class="p-2">
      <MyWorksheet :worksheet="worksheet" />
    </div>
  </div>
</template>

<style>
#app {
}
</style>
