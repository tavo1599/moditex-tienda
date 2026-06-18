<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase;
const { data: config } = await useAsyncData('config-tienda', () =>
  $fetch<any>(`${base}/tienda/config`).catch(() => ({})),
);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader :config="config" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter :config="config" />
    <BotonWhatsapp :numero="config?.whatsapp" />
    <CartDrawer />
  </div>
</template>
