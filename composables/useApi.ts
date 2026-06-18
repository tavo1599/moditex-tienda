// Conector central al backend NestJS (catálogo público).
export const useApi = () => {
  const base = useRuntimeConfig().public.apiBase;

  return {
    getProductos: (params?: { categoria?: string; q?: string }) =>
      $fetch<any[]>(`${base}/tienda/productos`, { params }),
    getCategorias: () => $fetch<string[]>(`${base}/tienda/categorias`),
    getProducto: (id: number | string) =>
      $fetch<any>(`${base}/tienda/producto/${id}`),
    crearPedido: (payload: any) =>
      $fetch<any>(`${base}/tienda/pedido`, { method: 'POST', body: payload }),
    getPublicaciones: () => $fetch<any[]>(`${base}/tienda/publicaciones`),
  };
};

// Helper: convierte la ruta de imagen del backend en URL absoluta (o null)
export const useImagen = () => {
  const base = useRuntimeConfig().public.apiBase;
  return (ruta?: string | null) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `${base}${ruta.startsWith('/') ? '' : '/'}${ruta}`;
  };
};
