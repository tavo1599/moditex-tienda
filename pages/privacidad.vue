<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase;
const { data: config } = await useAsyncData('privacidad-config', () =>
  $fetch<any>(`${base}/tienda/config`).catch(() => ({})),
);
const empresa = computed(() => config.value?.razonSocial || 'Essential West');
const ruc = computed(() => config.value?.ruc || '—');
const email = computed(() => config.value?.email || '');
</script>

<template>
  <div class="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
    <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Legal</p>
    <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">Política de Privacidad</h1>
    <p class="text-clay text-sm mb-10">Última actualización: {{ new Date().toLocaleDateString('es-PE') }}</p>

    <div class="space-y-8 text-ink/80 leading-relaxed text-sm">
      <section>
        <h2 class="text-ink font-medium text-base mb-2">1. Responsable del tratamiento</h2>
        <p><strong>{{ empresa }}</strong> (RUC {{ ruc }}) es responsable del tratamiento de los datos personales que recopilamos a través de esta tienda, conforme a la Ley N° 29733, Ley de Protección de Datos Personales, y su reglamento.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">2. Datos que recopilamos</h2>
        <p>Recopilamos los datos que nos proporcionas al realizar un pedido: nombre, documento de identidad, teléfono, correo electrónico y dirección de entrega. También el comprobante de pago que adjuntes.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">3. Finalidad</h2>
        <p>Usamos tus datos únicamente para: (a) procesar y entregar tu pedido, (b) validar tu pago, (c) coordinar la entrega y atención postventa, y (d) cumplir obligaciones legales. No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">4. Conservación</h2>
        <p>Conservamos tus datos durante el tiempo necesario para cumplir las finalidades indicadas y las obligaciones legales y tributarias aplicables.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">5. Tus derechos (ARCO)</h2>
        <p>Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición sobre tus datos personales escribiéndonos<span v-if="email"> a {{ email }}</span> o por nuestros canales de contacto. Atenderemos tu solicitud en los plazos que establece la ley.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">6. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra acceso no autorizado, pérdida o alteración.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">7. Consentimiento</h2>
        <p>Al marcar la casilla de aceptación y completar tu compra, otorgas tu consentimiento libre, previo, expreso e informado para el tratamiento de tus datos según esta política.</p>
      </section>

      <p class="text-[11px] text-clay border-t border-sand pt-6">
        Este documento es una plantilla referencial. Te recomendamos revisarlo con un asesor legal para adaptarlo a tu operación específica.
      </p>
    </div>
  </div>
</template>
