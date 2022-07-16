<script setup lang="ts">
const text = $ref("Hello Todo");
</script>

<template>
  <div data-test="test">{{ text }}</div>
</template>
