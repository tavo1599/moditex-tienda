<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase;
const imagen = useImagen();
// Reusa la misma config que ya carga el layout (mismo key = sin doble pedido)
const { data: config } = await useAsyncData('config-tienda', () =>
  $fetch<any>(`${base}/tienda/config`).catch(() => ({})),
);
const img1 = computed(() => imagen(config.value?.historiaImg1));
const img2 = computed(() => imagen(config.value?.historiaImg2));
</script>

<template>
  <!-- Bloque de marca / historia (estilo editorial) -->
  <section class="bg-ink text-bone">
    <div class="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <p class="text-[11px] uppercase tracking-widest2 text-bone/60 mb-5">Nuestra esencia</p>
        <h2 class="text-3xl md:text-5xl font-light leading-tight">
          Algodón pima,<br /><span class="italic">clásicos para hombre.</span>
        </h2>
        <p class="mt-6 text-bone/70 leading-relaxed max-w-md">
          En Essential West trabajamos con la mejor materia prima: algodón pima peruano,
          reconocido en el mundo por ser suave, fresco y de fibra resistente. Una tela que se
          siente premium desde el primer día y dura mucho más.
        </p>
        <p class="mt-4 text-bone/70 leading-relaxed max-w-md">
          Creamos prendas clásicas para hombre, atemporales y fáciles de combinar.
          Calidad textil de principio a fin, cuidando cada detalle y cada costura.
        </p>
      </div>

      <!-- Mosaico: usa las 2 fotos administrables; si faltan, muestra el placeholder -->
      <div class="grid grid-cols-2 gap-4">
        <div class="aspect-[3/4] bg-clay/30 overflow-hidden flex items-center justify-center">
          <img v-if="img1" :src="img1" alt="Essential West" class="w-full h-full object-cover" />
          <span v-else class="text-7xl font-light text-bone/30">EW</span>
        </div>
        <div class="aspect-[3/4] bg-clay/20 mt-8 overflow-hidden flex items-center justify-center">
          <img v-if="img2" :src="img2" alt="Essential West" class="w-full h-full object-cover" />
          <span v-else class="text-[11px] uppercase tracking-widest2 text-bone/50 rotate-90">Pima</span>
        </div>
      </div>
    </div>
  </section>
</template>
