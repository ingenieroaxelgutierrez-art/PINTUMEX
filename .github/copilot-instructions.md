# Instrucciones de Configuración de Pintumex

Este archivo fue autogenerado para guiarte en el proceso de configuración del proyecto.

## Checklist de Configuración

- [x] Estructura de carpetas creada
- [x] Dependencies instaladas (package.json)
- [x] Backend y rutas configuradas
- [x] Vistas EJS creadas
- [x] Estilos CSS implementados
- [x] JavaScript funcional añadido
- [x] Logo agregado en formato .webp
- [x] Google Maps API configurada (pendiente API key)
- [x] WhatsApp wa.me configurado
- [x] Variables de entorno personalizadas
- [x] Base de datos de productos actualizada con precios reales
- [x] Ubicaciones de tiendas actualizadas
- [x] Sistema de carrito directo a WhatsApp implementado
- [x] SEO local optimizado
- [ ] Testeado en desarrollo
- [ ] Listo para deploy

## Mejoras Implementadas

### 1. Sistema de Productos Real
✅ Se actualizó [data/products.json](data/products.json) con 20 productos reales de Pintumex:
- Vinílicas de Alto Desempeño (SUPERVIN 20 AÑOS, CERO SUPERVIN, etc.)
- Vinílicas (ULTRA LUMINOSA, ACAPULCO, OMAR, etc.)  
- Selladores (SELLAVIN 7X1, SELLAVIN ANTIALCALI, etc.)
- Impermeabilizantes (IMPERFIBRA 7 y 10 años, CEMENTO PLÁSTICO, etc.)
- Esmaltes (ESMALUX SR, BIO ESMALUX ECOLÓGICO, etc.)
- Productos para madera (SPAR SR)
- Sanitizante

### 2. Configuración de Tiendas
✅ Se actualizó [data/stores.json](data/stores.json) con:
- Información real de contacto: (222) 294 1010 y (222) 690 7000
- Emails: puebla@pintumex.com.mx y sclientes@pintumex.com.mx
- Enlaces directos a Google Maps proporcionados
- Horarios de atención actualizados

### 3. Sistema WhatsApp wa.me
✅ Implementado sistema directo sin API:
- Dos números de WhatsApp configurados (Sucursal 1 y 2)
- Enlaces wa.me directos desde el carrito
- Botón flotante de WhatsApp en todas las páginas
- Mensajes pre-formateados para pedidos con desglose completo

### 4. Mejoras de Diseño
✅ Colores actualizados basados en Pintumex:
- Rojo principal: #d32f2f
- Rojo oscuro: #b71c1c
- Azul corporativo: #1976d2
- Logo integrado en navbar y footer

### 5. Optimización SEO Local
✅ Implementado:
- Meta tags completos (Open Graph, Twitter Cards)
- Schema.org markup para negocio local
- Geo tags para Puebla, México
- robots.txt y sitemap.xml
- Títulos y descripciones optimizados

## Próximos Pasos

### 1. **Instalar Dependencias**
```bash
npm install
```

### 2. **Configurar API Key de Google Maps (Opcional)**
Edita el archivo `.env` y agrega tu Google Maps API Key:
```env
GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
```
Obtén tu API key en: https://console.cloud.google.com/google/maps-apis

### 3. **Ejecutar en Desarrollo**
```bash
npm run dev
```

### 4. **Acceder a la aplicación**
Abre tu navegador en: http://localhost:3000

### 5. **Preparar para Producción**
```bash
NODE_ENV=production npm start
```

## Funcionalidades Implementadas

### Sistema de Carrito Directo a WhatsApp
1. Los clientes agregan productos al carrito
2. Completan el formulario de checkout con sus datos
3. Al confirmar, se genera un mensaje automático con:
   - Datos del cliente
   - Lista de productos con cantidades y precios
   - Total del pedido
4. Se abre WhatsApp con el mensaje listo para enviar
5. El administrador recibe el pedido y proporciona datos de pago

### Ubicaciones con Google Maps
- Dos sucursales configuradas en Puebla
- Enlaces directos a Google Maps
- Información de contacto y horarios
- Botones de WhatsApp por sucursal

### SEO Local
- Optimizado para búsquedas como "pinturas Puebla"
- Metadatos completos para redes sociales
- Schema markup para aparecer en Google Maps
- Sitemap.xml para mejor indexación

## Estructura de Archivos Actualizada

```
PINTUMEX WEB/
├── data/
│   ├── products.json          ✅ 20 productos reales
│   └── stores.json            ✅ 2 tiendas con datos reales
├── public/
│   ├── images/
│   │   └── logo.webp          ✅ Logo en formato .webp
│   ├── css/
│   │   └── main.css           ✅ Estilos con colores Pintumex
│   ├── js/
│   │   └── main.js            ✅ Sistema de carrito a WhatsApp
│   ├── robots.txt             ✅ SEO
│   └── sitemap.xml            ✅ SEO
├── views/
│   └── layout.ejs             ✅ SEO optimizado, botón WhatsApp
├── controllers/
│   └── whatsappController.js  ✅ Sistema wa.me
├── .env                       ✅ Configuración actualizada
└── .env.example               ✅ Template con variables

```

## Variables de Entorno Configuradas

```env
# Servidor
PORT=3000
NODE_ENV=development

# WhatsApp (No requiere API, usa wa.me)
WHATSAPP_PHONE_NUMBER=522222941010
WHATSAPP_SUCURSAL_1=522222941010
WHATSAPP_SUCURSAL_2=522226907000

# Contacto
ADMIN_EMAIL=puebla@pintumex.com.mx
SUPPORT_EMAIL=sclientes@pintumex.com.mx

# Empresa
COMPANY_NAME=Pinturas Mexicanas de Puebla S.A. de C.V.
COMPANY_ADDRESS=Av. del Conde No. 1, Parque Industrial 5 de Mayo C.P. 72019
```

## Recursos Útiles

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [Google Maps API](https://developers.google.com/maps)
- [WhatsApp Direct Links](https://wa.me/)
- [Schema.org Local Business](https://schema.org/LocalBusiness)
- [Google Search Console](https://search.google.com/search-console)

## Soporte

Para dudas o problemas:
- Email: puebla@pintumex.com.mx
- WhatsApp: +52 222 294 1010

¡Tu aplicación está lista para probarse! 🎨🚀
