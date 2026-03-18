# Pintumex Web

Sitio web profesional de Pintumex para catálogo de productos, carrito de compras y confirmación de pedidos por WhatsApp.

## Tabla de contenido

- [Descripción](#descripción)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Rutas principales](#rutas-principales)
- [Flujo del carrito y checkout](#flujo-del-carrito-y-checkout)
- [SEO y archivos públicos](#seo-y-archivos-públicos)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

## Descripción

Este proyecto implementa una tienda web enfocada en productos de pintura y recubrimientos. Incluye:

- Catálogo de productos por categorías.
- Vista de detalle por producto.
- Carrito con sesión del usuario.
- Checkout con guardado de orden en `data/orders.json`.
- Generación de enlace `wa.me` para confirmar pedidos por WhatsApp.
- Secciones informativas: servicios, tiendas, contacto, términos y privacidad.

## Características

- Backend en Node.js + Express.
- Plantillas con EJS.
- Estilos y comportamiento en `public/css/main.css` y `public/js/main.js`.
- Persistencia simple en archivos JSON (`products`, `stores`, `orders`).
- Integración de Google Maps por API Key (opcional).
- SEO local con `robots.txt` y `sitemap.xml`.

## Stack tecnológico

- Node.js
- Express
- EJS
- dotenv
- express-session
- body-parser
- axios
- uuid
- nodemon (desarrollo)

## Estructura del proyecto

```text
PINTUMEX WEB/
|- app.js
|- package.json
|- controllers/
|  |- dataController.js
|  |- whatsappController.js
|- data/
|  |- orders.json
|  |- products.json
|  |- stores.json
|- public/
|  |- robots.txt
|  |- sitemap.xml
|  |- css/
|  |  |- main.css
|  |- images/
|  |- js/
|     |- main.js
|- routes/
|  |- cart.js
|  |- index.js
|  |- products.js
|  |- services.js
|  |- stores.js
|  |- whatsapp.js
|- views/
|  |- 404.ejs
|  |- about.ejs
|  |- cart.ejs
|  |- contact.ejs
|  |- error.ejs
|  |- index.ejs
|  |- layout.ejs
|  |- privacidad.ejs
|  |- product-detail.ejs
|  |- products.ejs
|  |- services.ejs
|  |- stores.ejs
|  |- terminos.ejs
|- .env.example
|- .gitignore
|- package-lock.json
```

## Requisitos

- Node.js 18 o superior recomendado.
- npm 9 o superior recomendado.

## Instalación y ejecución

1. Clonar el repositorio.
2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env` a partir de `.env.example`.
4. Ejecutar en desarrollo:

```bash
npm run dev
```

5. Abrir en navegador:

```text
http://localhost:3000
```

Para producción:

```bash
npm start
```

## Variables de entorno

Usa `.env.example` como referencia.

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno (`development` o `production`) | `development` |
| `GOOGLE_MAPS_API_KEY` | API Key de Google Maps (opcional) | `tu_api_key` |
| `WHATSAPP_PHONE_NUMBER` | Número principal de WhatsApp | `522222941010` |
| `WHATSAPP_SUCURSAL_1` | WhatsApp sucursal 1 | `522222941010` |
| `WHATSAPP_SUCURSAL_2` | WhatsApp sucursal 2 | `522226907000` |
| `ADMIN_EMAIL` | Correo administrativo | `puebla@pintumex.com.mx` |
| `SUPPORT_EMAIL` | Correo de soporte | `sclientes@pintumex.com.mx` |
| `COMPANY_NAME` | Nombre de la empresa | `Pinturas Mexicanas...` |
| `COMPANY_ADDRESS` | Dirección comercial | `Av. del Conde No. 1...` |

## Scripts disponibles

- `npm start`: inicia el servidor con Node.
- `npm run dev`: inicia con `nodemon` para desarrollo.
- `npm test`: script placeholder (actualmente sin pruebas implementadas).

## Rutas principales

### Vistas

- `GET /` Inicio.
- `GET /productos` Catálogo.
- `GET /productos/:id` Detalle de producto.
- `GET /carrito` Carrito.
- `GET /servicios` Servicios.
- `GET /tiendas` Tiendas.
- `GET /contacto` Contacto.
- `GET /acerca-de` Acerca de.
- `GET /terminos` Términos y condiciones.
- `GET /privacidad` Política de privacidad.

### APIs / acciones

- `GET /productos/api/all` Lista de productos en JSON.
- `GET /tiendas/api/all` Lista de tiendas en JSON.
- `POST /carrito/add` Agregar al carrito.
- `POST /carrito/update/:id` Actualizar cantidad.
- `POST /carrito/remove/:id` Eliminar producto.
- `POST /carrito/clear` Vaciar carrito.
- `POST /carrito/checkout` Crear orden y generar enlace WhatsApp.
- `POST /whatsapp/send` Crear enlace de envio a WhatsApp.
- `POST /contacto` Guardar mensaje de contacto.

## Flujo del carrito y checkout

1. El usuario agrega productos al carrito.
2. El carrito se mantiene en sesión (`express-session`).
3. En checkout se capturan datos del cliente.
4. La orden se guarda en `data/orders.json`.
5. Se construye un mensaje con detalle del pedido.
6. Se abre enlace de WhatsApp para confirmar la compra.

## SEO y archivos públicos

- `public/robots.txt`: reglas de rastreo.
- `public/sitemap.xml`: mapa del sitio.
- Metadata y estructura para posicionamiento local en vistas EJS.

## Despliegue

Recomendaciones para producción:

- Configurar `NODE_ENV=production`.
- Definir un `PORT` segun el proveedor de hosting.
- Usar un process manager (por ejemplo PM2) para reinicios automaticos.
- Proteger variables sensibles en el entorno del servidor.
- Configurar HTTPS y cabeceras de seguridad mediante proxy inverso (Nginx o similar).

## Licencia

Proyecto bajo licencia `ISC Axel Gutiérrez`.

---
