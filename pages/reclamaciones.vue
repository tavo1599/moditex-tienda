<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase;
const { data: config } = await useAsyncData('recl-config', () =>
  $fetch<any>(`${base}/tienda/config`).catch(() => ({})),
);

const enviando = ref(false);
const ok = ref<string | null>(null);

const form = ref({
  nombre: '', documento: '', telefono: '', email: '', direccion: '', menorEdad: false,
  tipoBien: 'PRODUCTO', montoReclamado: '', descripcionBien: '', pedidoCodigo: '',
  tipo: 'RECLAMO', detalle: '', pedidoConsumidor: '',
});

const enviar = async () => {
  if (!form.value.nombre || !form.value.detalle) {
    return alert('Completa tu nombre y el detalle del reclamo.');
  }
  enviando.value = true;
  try {
    const res = await $fetch<any>(`${base}/tienda/reclamacion`, { method: 'POST', body: form.value });
    ok.value = res.codigo;
  } catch (e: any) {
    alert('❌ ' + (e.data?.message || 'No se pudo registrar.'));
  } finally {
    enviando.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
    <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Indecopi</p>
    <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">Libro de Reclamaciones</h1>
    <p class="text-clay text-sm mb-10">
      Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571).
      {{ config?.razonSocial || 'Essential West' }}<span v-if="config?.ruc"> · RUC {{ config.ruc }}</span>
    </p>

    <!-- Confirmación -->
    <div v-if="ok" class="border border-ink p-8 text-center">
      <div class="w-14 h-14 rounded-full bg-ink text-bone flex items-center justify-center text-xl mx-auto mb-4">✓</div>
      <p class="text-lg font-light">Tu hoja de reclamación fue registrada</p>
      <p class="text-2xl font-medium tracking-widest2 mt-2">{{ ok }}</p>
      <p class="text-clay text-sm mt-4">Guarda este código. Te responderemos en el plazo de ley (máx. 15 días hábiles).</p>
      <NuxtLink to="/" class="inline-block mt-8 border border-ink px-8 py-4 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-bone transition-all">Volver al inicio</NuxtLink>
    </div>

    <!-- Formulario -->
    <div v-else class="space-y-10">
      <!-- 1. Consumidor -->
      <section>
        <h2 class="text-[11px] uppercase tracking-widest2 text-ink border-b border-sand pb-2 mb-4">1. Identificación del consumidor</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.nombre" placeholder="Nombre completo *" class="border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
          <input v-model="form.documento" placeholder="DNI / CE" class="border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
          <input v-model="form.telefono" placeholder="Teléfono" class="border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
          <input v-model="form.email" placeholder="Correo electrónico" class="border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
          <input v-model="form.direccion" placeholder="Dirección" class="md:col-span-2 border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
          <label class="flex items-center gap-2 text-sm text-clay"><input type="checkbox" v-model="form.menorEdad" class="accent-ink"> Soy menor de edad</label>
        </div>
      </section>

      <!-- 2. Bien contratado -->
      <section>
        <h2 class="text-[11px] uppercase tracking-widest2 text-ink border-b border-sand pb-2 mb-4">2. Identificación del bien contratado</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex gap-2">
            <button @click="form.tipoBien='PRODUCTO'" class="flex-1 p-3 border text-sm" :class="form.tipoBien==='PRODUCTO'?'bg-ink text-bone border-ink':'border-sand'">Producto</button>
            <button @click="form.tipoBien='SERVICIO'" class="flex-1 p-3 border text-sm" :class="form.tipoBien==='SERVICIO'?'bg-ink text-bone border-ink':'border-sand'">Servicio</button>
          </div>
          <input v-model="form.montoReclamado" placeholder="Monto reclamado (S/)" class="border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
          <input v-model="form.pedidoCodigo" placeholder="Código de pedido (ej. WEB-00001)" class="border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
          <input v-model="form.descripcionBien" placeholder="Descripción del producto/servicio" class="border border-sand bg-white p-3 outline-none focus:border-ink text-sm">
        </div>
      </section>

      <!-- 3. Detalle -->
      <section>
        <h2 class="text-[11px] uppercase tracking-widest2 text-ink border-b border-sand pb-2 mb-4">3. Detalle de la reclamación</h2>
        <div class="space-y-4">
          <div class="flex gap-2">
            <button @click="form.tipo='RECLAMO'" class="flex-1 p-3 border text-sm" :class="form.tipo==='RECLAMO'?'bg-ink text-bone border-ink':'border-sand'">Reclamo (disconformidad con el producto/servicio)</button>
            <button @click="form.tipo='QUEJA'" class="flex-1 p-3 border text-sm" :class="form.tipo==='QUEJA'?'bg-ink text-bone border-ink':'border-sand'">Queja (malestar con la atención)</button>
          </div>
          <textarea v-model="form.detalle" rows="4" placeholder="Describe tu reclamo o queja *" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink text-sm"></textarea>
          <textarea v-model="form.pedidoConsumidor" rows="2" placeholder="Pedido del consumidor (qué solución esperas)" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink text-sm"></textarea>
        </div>
      </section>

      <p class="text-[11px] text-clay">La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para denunciar ante Indecopi.</p>

      <button @click="enviar" :disabled="enviando" class="w-full px-8 py-4 bg-ink text-bone text-[11px] uppercase tracking-widest2 hover:bg-clay transition-colors disabled:opacity-50">
        {{ enviando ? 'Enviando…' : 'Enviar hoja de reclamación' }}
      </button>
    </div>
  </div>
</template>
