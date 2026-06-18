<script setup lang="ts">
const { items, quitar, setCantidad, totalPrecio, totalItems } = useCart();
const imagen = useImagen();
</script>

<template>
  <div class="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-20 min-h-[60vh]">
    <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-10">Tu carrito</h1>

    <!-- Vacío -->
    <div v-if="!items.length" class="py-24 text-center text-clay">
      <p class="text-sm uppercase tracking-widest2 mb-6">Tu carrito está vacío</p>
      <NuxtLink to="/tienda" class="inline-block border border-ink px-8 py-4 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-bone transition-all">
        Ir a la tienda
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Lista -->
      <div class="lg:col-span-2 divide-y divide-sand">
        <div v-for="(it, i) in items" :key="i" class="py-6 flex gap-5">
          <div class="w-24 h-32 bg-sand shrink-0 overflow-hidden">
            <img v-if="imagen(it.imagen)" :src="imagen(it.imagen)!" :alt="it.nombre" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 flex flex-col">
            <div class="flex justify-between gap-3">
              <div>
                <h3 class="font-medium">{{ it.nombre }}</h3>
                <p class="text-[11px] uppercase tracking-widest2 text-clay mt-1">{{ it.color }} · Talla {{ it.talla }}</p>
              </div>
              <p class="font-medium whitespace-nowrap">S/ {{ (it.precio * it.cantidad).toFixed(2) }}</p>
            </div>

            <div class="mt-auto flex items-center justify-between">
              <!-- Cantidad -->
              <div class="flex items-center border border-sand">
                <button @click="setCantidad(i, it.cantidad - 1)" class="w-9 h-9 hover:bg-sand transition-colors">−</button>
                <span class="w-10 text-center text-sm">{{ it.cantidad }}</span>
                <button @click="setCantidad(i, it.cantidad + 1)" class="w-9 h-9 hover:bg-sand transition-colors">+</button>
              </div>
              <button @click="quitar(i)" class="text-[11px] uppercase tracking-widest2 text-clay hover:text-ink transition-colors">Quitar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="lg:col-span-1">
        <div class="border border-sand p-6 sticky top-24">
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-5">Resumen</p>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-clay">Productos ({{ totalItems }})</span>
            <span>S/ {{ totalPrecio.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm mb-5">
            <span class="text-clay">Envío</span>
            <span class="text-clay">Se calcula al finalizar</span>
          </div>
          <div class="flex justify-between text-lg font-light border-t border-sand pt-4">
            <span>Total</span>
            <span>S/ {{ totalPrecio.toFixed(2) }}</span>
          </div>

          <NuxtLink
            to="/checkout"
            class="block text-center mt-6 px-8 py-4 bg-ink text-bone text-[11px] uppercase tracking-widest2 hover:bg-clay transition-colors duration-300"
          >
            Finalizar compra
          </NuxtLink>
          <NuxtLink to="/tienda" class="block text-center mt-3 text-[11px] uppercase tracking-widest2 text-clay hover:text-ink transition-colors">
            Seguir comprando
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
