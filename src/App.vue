<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <MyTransition class="scroll-smooth">
        <KeepAlive :max="10">
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <div class="w-screen h-screen">Suspense Fallback...</div>
            </template>
          </Suspense>
        </KeepAlive>
      </MyTransition>
    </template>
  </RouterView>
</template>
