<script setup lang="ts">
const route = useRoute();
const base = useRuntimeConfig().public.apiBase;

const codigo = ref((route.query.codigo as string) || '');
const telefono = ref('');
const cargando = ref(false);
const error = ref('');
const pedido = ref<any>(null);

// Etapas del pedido en orden
const ETAPAS = [
  { estado: 'PENDIENTE', titulo: 'Recibido', desc: 'Tu pedido llegó, validando pago' },
  { estado: 'CONFIRMADO', titulo: 'Confirmado', desc: 'Pago validado, preparando' },
  { estado: 'DESPACHADO', titulo: 'Enviado', desc: 'En camino hacia ti' },
  { estado: 'ENTREGADO', titulo: 'Entregado', desc: '¡Disfrútalo!' },
];

const etapaActual = computed(() => {
  if (!pedido.value) return -1;
  if (pedido.value.estado === 'ANULADO') return -2;
  return ETAPAS.findIndex((e) => e.estado === pedido.value.estado);
});

const buscar = async () => {
  if (!codigo.value.trim() || !telefono.value.trim()) {
    error.value = 'Ingresa tu código de pedido y tu teléfono.';
    return;
  }
  cargando.value = true;
  error.value = '';
  pedido.value = null;
  try {
    pedido.value = await $fetch<any>(`${base}/tienda/seguimiento`, {
      method: 'POST',
      body: { codigo: codigo.value.trim(), telefono: telefono.value.trim() },
    });
  } catch (e: any) {
    error.value = e.data?.message || 'No se encontró el pedido.';
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24 min-h-[70vh]">
    <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3 text-center">Seguimiento</p>
    <h1 class="text-3xl md:text-4xl font-light tracking-tight text-center mb-10">Sigue tu pedido</h1>

    <!-- Formulario -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <input v-model="codigo" @keyup.enter="buscar" placeholder="Código (ej. WEB-00001)" class="flex-1 border border-sand bg-white p-3 outline-none focus:border-ink uppercase font-mono">
      <input v-model="telefono" @keyup.enter="buscar" placeholder="Tu teléfono" class="flex-1 border border-sand bg-white p-3 outline-none focus:border-ink">
      <button @click="buscar" :disabled="cargando" class="bg-ink text-bone px-8 py-3 text-[11px] uppercase tracking-widest2 hover:bg-clay transition-colors disabled:opacity-50">
        {{ cargando ? '...' : 'Buscar' }}
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>

    <!-- Resultado -->
    <div v-if="pedido" class="mt-12">
      <div class="flex justify-between items-baseline mb-2">
        <p class="font-mono font-medium text-lg">{{ pedido.codigo }}</p>
        <p class="text-clay text-sm">S/ {{ pedido.total.toFixed(2) }}</p>
      </div>

      <!-- Anulado -->
      <div v-if="etapaActual === -2" class="bg-red-50 border border-red-100 p-6 text-center mt-6">
        <p class="text-red-600 font-medium">Este pedido fue anulado.</p>
      </div>

      <!-- Línea de tiempo -->
      <div v-else class="mt-8 space-y-0">
        <div v-for="(e, i) in ETAPAS" :key="e.estado" class="flex gap-4">
          <!-- Indicador -->
          <div class="flex flex-col items-center">
            <div class="w-4 h-4 rounded-full border-2 transition-colors"
              :class="i <= etapaActual ? 'bg-ink border-ink' : 'bg-bone border-sand'"></div>
            <div v-if="i < ETAPAS.length - 1" class="w-0.5 flex-1 min-h-[40px]"
              :class="i < etapaActual ? 'bg-ink' : 'bg-sand'"></div>
          </div>
          <!-- Texto -->
          <div class="pb-8" :class="i <= etapaActual ? '' : 'opacity-40'">
            <p class="font-medium" :class="i === etapaActual ? 'text-ink' : ''">{{ e.titulo }}</p>
            <p class="text-sm text-clay">{{ e.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="mt-6 border-t border-sand pt-6">
        <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Tu pedido</p>
        <div v-for="(it, i) in pedido.items" :key="i" class="flex justify-between text-sm py-1">
          <span>{{ it.cantidad }}× {{ it.nombre }} <span class="text-clay">({{ it.color }} / {{ it.talla }})</span></span>
        </div>
      </div>
    </div>
  </div>
</template>
