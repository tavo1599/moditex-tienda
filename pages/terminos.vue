<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase;
const { data: config } = await useAsyncData('terminos-config', () =>
  $fetch<any>(`${base}/tienda/config`).catch(() => ({})),
);
const empresa = computed(() => config.value?.razonSocial || 'Essential West');
const ruc = computed(() => config.value?.ruc || '—');
</script>

<template>
  <div class="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
    <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Legal</p>
    <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">Términos y Condiciones</h1>
    <p class="text-clay text-sm mb-10">Última actualización: {{ new Date().toLocaleDateString('es-PE') }}</p>

    <div class="space-y-8 text-ink/80 leading-relaxed text-sm">
      <section>
        <h2 class="text-ink font-medium text-base mb-2">1. Información de la empresa</h2>
        <p>Esta tienda en línea es operada por <strong>{{ empresa }}</strong>, con RUC {{ ruc }} ("Essential West", "nosotros"). Al realizar una compra aceptas estos Términos y Condiciones.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">2. Productos y precios</h2>
        <p>Los precios se muestran en Soles (S/) e incluyen los impuestos de ley cuando corresponde. Las imágenes son referenciales; pueden existir variaciones mínimas de color según la pantalla del dispositivo. Nos reservamos el derecho de modificar precios y disponibilidad sin previo aviso.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">3. Pedidos y pago</h2>
        <p>El pedido se considera confirmado una vez validado el pago (Yape, Plin o transferencia) mediante el comprobante enviado. Mientras el pago no sea verificado, el pedido permanece pendiente y el stock no queda reservado. Nos comunicaremos contigo para coordinar la entrega.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">4. Envíos y entregas</h2>
        <p>Realizamos envíos a nivel nacional a través de agencias de transporte, o entrega en tienda según elija el cliente. Los plazos y costos de envío se informan al coordinar el pedido. Los riesgos de la mercadería se transfieren al cliente al momento de la entrega.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">5. Cambios y devoluciones</h2>
        <p>Aceptamos cambios dentro de los 7 días calendario posteriores a la entrega, siempre que la prenda esté sin uso, con sus etiquetas y en su empaque original. Los costos de envío del cambio corren por cuenta del cliente, salvo defecto de fábrica comprobado. Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571), tienes derecho a reclamar por productos defectuosos.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">6. Libro de Reclamaciones</h2>
        <p>Conforme a la normativa de Indecopi, ponemos a tu disposición nuestro <NuxtLink to="/reclamaciones" class="underline hover:text-ink">Libro de Reclamaciones virtual</NuxtLink> para registrar cualquier queja o reclamo.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">7. Propiedad intelectual</h2>
        <p>Todo el contenido de este sitio (marca, logo, textos, imágenes) es propiedad de {{ empresa }} y está protegido por la legislación vigente. Queda prohibida su reproducción sin autorización.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">8. Protección de datos</h2>
        <p>El tratamiento de tus datos personales se rige por nuestra <NuxtLink to="/privacidad" class="underline hover:text-ink">Política de Privacidad</NuxtLink>, en cumplimiento de la Ley N° 29733, Ley de Protección de Datos Personales.</p>
      </section>

      <section>
        <h2 class="text-ink font-medium text-base mb-2">9. Contacto</h2>
        <p>Para cualquier consulta puedes escribirnos por WhatsApp o a través de los canales indicados en el pie de página.</p>
      </section>

      <p class="text-[11px] text-clay border-t border-sand pt-6">
        Este documento es una plantilla referencial. Te recomendamos revisarlo con un asesor legal para adaptarlo a tu operación específica.
      </p>
    </div>
  </div>
</template>
