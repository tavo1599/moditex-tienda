<script setup lang="ts">
const { getProductos } = useApi();
const imagen = useImagen();

const { data: productos } = await useAsyncData('catalogo-productos', () => getProductos());

const flipEl = ref<HTMLElement | null>(null);
const paginaActual = ref(0);
const totalPaginas = ref(0);
const listo = ref(false);
let pageFlip: any = null;

const temporada = computed(() => {
  const y = new Date().getFullYear();
  return `Temporada ${y}`;
});

onMounted(async () => {
  const { PageFlip } = await import('page-flip');
  await nextTick();
  if (!flipEl.value) return;

  pageFlip = new PageFlip(flipEl.value, {
    width: 440,
    height: 600,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 560,
    minHeight: 380,
    maxHeight: 760,
    maxShadowOpacity: 0.5,
    showCover: true,
    usePortrait: true,
    autoSize: true,
    mobileScrollSupport: false,
  });

  pageFlip.loadFromHTML(flipEl.value.querySelectorAll('.page'));
  totalPaginas.value = pageFlip.getPageCount();
  pageFlip.on('flip', (e: any) => { paginaActual.value = e.data; });
  listo.value = true;
});

onBeforeUnmount(() => {
  try { pageFlip?.destroy?.(); } catch { /* ignore */ }
});

const siguiente = () => pageFlip?.flipNext();
const anterior = () => pageFlip?.flipPrev();
</script>

<template>
  <div class="bg-bone min-h-screen py-10 md:py-16 px-4 overflow-hidden">
    <!-- Título -->
    <div class="text-center mb-8 md:mb-10">
      <p class="text-[11px] uppercase tracking-widest2 text-clay mb-2">Catálogo virtual</p>
      <h1 class="font-display text-4xl md:text-5xl font-normal tracking-[0.08em] text-ink/90">Essential West</h1>
      <p class="text-[11px] uppercase tracking-widest2 text-clay mt-3">{{ temporada }}</p>
    </div>

    <ClientOnly>
      <!-- Libro -->
      <div class="flex justify-center">
        <div ref="flipEl" class="catalogo-flip w-full" style="max-width: 1120px;">
          <!-- PORTADA -->
          <div class="page page-cover" data-density="hard">
            <div class="page-content cover">
              <div class="cover-border">
                <p class="text-[11px] uppercase tracking-[0.3em] text-bone/70 mb-6">Essential West</p>
                <h2 class="font-display text-5xl leading-none text-bone mb-4">Catálogo</h2>
                <p class="text-[11px] uppercase tracking-widest2 text-bone/60">{{ temporada }}</p>
                <span class="mt-10 text-[10px] uppercase tracking-widest2 text-bone/50">Desliza para abrir →</span>
              </div>
            </div>
          </div>

          <!-- PRODUCTOS -->
          <div v-for="p in (productos || [])" :key="p.id" class="page">
            <div class="page-content">
              <NuxtLink :to="`/producto/${p.id}`" class="prod-img">
                <img v-if="imagen(p.imagen)" :src="imagen(p.imagen)!" :alt="p.nombre" />
                <span v-else class="img-fallback">{{ (p.nombre || '?').charAt(0) }}</span>
                <span v-if="!p.disponible" class="agotado">Agotado</span>
                <!-- Tallas al costado -->
                <div v-if="p.tallas && p.tallas.length" class="tallas-lateral">
                  <span class="tallas-titulo">Tallas</span>
                  <span v-for="t in p.tallas" :key="t" class="talla-chip">{{ t }}</span>
                </div>
              </NuxtLink>
              <div class="prod-info">
                <p v-if="p.categoria" class="text-[10px] uppercase tracking-widest2 text-clay mb-1">{{ p.categoria }}</p>
                <h3 class="text-lg font-light tracking-tight leading-tight">{{ p.nombre }}</h3>
                <p class="text-base font-medium mt-1">S/ {{ p.precio.toFixed(2) }}</p>
                <NuxtLink :to="`/producto/${p.id}`" class="prod-btn">Ver prenda →</NuxtLink>
              </div>
            </div>
          </div>

          <!-- CONTRAPORTADA -->
          <div class="page page-cover" data-density="hard">
            <div class="page-content cover">
              <div class="cover-border">
                <h2 class="font-display text-4xl leading-tight text-bone mb-5">Gracias por mirar.</h2>
                <p class="text-bone/70 text-sm max-w-[16rem] mb-8">Encuentra todas estas prendas y más en nuestra tienda.</p>
                <NuxtLink to="/tienda" class="inline-block border border-bone/70 text-bone px-8 py-3.5 text-[11px] uppercase tracking-widest2">Ir a la tienda</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles -->
      <div class="flex items-center justify-center gap-8 mt-8 md:mt-10">
        <button @click="anterior" :disabled="paginaActual === 0" aria-label="Anterior"
          class="w-11 h-11 rounded-full border border-sand flex items-center justify-center text-clay hover:text-ink hover:border-ink transition-colors disabled:opacity-30 disabled:hover:border-sand disabled:hover:text-clay">←</button>
        <span class="text-[11px] uppercase tracking-widest2 text-clay tabular-nums">
          {{ paginaActual + 1 }} / {{ totalPaginas || '…' }}
        </span>
        <button @click="siguiente" :disabled="totalPaginas > 0 && paginaActual >= totalPaginas - 1" aria-label="Siguiente"
          class="w-11 h-11 rounded-full border border-sand flex items-center justify-center text-clay hover:text-ink hover:border-ink transition-colors disabled:opacity-30 disabled:hover:border-sand disabled:hover:text-clay">→</button>
      </div>
      <p class="text-center text-[11px] text-clay/70 mt-4">Arrastra las esquinas para pasar las hojas</p>

      <template #fallback>
        <div class="text-center py-24 text-clay text-sm uppercase tracking-widest2">Cargando catálogo…</div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.catalogo-flip { margin: 0 auto; }

/* Cada hoja */
.catalogo-flip :deep(.page) {
  background: #f7f5f2;
  overflow: hidden;
}
.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f5f2;
}

/* Portada / contraportada */
.page-cover .page-content.cover {
  background: #111111;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.cover-border {
  border: 1px solid rgba(247, 245, 242, 0.25);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
}

/* Producto */
.prod-img {
  position: relative;
  display: block;
  flex: 1 1 auto;
  background: #ede9e3;
  overflow: hidden;
}
.prod-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* Tallas en columna, al costado derecho de la foto */
.tallas-lateral {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  z-index: 2;
}
.tallas-titulo {
  font-size: 7px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9a8f82;
  margin-bottom: 0.1rem;
}
.talla-chip {
  min-width: 1.4rem;
  text-align: center;
  background: rgba(247, 245, 242, 0.92);
  border: 1px solid #e0dbd3;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #111;
  padding: 0.18rem 0.3rem;
  backdrop-filter: blur(2px);
}
.img-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 300;
  color: rgba(154, 143, 130, 0.5);
}
.agotado {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(17, 17, 17, 0.8);
  color: #f7f5f2;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
}
.prod-info {
  padding: 1rem 1.25rem 1.5rem;
  text-align: center;
}
.prod-btn {
  display: inline-block;
  margin-top: 0.9rem;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9a8f82;
  border-bottom: 1px solid #ede9e3;
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
}
.prod-btn:hover {
  color: #111111;
  border-color: #111111;
}
</style>
