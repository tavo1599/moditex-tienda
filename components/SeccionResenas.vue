<script setup lang="ts">
defineProps<{ resenas: any[] }>();
</script>

<template>
  <section v-if="resenas && resenas.length" class="bg-sand">
    <div class="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
      <div class="text-center mb-12">
        <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Lo que dicen</p>
        <h2 class="text-3xl md:text-4xl font-light tracking-tight">Nuestros clientes</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <figure v-for="r in resenas" :key="r.id" class="bg-bone p-8 flex flex-col">
          <div class="text-clay tracking-widest mb-4">
            <span v-for="n in r.estrellas" :key="n">★</span><span v-for="n in (5 - r.estrellas)" :key="'e'+n" class="text-sand">★</span>
          </div>
          <blockquote class="text-ink/80 leading-relaxed flex-1">“{{ r.texto }}”</blockquote>
          <figcaption class="mt-6 text-[11px] uppercase tracking-widest2 text-clay">— {{ r.nombre }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
