<script setup lang="ts">
const { t } = useI18n();
console.log(t("author"));
console.log(useChangeCase("west_hide", "camelCase"));
console.log(import.meta.env);

const data = [
  ...Array(100)
    .fill(0)
    .map((_, index) => ({
      id: `#${index}`,
      A: `A${index}`,
      B: `B${index}`,
      C: `C${index}`,
      D: `D${index}`,
      E: `E${index}`,
      F: `F${index}`,
      G: `G${index}`,
      H: `H${index}`,
      I: `I${index}`,
      J: `J${index}`,
    })),
];

const teleportTo = $ref<HTMLElement>();
const worksheetRef = $ref<HTMLElement>();
const worksheet = new Worksheet({
  // teleport: { teleportTo },
  data,
  primaryKey: "id",
  filter: {
    row: [
      ({ row }) => {
        return row.A.value !== "A2";
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
  const { options } = worksheet;
  options.table.rows.shift();
  options.filter.col.push((col) => col.key !== "B");

  arrayReplace(
    options.sheetClassList.table,
    "border-inherit",
    "border-red-500"
  );

  arrayReplace(options.table.columns[1].classList, [
    ["w-24", "w-40"],
    ["bg-[#f3f3f3]", "bg-red-300"],
  ]);

  console.log(worksheetRef);
  console.log(worksheet);
}

function onReset() {
  const { options } = worksheet;
  arrayReplace(options.sheetClassList.table, [
    ["border-red-500", "border-inherit"],
  ]);

  arrayReplace(options.table.columns[1].classList, [
    ["w-40", "w-24"],
    ["bg-red-300", "bg-[#f3f3f3]"],
  ]);
}
</script>

<template>
  <div class="p-2">
    <div ref="teleportTo">{{ $t("author") }}</div>
    <button class="border mx-2" @click="onClick">Click</button>
    <button class="border mx-2" @click="onReset">Reset</button>
    <div>
      <MyWorksheet ref="worksheetRef" :worksheet="worksheet" />
    </div>
  </div>
</template>
