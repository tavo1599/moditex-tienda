<script setup lang="ts">
const props = defineProps<{ producto: any }>();
const imagen = useImagen();
const urlImg = computed(() => imagen(props.producto.imagen));
const urlHover = computed(() => imagen(props.producto.imagenHover));

const inicial = computed(() => (props.producto.nombre || '?').charAt(0).toUpperCase());
</script>

<template>
  <NuxtLink :to="`/producto/${producto.id}`" class="group block">
    <!-- Imagen / placeholder con efecto frente→espalda al pasar el mouse -->
    <div class="relative aspect-[3/4] overflow-hidden bg-sand">
      <img
        v-if="urlImg"
        :src="urlImg"
        :alt="producto.nombre"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        :class="urlHover ? 'group-hover:opacity-0' : 'group-hover:scale-105'"
        loading="lazy"
      />
      <img
        v-if="urlHover"
        :src="urlHover"
        :alt="producto.nombre + ' vista 2'"
        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        loading="lazy"
      />
      <div v-if="!urlImg" class="w-full h-full flex items-center justify-center">
        <span class="text-6xl font-light text-clay/40">{{ inicial }}</span>
      </div>

      <div
        v-if="!producto.disponible"
        class="absolute top-3 left-3 bg-ink/80 text-bone text-[10px] uppercase tracking-widest2 px-3 py-1 z-10"
      >Agotado</div>
    </div>

    <div class="mt-4 flex items-start justify-between gap-3">
      <div>
        <h3 class="text-sm font-medium leading-tight group-hover:text-clay transition-colors">{{ producto.nombre }}</h3>
        <p v-if="producto.categoria" class="text-[11px] uppercase tracking-widest2 text-clay mt-1">{{ producto.categoria }}</p>
      </div>
      <p class="text-sm font-medium whitespace-nowrap">S/ {{ producto.precio.toFixed(2) }}</p>
    </div>
  </NuxtLink>
</template>
