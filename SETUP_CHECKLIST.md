# ✅ Checklist de Instalación - Tocadiscos Virtual

Use este checklist para asegurarse de que todo está configurado correctamente.

## 📋 Antes de Empezar

- [ ] Tienes una cuenta Spotify **Premium** (obligatorio)
- [ ] Tienes un navegador moderno instalado (Chrome recomendado)
- [ ] Puedes ejecutar un servidor web local (Python, Node.js, o PHP)

---

## 🎯 Pasos de Configuración

### 1. Crear Aplicación Spotify

- [ ] Ir a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- [ ] Hacer login con tu cuenta Spotify
- [ ] Click en "Create app"
- [ ] Completar el formulario:
  - [ ] App name: `Tocadiscos Virtual`
  - [ ] App description: `Aplicación interactiva de tocadiscos`
  - [ ] Redirect URI: `http://localhost:8080/callback.html`
  - [ ] Marcar términos y condiciones
- [ ] Click en "Save"
- [ ] Copiar el **Client ID** (32 caracteres)

### 2. Configurar la Aplicación

- [ ] Abrir el archivo `js/config.js` en un editor de texto
- [ ] Localizar la línea que dice:
  ```javascript
  CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
  ```
- [ ] Reemplazar `YOUR_CLIENT_ID_HERE` con tu Client ID
- [ ] Guardar el archivo
- [ ] Verificar que el `REDIRECT_URI` sea: `http://localhost:8080/callback.html`

### 3. Verificar Archivos del Proyecto

- [ ] Verificar que existe la carpeta `css/`
- [ ] Verificar que existe la carpeta `js/spotify/`
- [ ] Verificar que existe `index.html`
- [ ] Verificar que existe `player.html`
- [ ] Verificar que existe `callback.html`

### 4. Iniciar Servidor Web

Elegir UNA opción:

**Opción A: Python 3**
- [ ] Abrir terminal/CMD en la carpeta del proyecto
- [ ] Ejecutar: `python server.py`
- [ ] Verificar que dice "Server running at: http://localhost:8080"

**Opción B: Python (alternativo)**
- [ ] Ejecutar: `python -m http.server 8080`

**Opción C: Node.js**
- [ ] Ejecutar: `npx http-server -p 8080`

**Opción D: PHP**
- [ ] Ejecutar: `php -S localhost:8080`

### 5. Probar la Configuración

- [ ] Abrir navegador
- [ ] Ir a `http://localhost:8080/test.html`
- [ ] Verificar que todas las pruebas pasen (✓ verdes)
- [ ] Si hay errores (✗ rojos), corregirlos antes de continuar

### 6. Primera Ejecución

- [ ] Ir a `http://localhost:8080/index.html`
- [ ] Hacer click en "Conectar con Spotify"
- [ ] Autorizar la aplicación en Spotify
- [ ] Verificar que redirige a `player.html`
- [ ] Verificar que se carga la playlist predeterminada

### 7. Prueba de Funcionalidades

- [ ] El disco es visible
- [ ] El brazo del tocadiscos es visible
- [ ] Puedo arrastrar el brazo con el mouse
- [ ] Al poner el brazo sobre el disco, empieza la música
- [ ] El disco gira mientras reproduce
- [ ] El visualizador muestra animación
- [ ] Los controles (play/pause, next, prev) funcionan
- [ ] El control de volumen funciona
- [ ] Puedo seleccionar una playlist diferente
- [ ] Al hacer click en una canción, el brazo se mueve
- [ ] Levantar el brazo pausa la música

---

## 🐛 Solución de Problemas

### "Invalid Client" o error de autenticación
- [ ] Verificar que el Client ID sea exactamente el copiado de Spotify Dashboard
- [ ] Verificar que no haya espacios antes o después del Client ID
- [ ] Verificar que el Redirect URI en Spotify Dashboard sea exactamente: `http://localhost:8080/callback.html`

### "Esta función requiere Spotify Premium"
- [ ] Confirmar que tu cuenta es Premium (no Free)
- [ ] Si es necesario, actualizar cuenta en [spotify.com](https://www.spotify.com/premium/)

### No se reproduce audio
- [ ] Cerrar todos los otros dispositivos Spotify activos
- [ ] Verificar que el audio del navegador no esté silenciado
- [ ] Probar en Chrome (mejor compatibilidad)
- [ ] Verificar en Spotify app que el dispositivo "Tocadiscos Virtual" está activo

### Problemas con el servidor
- [ ] Verificar que el puerto 8080 no esté siendo usado por otra aplicación
- [ ] Probar con otro puerto (actualizar config.js y Spotify Dashboard)
- [ ] Verificar que el firewall no esté bloqueando el servidor

### Archivos no se cargan
- [ ] Verificar que estás usando `http://localhost` y NO `file://`
- [ ] Verificar que el servidor está corriendo
- [ ] Verificar la consola del navegador para errores (F12)

---

## 🎉 ¡Listo!

Si completaste todos los pasos y las pruebas pasan, ¡estás listo para disfrutar!

**Próximos pasos:**
1. Explora diferentes playlists
2. Prueba arrastrando el brazo a diferentes velocidades
3. Ajusta el volumen y los controles
4. Disfruta de la música 🎵

---

## 📚 Recursos Adicionales

- **Documentación completa**: Ver [README.md](README.md)
- **Inicio rápido**: Ver [QUICK_START.md](QUICK_START.md)
- **Página de pruebas**: Abrir `http://localhost:8080/test.html`
- **Spotify Developer Docs**: [developer.spotify.com](https://developer.spotify.com/documentation/)

---

## 💡 Consejos Pro

- **Mejor experiencia**: Usa Chrome en desktop
- **Control fino**: Arrastra el brazo despacio para control preciso
- **Explorar playlists**: Prueba con diferentes géneros musicales
- **Modo lista**: Haz click en canciones de la lista para saltar rápidamente
- **Visualizador**: El visualizador se sincroniza con las características de cada canción

---

**¿Problemas?** Revisa la sección de [Solución de Problemas](README.md#-solución-de-problemas) en el README.
