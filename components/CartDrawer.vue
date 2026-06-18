<script setup lang="ts">
const { items, quitar, setCantidad, totalItems, totalPrecio, abierto, cerrar } = useCart();
const imagen = useImagen();

// Bloquear el scroll del fondo mientras el panel está abierto
watch(abierto, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : '';
});
onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = '';
});
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Velo de fondo -->
      <transition name="cart-overlay">
        <div
          v-if="abierto"
          class="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60]"
          @click="cerrar"
        ></div>
      </transition>

      <!-- Panel deslizante -->
      <transition name="cart-drawer">
        <aside
          v-if="abierto"
          class="fixed top-0 right-0 h-full w-full max-w-md bg-bone z-[70] flex flex-col shadow-2xl"
          role="dialog"
          aria-label="Carrito de compras"
        >
          <!-- Cabecera -->
          <div class="flex items-center justify-between px-6 h-20 border-b border-sand shrink-0">
            <p class="text-[12px] uppercase tracking-widest2 text-ink">
              Tu carrito <span class="text-clay">({{ totalItems }})</span>
            </p>
            <button @click="cerrar" aria-label="Cerrar" class="text-clay hover:text-ink transition-colors text-2xl leading-none">&times;</button>
          </div>

          <!-- Vacío -->
          <div v-if="!items.length" class="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <p class="text-clay text-sm">Tu carrito está vacío.</p>
            <NuxtLink
              to="/tienda"
              @click="cerrar"
              class="border border-ink px-8 py-3.5 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-bone transition-all duration-300"
            >Explorar la tienda</NuxtLink>
          </div>

          <!-- Lista de productos -->
          <div v-else class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div v-for="(it, i) in items" :key="i" class="flex gap-4">
              <div class="w-20 h-24 bg-sand shrink-0 overflow-hidden">
                <img v-if="imagen(it.imagen)" :src="imagen(it.imagen)!" :alt="it.nombre" class="w-full h-full object-cover" />
              </div>

              <div class="flex-1 flex flex-col">
                <div class="flex justify-between gap-2">
                  <h3 class="text-sm font-medium leading-tight">{{ it.nombre }}</h3>
                  <button @click="quitar(i)" aria-label="Quitar" class="text-clay hover:text-ink text-xs shrink-0">✕</button>
                </div>
                <p class="text-[11px] uppercase tracking-widest2 text-clay mt-1">{{ it.color }} · {{ it.talla }}</p>

                <div class="mt-auto flex items-center justify-between pt-2">
                  <!-- Selector de cantidad -->
                  <div class="flex items-center border border-sand">
                    <button @click="setCantidad(i, it.cantidad - 1)" class="w-7 h-7 text-clay hover:text-ink hover:bg-sand transition-colors">−</button>
                    <span class="w-8 text-center text-sm">{{ it.cantidad }}</span>
                    <button @click="setCantidad(i, it.cantidad + 1)" class="w-7 h-7 text-clay hover:text-ink hover:bg-sand transition-colors">+</button>
                  </div>
                  <p class="text-sm font-medium">S/ {{ (it.precio * it.cantidad).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pie con total y acciones -->
          <div v-if="items.length" class="border-t border-sand px-6 py-5 shrink-0 space-y-4">
            <div class="flex justify-between items-baseline">
              <span class="text-[11px] uppercase tracking-widest2 text-clay">Subtotal</span>
              <span class="text-lg font-medium">S/ {{ totalPrecio.toFixed(2) }}</span>
            </div>
            <p class="text-[11px] text-clay">Envío e impuestos calculados al finalizar.</p>
            <NuxtLink
              to="/checkout"
              @click="cerrar"
              class="block text-center bg-ink text-bone py-4 text-[11px] uppercase tracking-widest2 hover:bg-clay transition-colors duration-300"
            >Finalizar compra</NuxtLink>
            <button
              @click="cerrar"
              class="w-full text-center py-2 text-[11px] uppercase tracking-widest2 text-clay hover:text-ink transition-colors"
            >Seguir comprando</button>
          </div>
        </aside>
      </transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.cart-overlay-enter-active, .cart-overlay-leave-active { transition: opacity 0.3s ease; }
.cart-overlay-enter-from, .cart-overlay-leave-to { opacity: 0; }

.cart-drawer-enter-active, .cart-drawer-leave-active { transition: transform 0.35s cubic-bezier(0.16, 0.7, 0.3, 1); }
.cart-drawer-enter-from, .cart-drawer-leave-to { transform: translateX(100%); }
</style>
