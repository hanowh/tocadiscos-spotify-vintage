# 🔧 Debugging - Reproducción de Archivos Locales

## Problemas Comunes y Soluciones

### 1. No se escucha el audio

**Causas posibles:**
- El navegador bloqueó la reproducción automática
- El volumen está en 0
- El archivo no es compatible
- Error de permisos

**Solución:**
1. Abre la **Consola del Navegador** (F12 → Console)
2. Busca errores en rojo
3. Verifica estos mensajes:
   ```
   ✅ "Loading X files..."
   ✅ "Files loaded: X"
   ✅ "Attempting to play track: [nombre]"
   ✅ "Track playing successfully"
   ✅ "Audio connected to Web Audio API"
   ```

4. Si ves errores como:
   - `"Play failed"` → Click en el botón play manualmente
   - `"Audio playback error"` → El archivo puede estar corrupto
   - `"Permission denied"` → El navegador bloqueó el audio

**Pasos de verificación:**
```javascript
// Pega esto en la consola del navegador:
console.log('Local player:', localPlayer);
console.log('Playlist:', localPlayer.getPlaylist());
console.log('Current mode:', modeManager.getCurrentMode());
```

### 2. El brazo del tocadiscos no funciona

**Causas posibles:**
- Las coordenadas del pivot están mal configuradas
- No hay tracks cargados
- El modo no cambió a "local"

**Solución:**
1. Verifica que estés en modo "Archivos Locales" (botón activo)
2. Verifica en consola:
   ```javascript
   console.log('Tonearm tracks:', tonearm.tracks.length);
   console.log('Current mode:', app.currentMode);
   ```

3. Si no hay tracks, recarga los archivos

### 3. El brazo se mueve pero no reproduce

**Solución:**
1. Verifica en consola cuando mueves el brazo:
   ```
   ✅ "Track changed to: [nombre]"
   ✅ "Attempting to play track..."
   ```

2. Si no ves estos mensajes, el brazo no está llamando al callback correctamente

### 4. Se ve el visualizador pero no hay audio

**Causa:** El audio está conectado al Web Audio API pero no a los altavoces

**Solución:**
- Esto no debería pasar con el código corregido
- Verifica en consola: `console.log('Source node:', localPlayer.sourceNode)`

## Comandos de Debugging

### Verificar estado completo
```javascript
// Pega en la consola:
console.log({
    mode: modeManager?.getCurrentMode(),
    localPlaylist: localPlayer?.getPlaylist(),
    localPlaying: localPlayer?.isPlaying,
    tonearmTracks: tonearm?.tracks?.length,
    appMode: app?.currentMode,
    currentTrack: localPlayer?.getCurrentTrack()
});
```

### Forzar reproducción de primer track
```javascript
// Pega en la consola:
localPlayer.playTrack(0);
```

### Ver volumen actual
```javascript
// Pega en la consola:
console.log('Volume:', localPlayer.gainNode?.gain?.value);
```

### Cambiar volumen manualmente
```javascript
// Pega en la consola:
localPlayer.setVolume(0.8); // 80%
```

## Formatos Soportados

✅ **Soportados:**
- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- M4A (.m4a)
- FLAC (.flac) - depende del navegador

❌ **No soportados:**
- WMA (.wma)
- AAC sin contenedor (.aac)
- Archivos protegidos por DRM

## Navegadores Recomendados

1. **Chrome/Edge** - Mejor compatibilidad
2. **Firefox** - Buena compatibilidad
3. **Safari** - Limitaciones con Web Audio API

## Troubleshooting Paso a Paso

### Test 1: Verificar que se cargaron los archivos
1. Ir a modo "Archivos Locales"
2. Click en "Cargar Archivos"
3. Seleccionar 1-2 archivos MP3
4. Verificar que aparece "X archivos cargados"

### Test 2: Verificar la lista de tracks
1. Scroll down a "Canciones en el disco"
2. Deberías ver tus archivos listados
3. Click en uno → debería reproducirse

### Test 3: Verificar el brazo
1. Arrastra el brazo sobre el disco
2. Debería "engancharse" en una posición
3. Debería empezar a reproducir

### Test 4: Verificar controles
1. Click en Play/Pause → debería pausar/reproducir
2. Click en Next → debería saltar a la siguiente
3. Mover slider de volumen → debería cambiar volumen

## Si nada funciona

1. **Recarga la página** (Ctrl+F5)
2. **Limpia caché del navegador**
3. **Prueba en modo incógnito**
4. **Prueba con un archivo MP3 simple**
5. **Verifica permisos del navegador**

## Logs Importantes

Los logs en consola deberían verse así cuando todo funciona:

```
Loading 3 files...
Audio loaded, duration: 180.5
Audio loaded, duration: 240.2
Audio loaded, duration: 195.8
Files loaded: 3
Mode changed: spotify -> local
Local files ready to play
Track changed to: Mi Canción.mp3
Attempting to play track: Mi Canción.mp3
Audio connected to Web Audio API
Track playing successfully
```

## Contacto/Soporte

Si los problemas persisten, incluye en tu reporte:
1. Mensajes de la consola (F12)
2. Navegador y versión
3. Tipo de archivo que intentas reproducir
4. Pasos exactos para reproducir el problema
