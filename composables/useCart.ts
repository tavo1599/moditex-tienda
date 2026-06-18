import { computed, watch } from 'vue';

export interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  color: string;
  talla: string;
  cantidad: number;
  imagen?: string | null;
}

// Carrito global (persistido en localStorage en el cliente)
export const useCart = () => {
  const items = useState<CartItem[]>('cart', () => []);

  // Estado del panel lateral (drawer) del carrito
  const abierto = useState<boolean>('cart-open', () => false);
  const abrir = () => { abierto.value = true; };
  const cerrar = () => { abierto.value = false; };
  const toggle = () => { abierto.value = !abierto.value; };

  // Cargar desde localStorage una sola vez en el cliente
  if (import.meta.client && items.value.length === 0) {
    const guardado = localStorage.getItem('moditex_cart');
    if (guardado) {
      try { items.value = JSON.parse(guardado); } catch { /* ignore */ }
    }
  }

  // Persistir en cada cambio (solo cliente)
  if (import.meta.client) {
    watch(items, (val) => {
      localStorage.setItem('moditex_cart', JSON.stringify(val));
    }, { deep: true });
  }

  const agregar = (item: CartItem) => {
    const existente = items.value.find(
      (i) => i.productoId === item.productoId && i.color === item.color && i.talla === item.talla,
    );
    if (existente) existente.cantidad += item.cantidad;
    else items.value.push({ ...item });
    if (import.meta.client) abierto.value = true; // abrir el panel al agregar
  };

  const quitar = (index: number) => items.value.splice(index, 1);

  const setCantidad = (index: number, cantidad: number) => {
    if (cantidad <= 0) quitar(index);
    else items.value[index].cantidad = cantidad;
  };

  const limpiar = () => { items.value = []; };

  const totalItems = computed(() =>
    items.value.reduce((s, i) => s + i.cantidad, 0),
  );
  const totalPrecio = computed(() =>
    items.value.reduce((s, i) => s + i.cantidad * i.precio, 0),
  );

  return { items, agregar, quitar, setCantidad, limpiar, totalItems, totalPrecio, abierto, abrir, cerrar, toggle };
};
