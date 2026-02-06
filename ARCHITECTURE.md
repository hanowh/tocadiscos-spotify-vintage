# 🏗️ Arquitectura del Proyecto

## Visión General

Tocadiscos Virtual es una aplicación web de página única (SPA) que integra el Spotify Web Playback SDK con una interfaz interactiva de tocadiscos vintage.

```
┌─────────────────────────────────────────────────────────────┐
│                     Usuario (Navegador)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Aplicación Web (Frontend)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI/UX      │  │   Tonearm    │  │  Turntable   │      │
│  │ (HTML/CSS)   │  │   Control    │  │  Animation   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Visualizer   │  │  Playlist    │  │     App      │      │
│  │  (Canvas)    │  │   Manager    │  │ Coordinator  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│  ┌──────────────────────┴──────────────────────┐            │
│  │         Spotify Integration Layer           │            │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐    │            │
│  │  │  Auth   │  │   API   │  │  Player  │    │            │
│  │  └─────────┘  └─────────┘  └──────────┘    │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Spotify Services                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ OAuth 2.0    │  │  Web API     │  │  Playback    │      │
│  │  Service     │  │              │  │     SDK      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
tocadiscos-spotify/
│
├── index.html              # Landing page / Login
├── player.html             # Main application
├── callback.html           # OAuth callback handler
├── test.html               # Configuration test page
│
├── css/
│   ├── auth.css           # Login page styles
│   └── styles.css         # Main application styles
│
├── js/
│   ├── config.js          # Configuration (CLIENT_ID, etc.)
│   │
│   ├── spotify/           # Spotify integration
│   │   ├── auth.js        # OAuth 2.0 authentication
│   │   ├── api.js         # Web API wrapper
│   │   └── player.js      # Web Playback SDK wrapper
│   │
│   ├── app.js             # Main application coordinator
│   ├── turntable.js       # Vinyl record logic
│   ├── tonearm.js         # Tonearm interaction
│   ├── visualizer.js      # Audio visualization
│   └── playlist.js        # Playlist management
│
├── assets/                # Future: Audio effects, images
│   ├── sounds/
│   └── images/
│
├── README.md              # Complete documentation
├── QUICK_START.md         # Quick start guide
├── SETUP_CHECKLIST.md     # Setup checklist
├── ARCHITECTURE.md        # This file
├── LICENSE                # MIT License
├── .gitignore             # Git ignore rules
└── server.py              # Development server
```

---

## 🔄 Flujo de Datos

### 1. Autenticación (index.html → callback.html → player.html)

```
User Click "Login"
    │
    ├─→ Generate OAuth URL (auth.js)
    │
    ├─→ Redirect to Spotify
    │
    ├─→ User Authorizes
    │
    ├─→ Redirect to callback.html
    │
    ├─→ Extract access_token from URL
    │
    ├─→ Store in sessionStorage
    │
    └─→ Redirect to player.html
```

### 2. Inicialización (player.html)

```
Page Load
    │
    ├─→ Check Authentication (auth.js)
    │
    ├─→ Initialize Modules
    │   ├─→ Turntable
    │   ├─→ Tonearm
    │   ├─→ Visualizer
    │   └─→ Playlist Manager
    │
    ├─→ Wait for Spotify SDK
    │
    ├─→ Initialize Player (player.js)
    │
    └─→ Load Default Playlist (api.js)
```

### 3. Interacción del Usuario

```
User Drags Tonearm
    │
    ├─→ Mouse/Touch Event (tonearm.js)
    │
    ├─→ Calculate Position & Angle
    │
    ├─→ Check Record Contact
    │
    ├─→ Determine Track Index
    │
    ├─→ onTrackChange Callback
    │
    ├─→ App Coordinator (app.js)
    │
    ├─→ Play Track via Spotify (player.js)
    │
    ├─→ Update UI
    │   ├─→ Turntable Animation
    │   ├─→ Visualizer Start
    │   ├─→ Track Info Display
    │   └─→ Highlight Active Track
    │
    └─→ Fetch Audio Features (api.js)
        │
        └─→ Update Visualizer
```

---

## 🧩 Módulos Principales

### config.js
**Responsabilidad**: Configuración centralizada
- Client ID de Spotify
- Redirect URI
- Scopes de OAuth
- Constantes de la aplicación (ángulos, colores, dimensiones)

### spotify/auth.js
**Responsabilidad**: Autenticación OAuth 2.0
- Gestión de tokens (access_token)
- Verificación de autenticación
- Logout
- Redirección a login

**Flujo**:
```javascript
spotifyAuth.isAuthenticated() → true/false
spotifyAuth.getAccessToken() → token
spotifyAuth.logout() → redirect to login
```

### spotify/api.js
**Responsabilidad**: Llamadas a Spotify Web API
- Obtener playlists del usuario
- Obtener tracks de playlists
- Buscar canciones
- Obtener audio features/analysis
- Wrapper de fetch con autenticación

**Métodos**:
```javascript
spotifyAPI.getUserPlaylists()
spotifyAPI.getPlaylistTracks(playlistId)
spotifyAPI.searchTracks(query)
spotifyAPI.getAudioFeatures(trackId)
```

### spotify/player.js
**Responsabilidad**: Control de reproducción (Spotify Web Playback SDK)
- Inicializar player
- Reproducir tracks
- Control de playback (play, pause, next, prev)
- Control de volumen
- Eventos de estado

**Flujo**:
```javascript
spotifyPlayer.initialize()
    ↓
spotifyPlayer.onReady → deviceId
    ↓
spotifyPlayer.playTrack(uri)
    ↓
spotifyPlayer.onStateChange → update UI
```

### turntable.js
**Responsabilidad**: Animación del disco de vinilo
- Iniciar/detener rotación
- Actualizar album art
- Crear marcadores de tracks
- Resaltar track activo

**Estado**:
```javascript
turntable.isSpinning → boolean
turntable.currentTrackImage → url
```

### tonearm.js
**Responsabilidad**: Interacción del brazo del tocadiscos
- Drag & drop del brazo
- Restricción de movimiento (arco)
- Detección de contacto con el disco
- Cálculo de track index basado en posición
- Callbacks: onTrackChange, onArmLift, onArmDrop

**Flujo de Interacción**:
```
mousedown → isDragging = true
    ↓
mousemove → calculate angle → update position
    ↓
    └→ check record contact
        ↓
        ├→ On Record: calculate track index → onTrackChange
        └→ Off Record: onArmLift
    ↓
mouseup → isDragging = false
```

### visualizer.js
**Responsabilidad**: Visualización de audio
- Dibujar en Canvas
- Generación de valores pseudo-aleatorios sincronizados
- Actualización basada en audio features de Spotify
- Animación a 60 FPS

**Nota**: Debido a restricciones de DRM, no podemos acceder al stream de audio real de Spotify. En su lugar, usamos un visualizador generativo que se sincroniza con:
- Tempo (BPM)
- Energy
- Loudness

**Algoritmo**:
```javascript
requestAnimationFrame:
    generateValues() // Based on tempo, energy, beat phase
        ↓
    smoothValues() // Interpolate for smooth animation
        ↓
    draw() // Render bars in circular pattern
```

### playlist.js
**Responsabilidad**: Gestión de playlists y tracks
- Cargar playlist predeterminada
- Mostrar modal de selección
- Buscar playlists
- Renderizar lista de tracks
- Sincronización con tonearm

**UI Flow**:
```
User clicks "Select Playlist"
    ↓
Load user playlists (API)
    ↓
Display in modal
    ↓
User selects playlist
    ↓
Load tracks (API)
    ↓
Update UI & notify app
    ↓
App updates tonearm & turntable
```

### app.js
**Responsabilidad**: Coordinación general de la aplicación
- Inicialización de todos los módulos
- Gestión de eventos
- Sincronización entre componentes
- Actualización de UI
- Progress tracking

**Ciclo de Vida**:
```
DOMContentLoaded
    ↓
app.init()
    ├→ Check auth
    ├→ Initialize modules
    ├→ Setup event listeners
    ├→ Wait for Spotify SDK
    ├→ Initialize player
    └→ Load playlist
        ↓
    Ready for interaction
        ↓
    User interacts
        ↓
    Handle events → Update state → Update UI
        ↓
beforeunload → cleanup
```

---

## 🎯 Patrones de Diseño

### Singleton Pattern
Todos los módulos principales se instancian como singletons:
```javascript
const spotifyAuth = new SpotifyAuth();
const spotifyAPI = new SpotifyAPI();
const spotifyPlayer = new SpotifyPlayer();
let turntable = new Turntable(...);
let tonearm = new Tonearm(...);
// etc.
```

### Observer Pattern
Callbacks para comunicación entre módulos:
```javascript
tonearm.onTrackChange = (index) => { ... }
tonearm.onArmLift = () => { ... }
spotifyPlayer.onStateChange = (state) => { ... }
playlistManager.onPlaylistChange = (tracks) => { ... }
```

### Module Pattern
Cada archivo JS es un módulo independiente con responsabilidad única (Single Responsibility Principle).

### Coordinator Pattern
`app.js` actúa como coordinador central que:
- Inicializa todos los módulos
- Conecta callbacks
- Sincroniza estados
- Actualiza UI global

---

## 🔐 Seguridad

### OAuth 2.0 Implicit Grant Flow
Usamos Implicit Grant en lugar de Authorization Code para evitar exponer el `client_secret`:
```
index.html: Build auth URL with response_type=token
    ↓
Spotify redirects with #access_token in URL
    ↓
callback.html: Extract token from hash
    ↓
Store in sessionStorage (NOT localStorage)
```

**Ventajas**:
- No requiere backend
- No expone client_secret
- Tokens de corta duración (1 hora)

**Desventajas**:
- Tokens no se pueden refrescar automáticamente
- Usuario debe re-autenticar cada hora

### Almacenamiento de Tokens
```javascript
sessionStorage.setItem('spotify_access_token', token)
// Se borra al cerrar la pestaña
// Más seguro que localStorage
```

### CORS & Same-Origin
Todas las llamadas a Spotify API usan CORS headers correctos. El servidor debe ser HTTP (no file://).

---

## 🎨 Rendering Pipeline

### Turntable Rendering

```
CSS Animation (spin):
    @keyframes spin → rotate(360deg) in 1.8s
        ↓
    Triggered by .playing class
        ↓
    GPU-accelerated (transform: rotate)
```

### Visualizer Rendering

```
requestAnimationFrame (60 FPS):
    ↓
generateValues() → based on beat phase
    ↓
smoothValues() → interpolation
    ↓
draw() → Canvas 2D
    ├→ Clear canvas
    ├→ For each bar:
    │   ├→ Calculate position (circular)
    │   ├→ Create gradient
    │   └→ Draw line
    └→ Request next frame
```

### Tonearm Rendering

```
User drag:
    mousemove → calculate angle → clamp to range
        ↓
    Update CSS transform: rotate(angle)
        ↓
    Smooth transition (CSS transition: 0.3s ease)
```

---

## 📊 Estado de la Aplicación

### Estado Global (app.js)
```javascript
{
    isInitialized: boolean,
    currentTrackIndex: number,
    isPlaying: boolean,
    progressUpdateInterval: intervalId
}
```

### Estado del Player (spotify/player.js)
```javascript
{
    player: Spotify.Player,
    deviceId: string,
    currentTrack: object,
    isPlaying: boolean,
    currentPosition: number,
    duration: number,
    volume: number
}
```

### Estado del Tonearm (tonearm.js)
```javascript
{
    isDragging: boolean,
    isOnRecord: boolean,
    currentAngle: number,
    currentTrackIndex: number,
    tracks: array
}
```

---

## 🔄 Ciclo de Vida de una Canción

```
1. User moves tonearm to position
    ↓
2. tonearm.js calculates track index based on angle
    ↓
3. onTrackChange(index) → app.js
    ↓
4. app.handleTrackChange(index)
    ├→ Get track from playlistManager
    ├→ Update UI (highlight, album art)
    └→ spotifyPlayer.playTrack(uri)
        ↓
5. Spotify starts playback
    ↓
6. player.js receives state change
    ↓
7. onStateChange(state) → app.js
    ↓
8. app.handlePlayerStateChange(state)
    ├→ Update play/pause button
    ├→ Update track info
    ├→ turntable.startSpin()
    └→ visualizer.start()
        ↓
9. Fetch audio features (async)
    ↓
10. visualizer.updateAudioFeatures(features)
    ↓
11. Visualizer adjusts to tempo/energy
```

---

## ⚡ Optimizaciones

### Performance
- CSS animations use `transform` (GPU-accelerated)
- Canvas visualizer uses `requestAnimationFrame`
- Event throttling on mousemove
- Smooth interpolation instead of direct values

### Loading
- Spotify SDK loaded async
- Lazy loading of playlists
- Progressive track loading (max 12 at a time)

### Memory
- Cleanup on page unload
- Session-based token storage
- Limited canvas size (500x500)

---

## 🧪 Testing

### Manual Testing Points

1. **Authentication**
   - Valid token → access granted
   - Expired token → redirect to login
   - Invalid client ID → error message

2. **Player**
   - Track plays when arm touches record
   - Pause when arm lifted
   - Volume control works
   - Next/prev buttons work

3. **UI**
   - Arm draggable
   - Arm constrained to arc
   - Record spins when playing
   - Visualizer animates
   - Track list updates

4. **Playlist**
   - Default playlist loads
   - User can select playlist
   - Search filters playlists
   - Tracks display correctly

### Test Page
`test.html` verifies:
- Server running (not file://)
- Client ID configured
- Redirect URI correct
- Browser compatibility
- Canvas support

---

## 🚀 Deployment

### Local Development
```bash
python server.py
# or
python -m http.server 8080
```

### Production Considerations

**Hosting**:
- Static hosting (Netlify, Vercel, GitHub Pages)
- HTTPS required for production
- Update Redirect URI in Spotify Dashboard

**Configuration**:
- Update `REDIRECT_URI` in config.js
- Add production URL to Spotify Dashboard
- Consider using environment variables

**Backend Option** (for refresh tokens):
```
Client → Your Backend → Spotify
             ↓
      Exchange code for token
             ↓
      Store refresh_token
             ↓
      Auto-refresh when expired
```

---

## 📝 Limitaciones Conocidas

1. **Spotify Premium Required**: Web Playback SDK solo funciona con Premium
2. **Token Expiration**: Tokens expiran en 1 hora (requiere re-login)
3. **No Real Audio Analysis**: DRM previene acceso al stream, usamos generative visualizer
4. **Single Device**: Solo un dispositivo Spotify puede reproducir a la vez
5. **Rate Limits**: API de Spotify tiene límites (30 requests/segundo)
6. **Browser Support**: Safari puede tener problemas con Web Playback SDK

---

## 🔮 Futuras Mejoras

### Features
- [ ] Efectos de sonido (vinyl crackle, needle drop)
- [ ] Múltiples "discos" virtuales
- [ ] Modo aleatorio (shuffle grooves)
- [ ] Queue de reproducción
- [ ] Guardar sesiones favoritas
- [ ] Compartir playlist/disco
- [ ] Temas personalizables

### Técnicas
- [ ] Backend para refresh tokens
- [ ] Real audio analysis (si es posible)
- [ ] Progressive Web App (PWA)
- [ ] Offline mode
- [ ] WebGL visualizer
- [ ] Mobile optimization

---

**Última actualización**: 2024
**Versión**: 1.0.0
