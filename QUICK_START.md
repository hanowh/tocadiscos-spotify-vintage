# 🚀 Inicio Rápido - Tocadiscos Virtual

## Configuración en 5 Pasos

### 1️⃣ Crear App en Spotify (5 minutos)

1. Abre [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click en **"Create app"**
3. Rellena:
   - Name: `Tocadiscos Virtual`
   - Redirect URI: `http://localhost:8080/callback.html`
4. Guarda y copia el **Client ID**

### 2️⃣ Configurar Client ID

1. Abre `js/config.js`
2. Reemplaza en la línea 6:
   ```javascript
   CLIENT_ID: 'PEGA_TU_CLIENT_ID_AQUI',
   ```

### 3️⃣ Iniciar Servidor

Elige UNA opción:

**Python 3:**
```bash
python server.py
```

**Python (alternativo):**
```bash
python -m http.server 8080
```

**Node.js:**
```bash
npx http-server -p 8080
```

**PHP:**
```bash
php -S localhost:8080
```

### 4️⃣ Abrir en Navegador

```
http://localhost:8080/index.html
```

### 5️⃣ ¡A Disfrutar! 🎵

1. Click en **"Conectar con Spotify"**
2. Autoriza la app
3. Arrastra el brazo sobre el disco
4. ¡Disfruta la música!

---

## ⚠️ Requisitos

- ✅ **Spotify Premium** (obligatorio)
- ✅ Navegador moderno (Chrome recomendado)
- ✅ Servidor web local (ver paso 3)

---

## 🆘 Problemas Comunes

**"Invalid Client"**
- Verifica que el Client ID sea correcto
- Asegúrate que el Redirect URI sea exactamente: `http://localhost:8080/callback.html`

**"Spotify Premium Required"**
- Esta app SOLO funciona con cuentas Premium
- Actualiza tu cuenta en spotify.com

**No reproduce audio**
- Cierra otros dispositivos Spotify
- Usa Chrome (mejor compatibilidad)
- Verifica que el audio del navegador esté activado

---

## 💡 Consejos

- Usa **Chrome** para mejor experiencia
- Arrastra el brazo **lentamente** para control fino
- Prueba con diferentes playlists
- Click en canciones de la lista para saltar directamente

---

## 📖 Documentación Completa

Ver [README.md](README.md) para más detalles.
