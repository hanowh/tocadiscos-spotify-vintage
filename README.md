# Tocadiscos Virtual - Spotify Interactive Turntable

Una aplicación web interactiva que simula un tocadiscos vintage integrado con Spotify. Mueve el brazo del tocadiscos para seleccionar y reproducir canciones, con animaciones visuales realistas y efectos de audio.

![Turntable](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 🎵 Características

- **Interacción Realista**: Arrastra el brazo del tocadiscos para seleccionar canciones
- **Integración Spotify**: Reproduce música directamente desde tu cuenta Spotify Premium
- **Visualizador de Audio**: Animación visual que reacciona a las características de la música
- **Animación de Vinilo**: El disco gira mientras reproduce música
- **Selector de Playlist**: Elige entre tus playlists de Spotify o usa la predeterminada
- **Controles Completos**: Play/pause, siguiente/anterior, control de volumen
- **Diseño Vintage**: Estética retro con efectos visuales modernos

## 📋 Requisitos Previos

### Obligatorio:
- **Cuenta Spotify Premium** (la API de reproducción solo funciona con cuentas Premium)
- Navegador moderno (Chrome, Firefox, Edge)
- Servidor web local (para desarrollo)

### Para Configuración:
- Cuenta de desarrollador de Spotify (gratis)
- Client ID de una aplicación Spotify

## 🚀 Configuración

### 1. Crear Aplicación en Spotify

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta Spotify
3. Haz click en **"Create app"**
4. Completa el formulario:
   - **App name**: Tocadiscos Virtual (o el nombre que prefieras)
   - **App description**: Aplicación de tocadiscos interactivo
   - **Redirect URI**: `http://localhost:8080/callback.html`
   - Marca las casillas de términos y condiciones
5. Haz click en **"Save"**
6. En la página de tu aplicación, copia el **Client ID**

### 2. Configurar la Aplicación

1. Abre el archivo `js/config.js`
2. Reemplaza `YOUR_CLIENT_ID_HERE` con tu Client ID:

```javascript
CLIENT_ID: 'tu_client_id_aqui',
```

3. Si vas a usar un puerto diferente a 8080, actualiza también:
   - `REDIRECT_URI` en `config.js`
   - El Redirect URI en tu app de Spotify Developer Dashboard

### 3. Iniciar Servidor Local

Necesitas un servidor web local porque Spotify OAuth requiere un servidor HTTP.

**Opción 1: Python (si lo tienes instalado)**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Opción 2: Node.js (si lo tienes instalado)**
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar
http-server -p 8080
```

**Opción 3: PHP (si lo tienes instalado)**
```bash
php -S localhost:8080
```

**Opción 4: Usar extensión de VS Code**
- Instala "Live Server" extension
- Click derecho en `index.html` → "Open with Live Server"
- Asegúrate que esté en el puerto 8080

### 4. Abrir la Aplicación

1. Abre tu navegador
2. Ve a `http://localhost:8080/index.html`
3. Haz click en **"Conectar con Spotify"**
4. Autoriza la aplicación en Spotify
5. ¡Disfruta del tocadiscos!

## 🎮 Cómo Usar

### Interacción Principal
- **Arrastra el brazo**: Click y arrastra el brazo del tocadiscos sobre el disco
- **Cambia de canción**: Mueve el brazo a diferentes posiciones en el disco
- **Levanta el brazo**: Usa el botón "⛶" o arrastra el brazo fuera del disco para pausar

### Controles
- **▶️ Play/Pause**: Reproducir o pausar la canción actual
- **⏮ Anterior**: Ir a la canción anterior
- **⏭ Siguiente**: Ir a la siguiente canción
- **⛶ Levantar brazo**: Volver el brazo a posición de reposo
- **🔊 Volumen**: Ajustar el volumen de reproducción

### Seleccionar Playlist
1. Haz click en **"Seleccionar Playlist"**
2. Busca o selecciona una playlist de tu biblioteca
3. Las primeras 12 canciones se cargarán en el disco
4. Mueve el brazo para explorar las canciones

### Lista de Canciones
- Click en cualquier canción de la lista para mover el brazo automáticamente
- La canción activa se resalta en verde

## 🏗️ Estructura del Proyecto

```
tocadiscos-spotify/
├── index.html              # Página de login
├── player.html             # Aplicación principal
├── callback.html           # OAuth callback
├── css/
│   ├── auth.css           # Estilos de login
│   └── styles.css         # Estilos del tocadiscos
├── js/
│   ├── config.js          # Configuración (CLIENT_ID)
│   ├── spotify/
│   │   ├── auth.js        # Autenticación OAuth
│   │   ├── api.js         # API calls de Spotify
│   │   └── player.js      # Web Playback SDK wrapper
│   ├── turntable.js       # Lógica del disco
│   ├── tonearm.js         # Lógica del brazo interactivo
│   ├── visualizer.js      # Visualizador de audio
│   ├── playlist.js        # Gestión de playlists
│   └── app.js             # Aplicación principal
└── README.md
```

## 🔧 Tecnologías Utilizadas

- **Spotify Web API**: Para acceder a playlists y metadatos de canciones
- **Spotify Web Playback SDK**: Para reproducir música en el navegador
- **Canvas API**: Para el visualizador de audio
- **Vanilla JavaScript**: Sin frameworks externos
- **CSS3**: Animaciones y diseño responsive

## 🐛 Solución de Problemas

### "Esta función requiere Spotify Premium"
- El Spotify Web Playback SDK solo funciona con cuentas Premium
- Actualiza tu cuenta a Premium para usar esta aplicación

### "Token expired" o redirige al login constantemente
- Los tokens de Spotify expiran después de 1 hora
- Simplemente vuelve a iniciar sesión

### El audio no se reproduce
- Verifica que estés usando Spotify Premium
- Asegúrate de que no haya otro dispositivo de Spotify activo
- Revisa que tu navegador tenga permiso para reproducir audio
- Prueba en Chrome (mejor compatibilidad con Web Playback SDK)

### "Invalid Client" o error de autenticación
- Verifica que el Client ID sea correcto
- Asegúrate de que el Redirect URI coincida exactamente (incluyendo el puerto)
- Revisa que la app esté guardada en Spotify Dashboard

### El visualizador no se mueve
- El visualizador usa un algoritmo generativo (no análisis de audio real)
- Se sincroniza con las características de la canción de Spotify API
- Algunos tracks pueden no tener datos de audio features disponibles

### Errores de CORS
- Asegúrate de estar usando un servidor web (no `file://`)
- El servidor debe estar en `localhost` o `127.0.0.1`

## 📱 Compatibilidad

### Navegadores Soportados:
- ✅ Chrome/Chromium (recomendado)
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (puede tener problemas con Web Playback SDK)

### Dispositivos:
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablets (con soporte táctil)
- ⚠️ Móviles (experiencia limitada por tamaño de pantalla)

## 🎨 Personalización

### Cambiar Playlist Predeterminada
En `js/config.js`, modifica:
```javascript
DEFAULT_PLAYLIST_ID: 'tu_playlist_id_aqui'
```
Para obtener el ID de una playlist:
1. Abre la playlist en Spotify Web
2. El ID está en la URL: `https://open.spotify.com/playlist/ID_AQUI`

### Ajustar Número de Canciones
En `js/config.js`:
```javascript
MAX_TRACKS: 12  // Cambia a 6, 8, 10, etc.
```

### Cambiar Colores
En `js/config.js`, modifica el objeto `COLORS`:
```javascript
COLORS: {
    background: '#2C1810',  // Fondo principal
    vinyl: '#1a1a1a',       // Color del vinilo
    tonearm: '#c0c0c0',     // Color del brazo
    accent: '#d4af37'       // Color de acentos
}
```

## 📝 Notas Técnicas

### Limitaciones
- **DRM**: No podemos acceder directamente al stream de audio de Spotify para análisis de frecuencias real
- **Solución**: Usamos un visualizador generativo basado en las características de audio de Spotify API
- **Un dispositivo**: Solo un dispositivo Spotify puede reproducir a la vez
- **Rate Limits**: La API de Spotify tiene límites de solicitudes

### Seguridad
- Los tokens se almacenan en `sessionStorage` (no en `localStorage`)
- No exponemos el `client_secret` (usamos Implicit Grant Flow)
- La aplicación solo solicita los permisos necesarios

### Rendimiento
- El visualizador usa `requestAnimationFrame` para 60 FPS
- Las animaciones CSS son aceleradas por hardware
- El canvas del visualizador se actualiza eficientemente

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Crea un issue describiendo el problema/sugerencia
2. Fork el repositorio
3. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
4. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
- Inspirado en tocadiscos vintage reales

## 📧 Contacto

Si tienes preguntas o comentarios, no dudes en contactar.

---

**Nota**: Esta es una aplicación de demostración educativa. No está afiliada con Spotify AB.

Hecho con ❤️ y mucha música 🎵
