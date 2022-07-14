<script setup lang="ts">
const data = [
  ...Array(100)
    .fill(0)
    .map((_, index) => ({
      A: `A${index}`,
      B: `B${index}`,
      C: `C${index}`,
      D: `D${index}`,
      E: `E${index}`,
    })),
];

const worksheetRef = $ref<HTMLElement>();
const worksheet = new Worksheet({
  // teleport: { to: "#worksheetId" },
  data,
  filter: {
    row: [
      ({ row }) => {
        return row.A !== "A2";
      },
    ],
    col: [
      (col) => {
        return col.key !== "D";
      },
    ],
  },
});
worksheet.init();

function onClick() {
  const options = worksheet.options;
  options.table.rows.shift();
  options.filter.col.push((col) => col.key !== "B");

  arrayReplace(
    options.sheetClassList.table,
    "border-inherit",
    "border-red-500"
  );

  arrayReplace(options.table.columns[0].classList, [
    ["w-24", "w-40"],
    ["bg-[#f3f3f3]", "bg-red-300"],
  ]);

  console.log(worksheet);
}

function onReset() {
  const options = worksheet.options;
  arrayReplace(options.sheetClassList.table, [
    ["border-red-500", "border-inherit"],
  ]);

  arrayReplace(options.table.columns[0].classList, [
    ["w-40", "w-24"],
    ["bg-red-300", "bg-[#f3f3f3]"],
  ]);
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
