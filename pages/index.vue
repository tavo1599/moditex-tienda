<script setup lang="ts">
const { getProductos } = useApi();
const base = useRuntimeConfig().public.apiBase;

const { data: productos } = await useAsyncData('home-catalogo', () => getProductos());
const { data: slides } = await useAsyncData('home-portada', () =>
  $fetch<any[]>(`${base}/tienda/portada`).catch(() => []),
);
const { data: publicaciones } = await useAsyncData('home-social', () =>
  $fetch<any[]>(`${base}/tienda/publicaciones`).catch(() => []),
);
const { data: banners } = await useAsyncData('home-banner', () =>
  $fetch<any[]>(`${base}/tienda/banner`).catch(() => []),
);
const { data: resenas } = await useAsyncData('home-resenas', () =>
  $fetch<any[]>(`${base}/tienda/resenas`).catch(() => []),
);
const bannerActivo = computed(() => (banners.value && banners.value.length ? banners.value[0] : null));
</script>

<template>
  <div>
    <!-- HERO: carrusel administrable; si no hay slides, hero estático -->
    <HeroCarrusel v-if="slides && slides.length" :slides="slides" />

    <section v-else class="relative h-[88vh] min-h-[560px] bg-sand overflow-hidden flex items-center">
      <div class="absolute inset-0 bg-gradient-to-br from-sand via-bone to-sand"></div>
      <div class="relative max-w-7xl mx-auto px-5 md:px-8 w-full">
        <div class="max-w-xl fade-up">
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-5">Algodón pima · Clásicos para hombre</p>
          <h1 class="text-5xl md:text-7xl font-light leading-[1.05] tracking-tight">
            Prendas que<br />se sienten<br /><span class="italic">propias.</span>
          </h1>
          <p class="mt-6 text-clay max-w-md leading-relaxed">
            Polos, buzos y joggers fabricados con cuidado en cada detalle.
          </p>
          <NuxtLink
            to="/tienda"
            class="inline-flex items-center gap-3 mt-9 border border-ink px-8 py-4 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-bone transition-all duration-300"
          >
            Ver la tienda
            <span>→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- BARRA DE BENEFICIOS -->
    <BarraBeneficios v-reveal:up />

    <!-- COMPRAR POR CATEGORÍA -->
    <ComprarPorCategoria v-if="productos && productos.length" v-reveal:left :productos="productos" />

    <!-- VITRINA -->
    <section class="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
      <div v-reveal:up class="flex items-end justify-between mb-12">
        <div>
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Novedades</p>
          <h2 class="text-3xl md:text-4xl font-light tracking-tight">Lo último</h2>
        </div>
        <NuxtLink to="/tienda" class="text-[11px] uppercase tracking-widest2 text-clay hover:text-ink transition-colors">
          Ver todo →
        </NuxtLink>
      </div>

      <div v-if="productos && productos.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        <ProductCard
          v-for="(p, i) in productos"
          :key="p.id"
          v-reveal:up="(i % 4) * 90"
          :producto="p"
        />
      </div>

      <div v-else class="py-24 text-center text-clay">
        <p class="text-sm uppercase tracking-widest2">Pronto nuevas prendas</p>
      </div>
    </section>

    <!-- BLOQUE DE MARCA / HISTORIA -->
    <BloqueMarca v-reveal:right />

    <!-- BANNER PROMOCIONAL -->
    <BannerPromocional v-if="bannerActivo" v-reveal:zoom :banner="bannerActivo" />

    <!-- RESEÑAS DE CLIENTES -->
    <SeccionResenas v-if="resenas && resenas.length" v-reveal:left :resenas="resenas" />

    <!-- SECCIÓN SOCIAL tipo reels -->
    <SeccionSocial v-if="publicaciones && publicaciones.length" v-reveal:up :publicaciones="publicaciones" />
  </div>
</template>
