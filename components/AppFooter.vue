<script setup lang="ts">
const props = defineProps<{ config?: any }>();
const imagen = useImagen();
const logoUrl = computed(() => imagen(props.config?.logo));
</script>

<template>
  <footer class="border-t border-sand mt-24">
    <div class="max-w-7xl mx-auto px-5 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
      <div class="col-span-2 md:col-span-1">
        <img v-if="logoUrl" :src="logoUrl" alt="Essential West" class="h-20 md:h-24 w-auto object-contain mb-2" />
        <p v-else class="text-2xl font-light tracking-[0.25em]">ESSENTIAL WEST</p>
        <p class="mt-4 text-sm text-clay leading-relaxed max-w-xs">
          Clásicos para hombre en algodón pima. Calidad textil de principio a fin.
        </p>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-widest2 text-clay mb-4">Tienda</p>
        <ul class="space-y-2 text-sm">
          <li><NuxtLink to="/tienda" class="hover:text-clay transition-colors">Ver todo</NuxtLink></li>
          <li><NuxtLink to="/carrito" class="hover:text-clay transition-colors">Carrito</NuxtLink></li>
          <li><NuxtLink to="/seguimiento" class="hover:text-clay transition-colors">Seguir mi pedido</NuxtLink></li>
        </ul>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-widest2 text-clay mb-4">Legal</p>
        <ul class="space-y-2 text-sm">
          <li><NuxtLink to="/terminos" class="text-clay hover:text-ink transition-colors">Términos y Condiciones</NuxtLink></li>
          <li><NuxtLink to="/privacidad" class="text-clay hover:text-ink transition-colors">Política de Privacidad</NuxtLink></li>
          <li><NuxtLink to="/reclamaciones" class="text-clay hover:text-ink transition-colors">Libro de Reclamaciones</NuxtLink></li>
        </ul>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-widest2 text-clay mb-4">Contacto</p>
        <ul class="space-y-2 text-sm text-clay">
          <li v-if="config?.whatsapp">
            <a :href="`https://wa.me/${String(config.whatsapp).replace(/\\D/g,'')}`" target="_blank" rel="noopener" class="hover:text-ink transition-colors">WhatsApp</a>
          </li>
          <li v-if="config?.instagram">
            <a :href="config.instagram" target="_blank" rel="noopener" class="hover:text-ink transition-colors">Instagram</a>
          </li>
          <li v-if="config?.email">{{ config.email }}</li>
          <li v-if="config?.direccion">{{ config.direccion }}</li>
          <li v-if="config?.horario">{{ config.horario }}</li>
          <li v-if="!config?.whatsapp && !config?.instagram && !config?.email">Próximamente</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-sand">
      <div class="max-w-7xl mx-auto px-5 md:px-8 py-6 text-[11px] uppercase tracking-widest2 text-clay flex justify-between">
        <span>© {{ new Date().getFullYear() }} {{ config?.razonSocial || 'Essential West' }}</span>
        <span>Hecho en Perú</span>
      </div>
    </div>
  </footer>
</template>
