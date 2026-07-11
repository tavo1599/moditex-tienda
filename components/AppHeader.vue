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

// Desplegable de categorías
const catAbierto = ref(false);

// Menú móvil (hamburguesa)
const menuMovil = ref(false);

// Buscador
const router = useRouter();
const route = useRoute();
// Cerrar el menú móvil al navegar
watch(() => route.fullPath, () => { menuMovil.value = false; });
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
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-24 flex items-center justify-between gap-2">
      <!-- IZQUIERDA -->
      <div class="flex items-center flex-1 min-w-0">
        <!-- Hamburguesa (solo móvil) -->
        <button @click="menuMovil = true" aria-label="Menú" class="md:hidden text-ink p-1 -ml-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>

        <!-- Navegación (solo escritorio) -->
        <nav class="hidden md:flex items-center gap-6 min-w-0 text-[11px] uppercase tracking-widest2 text-clay">
          <NuxtLink to="/" class="hover:text-ink transition-colors whitespace-nowrap">Inicio</NuxtLink>
          <NuxtLink to="/tienda" class="hover:text-ink transition-colors whitespace-nowrap">Tienda</NuxtLink>
          <NuxtLink to="/catalogo" class="hover:text-ink transition-colors whitespace-nowrap">Catálogo</NuxtLink>

          <!-- Desplegable de Categorías -->
          <div
            v-if="(categorias || []).length"
            class="relative"
            @mouseenter="catAbierto = true"
            @mouseleave="catAbierto = false"
          >
            <button class="flex items-center gap-1 hover:text-ink transition-colors whitespace-nowrap uppercase tracking-widest2">
              Categorías
              <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': catAbierto }" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <transition name="drop">
              <div v-if="catAbierto" class="absolute top-full left-0 pt-3 z-50">
                <div class="bg-bone border border-sand rounded-lg shadow-xl py-2 min-w-[13rem] max-h-[70vh] overflow-y-auto">
                  <NuxtLink
                    v-for="c in categorias"
                    :key="c"
                    :to="`/tienda?categoria=${encodeURIComponent(c)}`"
                    @click="catAbierto = false"
                    class="block px-4 py-2.5 text-[11px] uppercase tracking-widest2 text-clay hover:text-ink hover:bg-sand transition-colors whitespace-nowrap"
                  >{{ c }}</NuxtLink>
                </div>
              </div>
            </transition>
          </div>
        </nav>
      </div>

      <!-- CENTRO: en móvil "EW", en escritorio "Essential West" (o el logo al hacer scroll) -->
      <NuxtLink to="/" class="shrink-0 px-2 flex items-center justify-center min-h-[2.5rem]">
        <transition name="brand" mode="out-in">
          <img
            v-if="logoUrl && scrolled"
            key="logo"
            :src="logoUrl"
            alt="Essential West"
            class="h-9 md:h-20 w-auto object-contain"
          />
          <span v-else key="text" class="font-display text-ink/90 leading-none whitespace-nowrap font-normal">
            <span class="md:hidden text-2xl tracking-[0.25em]">EW</span>
            <span class="hidden md:inline text-[2.6rem] tracking-[0.14em]">Essential West</span>
          </span>
        </transition>
      </NuxtLink>

      <!-- DERECHA: buscar + carrito -->
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

    <!-- MENÚ MÓVIL (drawer desde la izquierda) -->
    <transition name="menu">
      <div v-if="menuMovil" class="md:hidden fixed inset-0 z-[80]">
        <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm" @click="menuMovil = false"></div>
        <div class="absolute left-0 top-0 h-full w-72 max-w-[82%] bg-bone shadow-2xl flex flex-col overflow-y-auto">
          <div class="flex items-center justify-between px-5 h-16 border-b border-sand">
            <span class="font-display text-2xl tracking-[0.2em] text-ink/90">EW</span>
            <button @click="menuMovil = false" aria-label="Cerrar" class="text-clay hover:text-ink text-2xl leading-none">&times;</button>
          </div>
          <nav class="flex flex-col px-5 py-4 text-[12px] uppercase tracking-widest2 text-clay">
            <NuxtLink to="/" @click="menuMovil = false" class="py-3 border-b border-sand/60 hover:text-ink">Inicio</NuxtLink>
            <NuxtLink to="/tienda" @click="menuMovil = false" class="py-3 border-b border-sand/60 hover:text-ink">Tienda</NuxtLink>
            <NuxtLink to="/catalogo" @click="menuMovil = false" class="py-3 border-b border-sand/60 hover:text-ink">Catálogo</NuxtLink>
            <p v-if="(categorias || []).length" class="pt-5 pb-2 text-[10px] text-clay/60">Categorías</p>
            <NuxtLink
              v-for="c in categorias"
              :key="c"
              :to="`/tienda?categoria=${encodeURIComponent(c)}`"
              @click="menuMovil = false"
              class="py-2.5 hover:text-ink"
            >{{ c }}</NuxtLink>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.search-enter-active, .search-leave-active { transition: all 0.25s ease; }
.search-enter-from, .search-leave-to { opacity: 0; transform: translateY(-8px); }

/* Desplegable de categorías */
.drop-enter-active, .drop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

/* Cambio elegante entre el wordmark y el logo */
.brand-enter-active, .brand-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.brand-enter-from, .brand-leave-to { opacity: 0; transform: translateY(4px) scale(0.98); }

/* Menú móvil: el velo se desvanece y el panel entra desde la izquierda */
.menu-enter-active, .menu-leave-active { transition: opacity 0.3s ease; }
.menu-enter-active > div:last-child, .menu-leave-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 0.7, 0.3, 1); }
.menu-enter-from, .menu-leave-to { opacity: 0; }
.menu-enter-from > div:last-child, .menu-leave-to > div:last-child { transform: translateX(-100%); }
</style>
