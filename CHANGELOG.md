# Changelog - Tocadiscos Spotify Redesign

## 🎨 Rediseño Visual (Estilo Apple)

### Cambios Generales
- **Tema de colores modernizado**: Gradientes púrpura/azul (#667eea, #764ba2, #f093fb)
- **Glassmorphism**: Efectos de vidrio esmerilado con `backdrop-filter: blur()`
- **Animaciones suaves**: Transiciones con `cubic-bezier` para movimientos naturales
- **Sombras mejoradas**: Sistema de sombras multicapa para mayor profundidad
- **Tipografía**: Uso de SF Pro Display/Text (sistema de fuentes de Apple)

### Página de Login (index.html / auth.css)
- Fondo animado con gradiente que se mueve
- Patrón de puntos sutil en el fondo
- Tarjeta de autenticación con glassmorphism
- Botón de Spotify rediseñado con efecto de brillo
- Vinilo animado con colores del nuevo tema
- Features con efectos hover y fondos translúcidos

### Reproductor Principal (player.html / styles.css)
- **Header**: Glassmorphism card con título en degradado
- **Tocadiscos**: Fondo glassmorphism, sombras mejoradas
- **Información de pista**: Card con blur effect y hover animation
- **Barra de progreso**: Diseño moderno con indicador brillante
- **Controles**:
  - Contenedor con glassmorphism y forma de píldora
  - Botones con hover effects y escalado
  - Botón play/pause destacado con gradiente
  - Control de volumen mejorado con slider personalizado
- **Lista de tracks**: Cards individuales con hover states
- **Modal**: Animaciones de entrada, glassmorphism, diseño refinado

### Colores del Sistema
```css
Primary: #667eea (Azul-Púrpura)
Secondary: #764ba2 (Púrpura)
Accent: #f093fb (Rosa-Púrpura claro)
Background: #0f0c29 → #302b63 → #24243e (Gradiente oscuro)
Glass: rgba(255, 255, 255, 0.08-0.15) con blur
```

---

## 🎵 Sistema de Archivos Locales

### Nuevos Archivos
1. **js/localPlayer.js** - Reproductor de archivos locales
   - Carga de archivos MP3, WAV, OGG, M4A, FLAC
   - Lectura de metadata ID3 (título, artista, álbum, carátula)
   - Reproducción con Web Audio API
   - Analyser para visualización en tiempo real
   - Gestión de playlist local

2. **js/modeManager.js** - Gestor de modos
   - Switch entre Spotify y archivos locales
   - UI para cargar/eliminar archivos
   - Contador de archivos cargados
   - Callbacks para sincronización con app

### Características del Modo Local
- ✅ Carga múltiple de archivos
- ✅ Lectura automática de metadata (con jsmediatags)
- ✅ Extracción de carátulas de álbum
- ✅ Visualizador de audio en tiempo real (usando Web Audio API)
- ✅ Controles completos (play, pause, next, prev, volume, seek)
- ✅ Integración con animación del tocadiscos
- ✅ Integración con brazo del tocadiscos
- ✅ Lista de reproducción visual

### Interfaz de Usuario
- **Selector de Modo**: Toggle buttons para cambiar entre Spotify y Local
- **Botón "Cargar Archivos"**: Input de archivos con diseño moderno
- **Botón "Limpiar"**: Elimina todos los archivos locales
- **Contador**: Muestra cantidad de archivos cargados

### Integración
- El tocadiscos funciona igual en ambos modos
- El brazo se mueve sobre el disco para seleccionar pistas
- El visualizador muestra:
  - Datos reales en modo local (Web Audio API)
  - Datos generativos en modo Spotify (sin acceso al stream)
- Los controles funcionan transparentemente en ambos modos

---

## 🔧 Modificaciones Técnicas

### player.html
- Agregado selector de modo (Spotify/Local)
- Agregado sección de archivos locales
- Incluida librería jsmediatags (CDN)
- Agregados scripts: localPlayer.js, modeManager.js

### app.js - Cambios Principales
- `currentMode`: Propiedad para rastrear modo actual
- `initializeSpotifyMode()`: Inicialización específica de Spotify
- `switchToLocalMode()`: Cambio a modo local
- `handleModeChange()`: Callback para cambios de modo
- `handleLocalTrackEnd()`: Auto-play siguiente pista en modo local
- `updateTrackListUI()`: Renderizado dinámico de lista de tracks
- Todas las funciones de control adaptadas para ambos modos:
  - `play()`, `pause()`, `stop()`
  - `nextTrack()`, `previousTrack()`
  - `updateProgress()`
  - `handleTrackChange()`

### visualizer.js
- `connectToAnalyser()`: Conexión a Web Audio API
- `generateRealAudioValues()`: Generación desde analyser real
- `generatePseudoValues()`: Generación algorítmica (Spotify)
- Colores actualizados al nuevo tema

---

## 📦 Dependencias Añadidas

```html
<!-- ID3 Tag Reader -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js"></script>
```

---

## 🚀 Cómo Usar el Modo Local

1. **Abrir el reproductor**
2. **Hacer clic en "Archivos Locales"** en el selector de modo
3. **Hacer clic en "Cargar Archivos"**
4. **Seleccionar archivos de música** (MP3, WAV, OGG, etc.)
5. **Esperar a que se carguen** (se leerá la metadata automáticamente)
6. **Mover el brazo del tocadiscos** sobre el disco para seleccionar y reproducir

### Modo Sin Autenticación
- Si no estás autenticado en Spotify, puedes usar el modo local
- Simplemente carga archivos y disfruta
- Todas las funciones del tocadiscos están disponibles

---

## ✨ Mejoras de UX

1. **Transiciones suaves**: Todos los cambios de estado son animados
2. **Feedback visual**: Hover states en todos los elementos interactivos
3. **Diseño responsive**: Mantiene la funcionalidad en pantallas pequeñas
4. **Loading states**: Indicadores visuales durante la carga
5. **Error handling**: Manejo robusto de errores de carga/reproducción

---

## 🎯 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari (con limitaciones en Web Audio API)
- ✅ Formatos soportados: MP3, WAV, OGG, M4A, FLAC
- ⚠️ Requiere navegador moderno (ES6+)

---

## 📝 Notas Técnicas

### Web Audio API
El modo local utiliza Web Audio API para:
- Reproducción de audio
- Análisis de frecuencias (visualizador)
- Control de volumen (GainNode)

### Gestión de Memoria
- Los archivos se cargan como Object URLs
- Las URLs se revocan al eliminar archivos
- Cleanup automático al cerrar la aplicación

### Limitaciones
- Spotify no permite acceso directo al stream de audio
- El visualizador en modo Spotify es generativo/algorítmico
- El visualizador en modo local es real-time y preciso

---

## 🎨 Paleta de Colores Completa

```css
/* Gradientes Principales */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-accent: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

/* Backgrounds */
--bg-dark: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
--bg-glass: rgba(255, 255, 255, 0.08);
--bg-glass-hover: rgba(255, 255, 255, 0.12);

/* Borders */
--border-glass: rgba(255, 255, 255, 0.12);
--border-focus: rgba(102, 126, 234, 0.5);

/* Shadows */
--shadow-sm: 0 6px 20px rgba(0, 0, 0, 0.15);
--shadow-md: 0 10px 40px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 30px 80px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(102, 126, 234, 0.5);
```

---

## 🔮 Futuras Mejoras Sugeridas

- [ ] Drag & drop para cargar archivos
- [ ] Orden personalizado de playlist local
- [ ] Guardado de playlist local (localStorage)
- [ ] Ecualizador visual
- [ ] Más estilos de visualizador
- [ ] Modo oscuro/claro toggle
- [ ] Atajos de teclado
- [ ] Mini player mode
- [ ] Letras de canciones (lyrics)

---

**Fecha de actualización**: 2026-02-06
**Versión**: 2.0.0 - Apple Design + Local Files
