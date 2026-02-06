# 🚀 Primera Ejecución - Tocadiscos Virtual

## 👋 ¡Bienvenido!

Esta guía te llevará paso a paso en tu primera ejecución de Tocadiscos Virtual.

---

## ⏱️ Tiempo estimado: 10 minutos

---

## 📋 Paso 1: Crear Aplicación en Spotify (5 min)

### 1.1 Ir a Spotify Developer Dashboard

```
🌐 Abre: https://developer.spotify.com/dashboard
```

### 1.2 Iniciar Sesión

```
📧 Usa tu cuenta de Spotify (la misma que usarás en la app)
```

### 1.3 Crear Nueva App

```
📱 Click en el botón verde "Create app"
```

### 1.4 Completar Formulario

```
📝 App name:           Tocadiscos Virtual
📝 App description:    Aplicación interactiva de tocadiscos con Spotify
📝 Website:            (dejar vacío o http://localhost:8080)
📝 Redirect URI:       http://localhost:8080/callback.html  ⚠️ EXACTO!
☑️  Marcar términos de servicio
```

### 1.5 Guardar y Copiar Client ID

```
💾 Click en "Save"
📋 En la página de la app, click en "Settings"
📋 Copiar el "Client ID" (32 caracteres)

Ejemplo: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

✅ **Checkpoint**: Tienes tu Client ID copiado

---

## ⚙️ Paso 2: Configurar la Aplicación (2 min)

### 2.1 Abrir archivo de configuración

```
📁 Navega a la carpeta: tocadiscos-spotify
📄 Abre el archivo: js/config.js
```

Puedes usar cualquier editor de texto:
- Notepad (Windows)
- TextEdit (Mac)
- VS Code, Sublime, etc.

### 2.2 Reemplazar Client ID

Busca la línea 6:
```javascript
CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
```

Reemplaza con tu Client ID:
```javascript
CLIENT_ID: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
```

⚠️ **IMPORTANTE**:
- Mantén las comillas simples: `'...'`
- No borres la coma al final: `...',`

### 2.3 Guardar archivo

```
💾 Archivo → Guardar (o Ctrl+S / Cmd+S)
```

✅ **Checkpoint**: config.js está configurado correctamente

---

## 🖥️ Paso 3: Iniciar Servidor (1 min)

### 3.1 Abrir Terminal/CMD

**Windows:**
```
🪟 Presiona: Win + R
⌨️  Escribe: cmd
↵  Enter
```

**Mac/Linux:**
```
🍎 Presiona: Cmd + Espacio
⌨️  Escribe: terminal
↵  Enter
```

### 3.2 Navegar a la carpeta del proyecto

```bash
cd ruta/a/tocadiscos-spotify
```

Ejemplo Windows:
```bash
cd C:\Users\TuNombre\tocadiscos-spotify
```

Ejemplo Mac/Linux:
```bash
cd ~/Downloads/tocadiscos-spotify
```

### 3.3 Iniciar servidor

**Si tienes Python 3:**
```bash
python server.py
```

**Si ves error, prueba:**
```bash
python3 server.py
```

**O usa http-server:**
```bash
python -m http.server 8080
```

### 3.4 Verificar que funciona

Deberías ver algo como:
```
============================================================
  Tocadiscos Virtual - Development Server
============================================================

  Server running at: http://localhost:8080
  Open in browser:   http://localhost:8080/index.html

  Press Ctrl+C to stop the server

============================================================
```

✅ **Checkpoint**: El servidor está corriendo

⚠️ **NO CIERRES ESTA VENTANA** - Mantenla abierta mientras uses la app

---

## 🧪 Paso 4: Verificar Configuración (1 min)

### 4.1 Abrir navegador

```
🌐 Abre Chrome, Firefox, o Edge (recomendado: Chrome)
```

### 4.2 Ir a página de test

```
🔗 http://localhost:8080/test.html
```

### 4.3 Verificar resultados

Deberías ver:
- ✅ Todas las pruebas en VERDE
- ✅ "Client ID configurado"
- ✅ "Servidor web detectado"
- ✅ "Navegador recomendado"

Si ves ❌ ROJO:
- Lee el mensaje de error
- Corrige el problema
- Recarga la página (F5)

✅ **Checkpoint**: Todas las pruebas pasan

---

## 🎵 Paso 5: ¡Primera Ejecución! (1 min)

### 5.1 Ir a la aplicación

```
🔗 http://localhost:8080/index.html
```

### 5.2 Conectar con Spotify

```
🟢 Click en el botón "Conectar con Spotify"
```

### 5.3 Autorizar (en Spotify)

```
✅ Revisa los permisos
✅ Click en "Aceptar" o "Agree"
```

### 5.4 ¡Espera la magia!

Deberías:
1. Ser redirigido automáticamente
2. Ver el tocadiscos cargarse
3. Ver la playlist predeterminada
4. Ver las canciones en la lista

✅ **Checkpoint**: Estás en la aplicación principal

---

## 🎮 Paso 6: Primer Uso

### 6.1 Observa la interfaz

```
🎵 Disco de vinilo negro en el centro
🦾 Brazo plateado a la derecha
📊 Visualizador alrededor del disco
📝 Lista de canciones abajo
🎛️ Controles en el medio
```

### 6.2 ¡Arrastra el brazo!

```
👆 Click y mantén en el brazo
🎯 Arrastra sobre el disco
🎵 Escucha la música empezar
🌀 Observa el disco girar
```

### 6.3 Prueba los controles

```
▶️  Play/Pause - Reproducir o pausar
⏮  Anterior - Canción anterior
⏭  Siguiente - Siguiente canción
⛶  Levantar - Volver brazo a reposo
🔊 Volumen - Ajustar volumen
```

### 6.4 Cambia de canción

```
👆 Mueve el brazo a diferentes posiciones en el disco
🎵 Cada posición = una canción diferente
```

### 6.5 Selecciona otra playlist

```
📱 Click en "Seleccionar Playlist"
🔍 Busca o elige una playlist
✅ Click para cargar
```

---

## 🎉 ¡Felicidades!

### ✅ Has completado tu primera ejecución exitosa

Ahora puedes:
- 🎵 Explorar diferentes playlists
- 🎨 Ver el visualizador reaccionar a la música
- 🎛️ Experimentar con los controles
- 👆 Practicar mover el brazo con precisión

---

## 💡 Tips Pro

### Control Fino del Brazo
```
🐌 Arrastra LENTAMENTE para control preciso
🎯 Observa qué canción está activa (resaltada en verde)
```

### Saltar a Canción Específica
```
📝 Click en cualquier canción de la lista
🦾 El brazo se moverá automáticamente
```

### Mejor Experiencia
```
🎧 Usa audífonos o buenos parlantes
🖥️ Pantalla grande (desktop recomendado)
🌐 Usa Chrome para mejor compatibilidad
```

### Si Algo Sale Mal
```
🔄 Recarga la página (F5)
🔌 Verifica que el servidor esté corriendo
📱 Cierra otros dispositivos Spotify
```

---

## 📊 Próximos Pasos

### Explora la Documentación

```
📖 README.md           - Documentación completa
🏗️ ARCHITECTURE.md     - Cómo funciona por dentro
✅ SETUP_CHECKLIST.md  - Checklist detallado
```

### Personaliza la App

```
⚙️ js/config.js - Cambia colores, número de canciones, etc.
🎨 css/styles.css - Modifica estilos visuales
```

### Comparte

```
👥 Muestra el proyecto a amigos
🌐 Deploya en la web (Netlify, Vercel, etc.)
💻 Contribuye mejoras (fork en GitHub)
```

---

## 🆘 ¿Problemas?

### Error: "Invalid Client"
```
❌ El Client ID es incorrecto
✅ Verifica config.js
✅ Copia nuevamente desde Spotify Dashboard
```

### Error: "Spotify Premium Required"
```
❌ Tu cuenta no es Premium
✅ Actualiza en spotify.com/premium
💡 Esta app REQUIERE Premium (no funciona con Free)
```

### No se reproduce audio
```
✅ Cierra otras apps de Spotify
✅ Verifica volumen del navegador
✅ Prueba en Chrome
✅ Revisa consola del navegador (F12)
```

### Servidor no inicia
```
✅ Verifica que Python esté instalado: python --version
✅ Prueba con: python3 server.py
✅ Usa otro puerto: python -m http.server 8081
   (actualiza config.js y Spotify Dashboard)
```

---

## 📞 Ayuda Adicional

### Recursos
- 📖 [README.md](README.md) - Documentación completa
- 🚀 [QUICK_START.md](QUICK_START.md) - Guía rápida
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Detalles técnicos

### Comunidad
- 🌐 Spotify Developer Docs: https://developer.spotify.com/documentation/
- 💬 Spotify Developer Forum: https://community.spotify.com/

---

## ✨ ¡Disfruta!

```
🎵 Explora tu música de una manera completamente nueva
🎨 Aprecia el diseño vintage interactivo
🎧 Descubre nuevas canciones arrastrando el brazo aleatoriamente
🌟 ¡Diviértete!
```

---

**Hecho con ❤️ y mucha música 🎵**

---

*Si completaste todos los pasos exitosamente, ¡estás listo para disfrutar!*
*Si tienes problemas, revisa la sección de ayuda o consulta README.md*
