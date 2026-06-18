<script setup lang="ts">
const { items, totalPrecio, totalItems, limpiar } = useCart();
const imagen = useImagen();
const base = useRuntimeConfig().public.apiBase;

// Datos de pago de la tienda (Yape/Plin/cuenta)
const { data: config } = await useAsyncData('checkout-config', () =>
  $fetch<any>(`${base}/tienda/config`).catch(() => ({})),
);

const enviando = ref(false);
const pedidoOk = ref<{ codigo: string; total: number } | null>(null);
const voucherFile = ref<File | null>(null);
const voucherPreview = ref<string | null>(null);
const aceptaTerminos = ref(false);

// Cupón
const cuponInput = ref('');
const cuponAplicado = ref<{ codigo: string; descuento: number } | null>(null);
const cuponError = ref('');
const validandoCupon = ref(false);

const totalConDescuento = computed(() =>
  Math.max(0, totalPrecio.value - (cuponAplicado.value?.descuento || 0)),
);

const aplicarCupon = async () => {
  cuponError.value = '';
  if (!cuponInput.value.trim()) return;
  validandoCupon.value = true;
  try {
    const r = await $fetch<any>(`${base}/tienda/cupon/validar`, {
      method: 'POST',
      body: { codigo: cuponInput.value.trim(), subtotal: totalPrecio.value },
    });
    cuponAplicado.value = { codigo: r.codigo, descuento: r.descuento };
  } catch (e: any) {
    cuponAplicado.value = null;
    cuponError.value = e.data?.message || 'Código no válido.';
  } finally {
    validandoCupon.value = false;
  }
};

const quitarCupon = () => { cuponAplicado.value = null; cuponInput.value = ''; cuponError.value = ''; };

const form = ref({
  clienteNombre: '',
  documento: '',
  telefono: '',
  email: '',
  metodoEntrega: 'ENVIO',
  direccion: '',
  metodoPago: 'YAPE',
  notas: '',
});

const onVoucher = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0] || null;
  voucherFile.value = f;
  voucherPreview.value = f ? URL.createObjectURL(f) : null;
};

const finalizar = async () => {
  if (!form.value.clienteNombre || !form.value.telefono) {
    return alert('Por favor completa tu nombre y teléfono.');
  }
  if (form.value.metodoEntrega === 'ENVIO' && !form.value.direccion) {
    return alert('Ingresa la dirección de envío.');
  }
  if (!aceptaTerminos.value) {
    return alert('Debes aceptar los Términos y Condiciones y la Política de Privacidad para continuar.');
  }
  enviando.value = true;
  try {
    // Enviamos como multipart para incluir el voucher
    const fd = new FormData();
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, String(v)));
    if (cuponAplicado.value) fd.append('cuponCodigo', cuponAplicado.value.codigo);
    fd.append('items', JSON.stringify(items.value.map((i) => ({
      productoId: i.productoId, color: i.color, talla: i.talla, cantidad: i.cantidad,
    }))));
    if (voucherFile.value) fd.append('voucher', voucherFile.value);

    const res = await $fetch<any>(`${base}/tienda/pedido`, { method: 'POST', body: fd });
    pedidoOk.value = { codigo: res.codigo, total: res.total };
    limpiar();
  } catch (e: any) {
    alert('❌ ' + (e.data?.message || 'No se pudo registrar el pedido.'));
  } finally {
    enviando.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-20 min-h-[60vh]">
    <!-- CONFIRMACIÓN -->
    <div v-if="pedidoOk" class="max-w-lg mx-auto text-center py-16">
      <div class="w-16 h-16 rounded-full bg-ink text-bone flex items-center justify-center text-2xl mx-auto mb-6">✓</div>
      <h1 class="text-3xl font-light tracking-tight">¡Pedido recibido!</h1>
      <p class="mt-3 text-clay">Tu código de pedido es</p>
      <p class="text-2xl font-medium tracking-widest2 mt-1">{{ pedidoOk.codigo }}</p>
      <p class="mt-6 text-clay leading-relaxed">
        Validaremos tu pago y te confirmaremos por WhatsApp.
        Total: <span class="text-ink font-medium">S/ {{ pedidoOk.total.toFixed(2) }}</span>
      </p>
      <p class="mt-2 text-clay text-sm">Guarda tu código para seguir tu pedido.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-10">
        <NuxtLink :to="`/seguimiento?codigo=${pedidoOk.codigo}`" class="border border-ink px-8 py-4 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-bone transition-all">
          Seguir mi pedido
        </NuxtLink>
        <NuxtLink to="/tienda" class="px-8 py-4 text-[11px] uppercase tracking-widest2 text-clay hover:text-ink transition-all">
          Seguir comprando
        </NuxtLink>
      </div>
    </div>

    <!-- CARRITO VACÍO -->
    <div v-else-if="!items.length" class="py-24 text-center text-clay">
      <p class="text-sm uppercase tracking-widest2 mb-6">No hay productos para finalizar</p>
      <NuxtLink to="/tienda" class="inline-block border border-ink px-8 py-4 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-bone transition-all">Ir a la tienda</NuxtLink>
    </div>

    <!-- FORMULARIO -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 class="text-3xl font-light tracking-tight mb-8">Finalizar compra</h1>

        <div class="space-y-4">
          <div>
            <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">Nombre completo *</label>
            <input v-model="form.clienteNombre" type="text" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink transition-colors">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">Teléfono *</label>
              <input v-model="form.telefono" type="tel" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink transition-colors">
            </div>
            <div>
              <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">DNI / RUC</label>
              <input v-model="form.documento" type="text" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink transition-colors">
            </div>
          </div>
          <div>
            <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">Correo (opcional)</label>
            <input v-model="form.email" type="email" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink transition-colors">
          </div>

          <div>
            <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">Entrega</label>
            <div class="grid grid-cols-2 gap-3">
              <button @click="form.metodoEntrega = 'ENVIO'" class="p-3 border text-sm transition-all" :class="form.metodoEntrega === 'ENVIO' ? 'bg-ink text-bone border-ink' : 'border-sand hover:border-ink'">Envío a domicilio</button>
              <button @click="form.metodoEntrega = 'RECOJO'" class="p-3 border text-sm transition-all" :class="form.metodoEntrega === 'RECOJO' ? 'bg-ink text-bone border-ink' : 'border-sand hover:border-ink'">Recojo en tienda</button>
            </div>
          </div>

          <div v-if="form.metodoEntrega === 'ENVIO'">
            <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">Dirección de envío *</label>
            <input v-model="form.direccion" type="text" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink transition-colors">
          </div>

          <div>
            <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">Notas (opcional)</label>
            <textarea v-model="form.notas" rows="2" class="w-full border border-sand bg-white p-3 outline-none focus:border-ink transition-colors"></textarea>
          </div>

          <!-- MÉTODO DE PAGO -->
          <div class="pt-4 border-t border-sand">
            <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-3">Método de pago</label>
            <div class="grid grid-cols-3 gap-3">
              <button v-for="m in ['YAPE','PLIN','TRANSFERENCIA']" :key="m" @click="form.metodoPago = m"
                class="p-3 border text-xs uppercase tracking-widest2 transition-all"
                :class="form.metodoPago === m ? 'bg-ink text-bone border-ink' : 'border-sand hover:border-ink'">
                {{ m }}
              </button>
            </div>

            <!-- Datos de pago según método -->
            <div class="mt-4 bg-sand/60 p-4 text-sm">
              <template v-if="form.metodoPago === 'YAPE'">
                <p class="text-clay text-[11px] uppercase tracking-widest2 mb-1">Yapea a este número</p>
                <p class="text-lg font-medium">{{ config?.yape || 'Aún no configurado' }}</p>
              </template>
              <template v-else-if="form.metodoPago === 'PLIN'">
                <p class="text-clay text-[11px] uppercase tracking-widest2 mb-1">Plin a este número</p>
                <p class="text-lg font-medium">{{ config?.plin || 'Aún no configurado' }}</p>
              </template>
              <template v-else>
                <p class="text-clay text-[11px] uppercase tracking-widest2 mb-1">Transferencia a</p>
                <p class="font-medium">{{ config?.cuentaBanco || 'Aún no configurado' }}</p>
                <p v-if="config?.titularCuenta" class="text-clay text-sm mt-1">Titular: {{ config.titularCuenta }}</p>
              </template>
              <p v-if="config?.titularCuenta && form.metodoPago !== 'TRANSFERENCIA'" class="text-clay text-xs mt-1">A nombre de {{ config.titularCuenta }}</p>
            </div>

            <!-- Subir voucher -->
            <div class="mt-4">
              <label class="block text-[11px] uppercase tracking-widest2 text-clay mb-2">Sube tu comprobante (opcional)</label>
              <input type="file" accept="image/*" @change="onVoucher" class="text-sm">
              <img v-if="voucherPreview" :src="voucherPreview" class="mt-3 w-28 h-28 object-cover border border-sand" />
              <p class="text-[11px] text-clay mt-2">Si no lo subes ahora, podrás enviárnoslo por WhatsApp con tu código de pedido.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RESUMEN -->
      <div>
        <div class="border border-sand p-6 sticky top-24">
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-5">Tu pedido ({{ totalItems }})</p>
          <div class="space-y-4 max-h-72 overflow-y-auto">
            <div v-for="(it, i) in items" :key="i" class="flex gap-3">
              <div class="w-14 h-18 bg-sand shrink-0 overflow-hidden">
                <img v-if="imagen(it.imagen)" :src="imagen(it.imagen)!" class="w-full h-full object-cover">
              </div>
              <div class="flex-1 text-sm">
                <p class="font-medium leading-tight">{{ it.nombre }}</p>
                <p class="text-[11px] uppercase tracking-widest2 text-clay mt-1">{{ it.color }} · {{ it.talla }} · x{{ it.cantidad }}</p>
              </div>
              <p class="text-sm whitespace-nowrap">S/ {{ (it.precio * it.cantidad).toFixed(2) }}</p>
            </div>
          </div>
          <!-- Cupón promocional -->
          <div class="border-t border-sand pt-4 mt-5">
            <div v-if="!cuponAplicado" class="flex gap-2">
              <input
                v-model="cuponInput"
                @keyup.enter="aplicarCupon"
                placeholder="Código promocional"
                class="flex-1 border border-sand bg-white p-2.5 text-sm font-mono uppercase outline-none focus:border-ink"
              >
              <button @click="aplicarCupon" :disabled="validandoCupon" class="px-4 text-[11px] uppercase tracking-widest2 border border-ink hover:bg-ink hover:text-bone transition-colors disabled:opacity-50">
                {{ validandoCupon ? '...' : 'Aplicar' }}
              </button>
            </div>
            <div v-else class="flex justify-between items-center bg-sand/60 px-3 py-2">
              <span class="text-sm"><span class="font-mono font-medium">{{ cuponAplicado.codigo }}</span> aplicado</span>
              <button @click="quitarCupon" class="text-[11px] uppercase tracking-widest2 text-clay hover:text-ink">Quitar</button>
            </div>
            <p v-if="cuponError" class="text-[11px] text-red-500 mt-2">{{ cuponError }}</p>
          </div>

          <!-- Totales -->
          <div class="mt-4 space-y-1">
            <div v-if="cuponAplicado" class="flex justify-between text-sm text-clay">
              <span>Subtotal</span><span>S/ {{ totalPrecio.toFixed(2) }}</span>
            </div>
            <div v-if="cuponAplicado" class="flex justify-between text-sm text-emerald-600">
              <span>Descuento</span><span>− S/ {{ cuponAplicado.descuento.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-light pt-2">
              <span>Total</span>
              <span>S/ {{ totalConDescuento.toFixed(2) }}</span>
            </div>
          </div>
          <!-- Aceptación legal (obligatoria) -->
          <label class="flex items-start gap-3 mt-6 cursor-pointer">
            <input type="checkbox" v-model="aceptaTerminos" class="mt-0.5 w-4 h-4 accent-ink shrink-0">
            <span class="text-[11px] text-clay leading-relaxed">
              He leído y acepto los
              <NuxtLink to="/terminos" target="_blank" class="underline hover:text-ink">Términos y Condiciones</NuxtLink>
              y la
              <NuxtLink to="/privacidad" target="_blank" class="underline hover:text-ink">Política de Privacidad</NuxtLink>,
              y autorizo el tratamiento de mis datos personales.
            </span>
          </label>

          <button
            @click="finalizar"
            :disabled="enviando || !aceptaTerminos"
            class="w-full mt-5 px-8 py-4 bg-ink text-bone text-[11px] uppercase tracking-widest2 hover:bg-clay transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ enviando ? 'Enviando…' : 'Confirmar pedido' }}
          </button>
          <p class="text-[11px] text-clay text-center mt-3 leading-relaxed">
            Coordinaremos el pago (Yape / transferencia) contigo tras recibir el pedido.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
