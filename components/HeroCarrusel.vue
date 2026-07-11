<script setup lang="ts">
const props = defineProps<{ slides: any[] }>();
const imagen = useImagen();

const actual = ref(0);
let timer: any = null;

const visibles = computed(() => props.slides || []);

const ir = (i: number) => { actual.value = i; reiniciar(); };
const siguiente = () => { actual.value = (actual.value + 1) % visibles.value.length; };

const reiniciar = () => {
  if (timer) clearInterval(timer);
  if (visibles.value.length > 1) timer = setInterval(siguiente, 6000);
};

onMounted(reiniciar);
onBeforeUnmount(() => timer && clearInterval(timer));
</script>

<template>
  <section class="relative h-[68vh] min-h-[420px] md:h-[88vh] md:min-h-[560px] bg-sand overflow-hidden">
    <transition-group name="hero" tag="div">
      <div
        v-for="(s, i) in visibles"
        v-show="i === actual"
        :key="s.id"
        class="absolute inset-0"
      >
        <!-- Fondo: video o imagen -->
        <video
          v-if="s.tipo === 'video'"
          :src="imagen(s.url)!"
          class="absolute inset-0 w-full h-full object-cover"
          autoplay muted loop playsinline
        ></video>
        <img
          v-else
          :src="imagen(s.url)!"
          class="absolute inset-0 w-full h-full object-cover"
          :alt="s.titulo || 'Portada'"
        />
        <!-- Velo para legibilidad del texto (un poco más para que resalte) -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10"></div>

        <!-- Texto -->
        <div class="relative h-full max-w-7xl mx-auto px-5 md:px-8 flex items-center">
          <div v-show="i === actual" :key="'txt-' + actual" class="max-w-xl text-bone hero-legible">
            <p v-if="s.subtitulo" class="hero-text-item text-xs uppercase tracking-widest2 mb-4 font-bold">{{ s.subtitulo }}</p>
            <h1 v-if="s.titulo" class="hero-text-item text-4xl md:text-6xl font-bold leading-tight">{{ s.titulo }}</h1>
            <NuxtLink
              v-if="s.enlace"
              :to="s.enlace"
              class="hero-text-item inline-flex items-center gap-3 mt-8 border-2 border-bone px-8 py-4 text-[11px] uppercase tracking-widest2 font-bold hover:bg-bone hover:text-ink transition-all duration-300"
            >Ver más →</NuxtLink>
          </div>
        </div>
      </div>
    </transition-group>

    <!-- Puntos de navegación -->
    <div v-if="visibles.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      <button
        v-for="(s, i) in visibles"
        :key="s.id"
        @click="ir(i)"
        class="w-2.5 h-2.5 rounded-full transition-all"
        :class="i === actual ? 'bg-bone w-6' : 'bg-bone/50'"
      ></button>
    </div>
  </section>
</template>

<style scoped>
.hero-enter-active, .hero-leave-active { transition: opacity 0.8s ease; }
.hero-enter-from, .hero-leave-to { opacity: 0; }

/* Sombra sutil para que el texto se lea sobre cualquier foto */
.hero-legible {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* Entrada escalonada del texto del hero (desde arriba) */
@keyframes heroIn {
  from { opacity: 0; transform: translateY(-26px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero-text-item {
  opacity: 0;
  animation: heroIn 0.8s cubic-bezier(0.16, 0.7, 0.3, 1) forwards;
}
.hero-text-item:nth-child(1) { animation-delay: 0.15s; }
.hero-text-item:nth-child(2) { animation-delay: 0.32s; }
.hero-text-item:nth-child(3) { animation-delay: 0.52s; }

@media (prefers-reduced-motion: reduce) {
  .hero-text-item { opacity: 1; animation: none; }
}
</style>
