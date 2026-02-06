/**
 * Mode Manager
 * Handles switching between Spotify and Local playback modes
 */

class ModeManager {
    constructor() {
        this.currentMode = 'spotify'; // 'spotify' or 'local'
        this.onModeChange = null;

        // UI Elements
        this.spotifyModeBtn = document.getElementById('spotifyModeBtn');
        this.localModeBtn = document.getElementById('localModeBtn');
        this.spotifySection = document.getElementById('spotifySection');
        this.localSection = document.getElementById('localSection');
        this.loadLocalFilesBtn = document.getElementById('loadLocalFilesBtn');
        this.clearLocalFilesBtn = document.getElementById('clearLocalFilesBtn');
        this.localFilesInput = document.getElementById('localFilesInput');
        this.localFileCount = document.getElementById('localFileCount');

        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mode buttons
        this.spotifyModeBtn?.addEventListener('click', () => this.switchMode('spotify'));
        this.localModeBtn?.addEventListener('click', () => this.switchMode('local'));

        // Local files
        this.loadLocalFilesBtn?.addEventListener('click', () => {
            this.localFilesInput?.click();
        });

        this.localFilesInput?.addEventListener('change', async (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                await this.loadLocalFiles(files);
            }
        });

        this.clearLocalFilesBtn?.addEventListener('click', () => {
            this.clearLocalFiles();
        });
    }

    /**
     * Switch playback mode
     */
    switchMode(mode) {
        if (this.currentMode === mode) return;

        const previousMode = this.currentMode;
        this.currentMode = mode;

        // Update UI
        this.updateModeUI();

        // Stop current playback
        if (previousMode === 'spotify' && spotifyPlayer) {
            spotifyPlayer.pause();
        } else if (previousMode === 'local' && localPlayer) {
            localPlayer.pause();
        }

        // Notify listeners
        if (this.onModeChange) {
            this.onModeChange(mode, previousMode);
        }
    }

    /**
     * Update mode UI
     */
    updateModeUI() {
        // Update buttons
        if (this.currentMode === 'spotify') {
            this.spotifyModeBtn?.classList.add('active');
            this.localModeBtn?.classList.remove('active');
            this.spotifySection.style.display = 'flex';
            this.localSection.style.display = 'none';
        } else {
            this.localModeBtn?.classList.add('active');
            this.spotifyModeBtn?.classList.remove('active');
            this.spotifySection.style.display = 'none';
            this.localSection.style.display = 'flex';
        }
    }

    /**
     * Load local files
     */
    async loadLocalFiles(files) {
        if (!localPlayer) {
            console.error('Local player not initialized');
            return;
        }

        try {
            // Show loading state
            this.localFileCount.textContent = 'Cargando archivos...';

            // Load files
            await localPlayer.loadFiles(files);

            // Update UI
            this.updateLocalFileCount();

            // Show clear button
            if (localPlayer.getPlaylist().length > 0) {
                this.clearLocalFilesBtn.style.display = 'flex';
            }

            // Notify app to update track list
            if (this.onModeChange) {
                this.onModeChange(this.currentMode, this.currentMode);
            }

            // Clear input
            this.localFilesInput.value = '';
        } catch (error) {
            console.error('Error loading local files:', error);
            this.localFileCount.textContent = 'Error al cargar archivos';
        }
    }

    /**
     * Clear local files
     */
    clearLocalFiles() {
        if (!localPlayer) return;

        if (confirm('¿Estás seguro de que quieres borrar todos los archivos cargados?')) {
            localPlayer.clearPlaylist();
            this.updateLocalFileCount();
            this.clearLocalFilesBtn.style.display = 'none';

            // Notify app to update track list
            if (this.onModeChange) {
                this.onModeChange(this.currentMode, this.currentMode);
            }
        }
    }

    /**
     * Update local file count display
     */
    updateLocalFileCount() {
        const count = localPlayer.getPlaylist().length;
        if (count === 0) {
            this.localFileCount.textContent = 'No hay archivos cargados';
        } else {
            this.localFileCount.textContent = `${count} archivo${count !== 1 ? 's' : ''} cargado${count !== 1 ? 's' : ''}`;
        }
    }

    /**
     * Get current mode
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * Check if Spotify mode
     */
    isSpotifyMode() {
        return this.currentMode === 'spotify';
    }

    /**
     * Check if local mode
     */
    isLocalMode() {
        return this.currentMode === 'local';
    }
}

// Global instance
let modeManager = null;

// Initialize on load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        modeManager = new ModeManager();
    });
}
