<script setup lang="ts">
const props = defineProps<{ config?: any }>();
const { totalItems, abrir } = useCart();
const { getCategorias } = useApi();
const imagen = useImagen();
const { data: categorias } = await useAsyncData('categorias', () => getCategorias());

const logoUrl = computed(() => imagen(props.config?.logo));

// Al inicio (sin scroll) se muestra el wordmark "Essential West"; al bajar aparece el logo.
const scrolled = ref(false);
const onScroll = () => { scrolled.value = window.scrollY > 30; };
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); });
onUnmounted(() => window.removeEventListener('scroll', onScroll));

// Buscador
const router = useRouter();
const mostrarBuscador = ref(false);
const termino = ref('');

const buscar = () => {
  const q = termino.value.trim();
  if (!q) return;
  router.push(`/tienda?q=${encodeURIComponent(q)}`);
  mostrarBuscador.value = false;
  termino.value = '';
};

const toggleBuscador = async () => {
  mostrarBuscador.value = !mostrarBuscador.value;
  if (mostrarBuscador.value) {
    await nextTick();
    document.getElementById('input-buscar')?.focus();
  }
};
</script>

<template>
  <header class="sticky top-0 z-40 bg-bone/80 backdrop-blur-md border-b border-sand">
    <div class="max-w-7xl mx-auto px-5 md:px-8 h-20 md:h-24 flex items-center justify-between">
      <!-- Izquierda: navegación -->
      <nav class="hidden md:flex items-center gap-7 flex-1 text-[11px] uppercase tracking-widest2 text-clay">
        <NuxtLink to="/" class="hover:text-ink transition-colors">Inicio</NuxtLink>
        <NuxtLink to="/tienda" class="hover:text-ink transition-colors">Tienda</NuxtLink>
        <NuxtLink to="/catalogo" class="hover:text-ink transition-colors">Catálogo</NuxtLink>
        <NuxtLink
          v-for="c in (categorias || []).slice(0, 3)"
          :key="c"
          :to="`/tienda?categoria=${encodeURIComponent(c)}`"
          class="hover:text-ink transition-colors"
        >{{ c }}</NuxtLink>
      </nav>

      <!-- Centro: arriba el wordmark elegante; al hacer scroll aparece el logo -->
      <NuxtLink to="/" class="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center min-h-[2.5rem]">
        <transition name="brand" mode="out-in">
          <img
            v-if="logoUrl && scrolled"
            key="logo"
            :src="logoUrl"
            alt="Essential West"
            class="h-14 md:h-20 w-auto object-contain"
          />
          <span
            v-else
            key="text"
            class="font-display text-ink/90 leading-none whitespace-nowrap text-3xl md:text-[2.6rem] font-normal tracking-[0.14em]"
          >Essential West</span>
        </transition>
      </NuxtLink>

      <!-- Derecha: buscar + carrito -->
      <div class="flex items-center justify-end gap-4 md:gap-5 flex-1">
        <!-- Lupa -->
        <button @click="toggleBuscador" aria-label="Buscar" class="text-clay hover:text-ink transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </button>

        <button @click="abrir" aria-label="Abrir carrito" class="relative group flex items-center">
          <span class="hidden sm:inline text-[11px] uppercase tracking-widest2 text-clay group-hover:text-ink transition-colors">
            Carrito
          </span>
          <svg class="w-5 h-5 sm:hidden text-clay group-hover:text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-.534 1.872-1.624 2.092-2.852l.668-3.73a.75.75 0 00-.738-.882H5.231" />
          </svg>
          <span
            v-if="totalItems > 0"
            class="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-ink text-bone text-[10px] font-medium"
          >{{ totalItems }}</span>
        </button>
      </div>
    </div>

    <!-- Barra de búsqueda desplegable -->
    <transition name="search">
      <div v-if="mostrarBuscador" class="border-t border-sand bg-bone">
        <div class="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-clay shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            id="input-buscar"
            v-model="termino"
            @keyup.enter="buscar"
            type="text"
            placeholder="Buscar polos, buzos, joggers…"
            class="flex-1 bg-transparent outline-none text-lg font-light placeholder:text-clay/60"
          >
          <button @click="mostrarBuscador = false" class="text-clay hover:text-ink text-sm uppercase tracking-widest2">Cerrar</button>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.search-enter-active, .search-leave-active { transition: all 0.25s ease; }
.search-enter-from, .search-leave-to { opacity: 0; transform: translateY(-8px); }

/* Cambio elegante entre el wordmark y el logo */
.brand-enter-active, .brand-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.brand-enter-from, .brand-leave-to { opacity: 0; transform: translateY(4px) scale(0.98); }
</style>
