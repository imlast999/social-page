# Social Page — imlast999

Página minimalista de enlaces sociales interactivos con animación de letras dispersas mediante GSAP y distribución orgánica sin solapamiento.

## 🔗 Redes incluidas
- `instagram`
- `twitter`
- `tiktok`
- `telegram`
- `twitch`
- `spotify`
- `steam`
- `roblox`
- `github`
- `ethereum` *(Copia automática de dirección de wallet al portapapeles)*
- `abstract`
- `fomo`

---

## ⚡ Ejecución Local

### Con 1 clic (Windows):
Haz doble clic en `iniciar.bat` en la raíz de la carpeta. Se encarga de comprobar dependencias, arrancar el servidor y abrir el navegador.

### Con terminal:
```bash
npm install
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000).

---

## 🚀 Despliegue en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** > **"Project"**.
3. Selecciona e importa el repositorio: `imlast999/social-page`.
4. Vercel detectará automáticamente la configuración de **Next.js**.
5. Haz clic en **Deploy**. ¡Listo en menos de 1 minuto!

---

## 🌐 Configuración de Dominio Personalizado (Digitalplat / Registrador)

Para conectar tu dominio registrado en Digitalplat a Vercel:

### 1. Añadir el dominio en Vercel:
1. En tu proyecto de Vercel, ve a **Settings** > **Domains**.
2. Escribe tu dominio (ejemplo: `tudominio.com` o `subdominio.tudominio.com`) y haz clic en **Add**.
3. Selecciona si quieres redirigir `www.tudominio.com` a `tudominio.com` (recomendado).

### 2. Configurar los registros DNS en el panel de Digitalplat:

#### Opción A: Registro para dominio principal (`tudominio.com`)
- **Tipo:** `A`
- **Nombre / Host:** `@`
- **Valor / Destino:** `76.76.21.21`

#### Opción B: Registro para `www` o subdominio (`www.tudominio.com` o `links.tudominio.com`)
- **Tipo:** `CNAME`
- **Nombre / Host:** `www` *(o `links`)*
- **Valor / Destino:** `cname.vercel-dns.com`

#### Opción C: Delegar Nameservers a Vercel (opcional para gestión automática de SSL)
En la sección de Servidores DNS de Digitalplat, reemplaza los nameservers actuales por:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

> Una vez guardados los registros DNS en Digitalplat, Vercel validará la configuración y generará automáticamente un certificado SSL HTTPS gratuito en cuestión de minutos.
