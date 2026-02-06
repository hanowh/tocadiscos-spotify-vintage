/**
 * Playlist Module
 * Handles playlist selection and track management
 */

class PlaylistManager {
    constructor() {
        this.currentPlaylist = null;
        this.tracks = [];
        this.userPlaylists = [];

        // UI Elements
        this.modal = document.getElementById('playlistModal');
        this.playlistList = document.getElementById('playlistList');
        this.searchInput = document.getElementById('playlistSearch');
        this.currentPlaylistName = document.getElementById('currentPlaylistName');
        this.trackListItems = document.getElementById('trackListItems');

        this.onPlaylistChange = null;

        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Open modal
        const selectBtn = document.getElementById('selectPlaylistBtn');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => this.openModal());
        }

        // Close modal
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal on outside click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Search playlists
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterPlaylists(e.target.value);
            });
        }
    }

    /**
     * Load default playlist
     */
    async loadDefaultPlaylist() {
        try {
            this.currentPlaylistName.textContent = 'Cargando playlist predeterminada...';

            const playlist = await spotifyAPI.getPlaylist(TURNTABLE_CONFIG.DEFAULT_PLAYLIST_ID);
            const tracks = await spotifyAPI.getPlaylistTracks(TURNTABLE_CONFIG.DEFAULT_PLAYLIST_ID);

            this.setPlaylist(playlist.name, tracks);
        } catch (error) {
            console.error('Error loading default playlist:', error);
            this.currentPlaylistName.textContent = 'Error al cargar playlist';
            alert('No se pudo cargar la playlist predeterminada. Por favor, selecciona una playlist.');
        }
    }

    /**
     * Set current playlist and tracks
     */
    setPlaylist(playlistName, tracks) {
        // Limit to MAX_TRACKS
        this.tracks = tracks.slice(0, TURNTABLE_CONFIG.MAX_TRACKS);
        this.currentPlaylist = playlistName;

        // Update UI
        this.currentPlaylistName.textContent = `${playlistName} (${this.tracks.length} canciones)`;

        // Update track list
        this.renderTrackList();

        // Notify callback
        if (this.onPlaylistChange) {
            this.onPlaylistChange(this.tracks);
        }

        this.closeModal();
    }

    /**
     * Render track list in UI
     */
    renderTrackList() {
        if (!this.trackListItems) return;

        this.trackListItems.innerHTML = '';

        this.tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'track-item';
            item.dataset.trackIndex = index;

            item.innerHTML = `
                <div class="track-number">${index + 1}</div>
                <div class="track-item-info">
                    <div class="track-item-name">${this.escapeHtml(track.name)}</div>
                    <div class="track-item-artist">${this.escapeHtml(track.artist)}</div>
                </div>
                <div class="track-duration">${spotifyAPI.formatDuration(track.duration)}</div>
            `;

            // Click to play track
            item.addEventListener('click', () => {
                if (tonearm) {
                    tonearm.moveToTrack(index);
                }
            });

            this.trackListItems.appendChild(item);
        });
    }

    /**
     * Highlight active track in list
     */
    highlightTrack(trackIndex) {
        const items = this.trackListItems?.querySelectorAll('.track-item');
        if (!items) return;

        items.forEach((item, index) => {
            if (index === trackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Open playlist selection modal
     */
    async openModal() {
        if (!this.modal) return;

        this.modal.classList.add('active');

        // Load user playlists if not loaded
        if (this.userPlaylists.length === 0) {
            await this.loadUserPlaylists();
        } else {
            this.renderPlaylists(this.userPlaylists);
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }

    /**
     * Load user's playlists
     */
    async loadUserPlaylists() {
        try {
            this.playlistList.innerHTML = '<div class="loading">Cargando playlists...</div>';

            const data = await spotifyAPI.getUserPlaylists();
            this.userPlaylists = data.items;

            this.renderPlaylists(this.userPlaylists);
        } catch (error) {
            console.error('Error loading playlists:', error);
            this.playlistList.innerHTML = '<div class="loading">Error al cargar playlists</div>';
        }
    }

    /**
     * Render playlists in modal
     */
    renderPlaylists(playlists) {
        if (!this.playlistList) return;

        this.playlistList.innerHTML = '';

        if (playlists.length === 0) {
            this.playlistList.innerHTML = '<div class="loading">No se encontraron playlists</div>';
            return;
        }

        playlists.forEach(playlist => {
            const item = document.createElement('div');
            item.className = 'playlist-item';

            const image = playlist.images && playlist.images[0]
                ? playlist.images[0].url
                : 'https://via.placeholder.com/60';

            item.innerHTML = `
                ${playlist.images && playlist.images[0] ? `<img src="${image}" alt="${this.escapeHtml(playlist.name)}" class="playlist-image">` : ''}
                <div class="playlist-info">
                    <div class="playlist-name">${this.escapeHtml(playlist.name)}</div>
                    <div class="playlist-tracks">${playlist.tracks.total} canciones</div>
                </div>
            `;

            item.addEventListener('click', async () => {
                await this.loadPlaylist(playlist.id, playlist.name);
            });

            this.playlistList.appendChild(item);
        });
    }

    /**
     * Filter playlists by search query
     */
    filterPlaylists(query) {
        const filtered = this.userPlaylists.filter(playlist =>
            playlist.name.toLowerCase().includes(query.toLowerCase())
        );
        this.renderPlaylists(filtered);
    }

    /**
     * Load a specific playlist
     */
    async loadPlaylist(playlistId, playlistName) {
        try {
            this.playlistList.innerHTML = '<div class="loading">Cargando canciones...</div>';

            const tracks = await spotifyAPI.getPlaylistTracks(playlistId);

            if (tracks.length === 0) {
                alert('Esta playlist no tiene canciones');
                await this.loadUserPlaylists();
                return;
            }

            this.setPlaylist(playlistName, tracks);
        } catch (error) {
            console.error('Error loading playlist:', error);
            alert('Error al cargar la playlist');
            await this.loadUserPlaylists();
        }
    }

    /**
     * Get current tracks
     */
    getTracks() {
        return this.tracks;
    }

    /**
     * Get track by index
     */
    getTrack(index) {
        return this.tracks[index] || null;
    }

    /**
     * Get track count
     */
    getTrackCount() {
        return this.tracks.length;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize playlist manager (will be done in app.js)
let playlistManager = null;
