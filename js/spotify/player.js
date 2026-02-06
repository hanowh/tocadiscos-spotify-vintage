/**
 * Spotify Web Playback SDK Wrapper
 * Handles music playback through Spotify
 */

class SpotifyPlayer {
    constructor() {
        this.player = null;
        this.deviceId = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.currentPosition = 0;
        this.duration = 0;
        this.volume = 0.5;

        this.onReady = null;
        this.onStateChange = null;
        this.onError = null;
    }

    /**
     * Initialize the Spotify Web Playback SDK
     */
    async initialize() {
        return new Promise((resolve, reject) => {
            if (!window.Spotify) {
                reject(new Error('Spotify SDK not loaded'));
                return;
            }

            const token = spotifyAuth.getAccessToken();

            this.player = new Spotify.Player({
                name: 'Tocadiscos Virtual',
                getOAuthToken: cb => { cb(token); },
                volume: this.volume
            });

            // Ready event
            this.player.addListener('ready', ({ device_id }) => {
                console.log('Spotify Player ready with Device ID:', device_id);
                this.deviceId = device_id;
                if (this.onReady) this.onReady(device_id);
                resolve(device_id);
            });

            // Not ready event
            this.player.addListener('not_ready', ({ device_id }) => {
                console.log('Device has gone offline', device_id);
            });

            // Player state changed
            this.player.addListener('player_state_changed', state => {
                if (!state) {
                    this.isPlaying = false;
                    return;
                }

                this.currentTrack = state.track_window.current_track;
                this.isPlaying = !state.paused;
                this.currentPosition = state.position;
                this.duration = state.duration;

                if (this.onStateChange) {
                    this.onStateChange({
                        track: this.currentTrack,
                        isPlaying: this.isPlaying,
                        position: this.currentPosition,
                        duration: this.duration
                    });
                }
            });

            // Error handling
            this.player.addListener('initialization_error', ({ message }) => {
                console.error('Initialization error:', message);
                if (this.onError) this.onError(message);
                reject(new Error(message));
            });

            this.player.addListener('authentication_error', ({ message }) => {
                console.error('Authentication error:', message);
                spotifyAuth.logout();
                reject(new Error(message));
            });

            this.player.addListener('account_error', ({ message }) => {
                console.error('Account error:', message);
                alert('Esta función requiere Spotify Premium. Por favor, actualiza tu cuenta.');
                if (this.onError) this.onError(message);
                reject(new Error(message));
            });

            this.player.addListener('playback_error', ({ message }) => {
                console.error('Playback error:', message);
                if (this.onError) this.onError(message);
            });

            // Connect to the player
            this.player.connect();
        });
    }

    /**
     * Play a specific track
     */
    async playTrack(trackUri) {
        if (!this.deviceId) {
            throw new Error('Player not ready');
        }

        const token = spotifyAuth.getAccessToken();

        await fetch(`${SPOTIFY_CONFIG.API_BASE}/me/player/play?device_id=${this.deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [trackUri]
            })
        });
    }

    /**
     * Play multiple tracks
     */
    async playTracks(trackUris, offset = 0) {
        if (!this.deviceId) {
            throw new Error('Player not ready');
        }

        const token = spotifyAuth.getAccessToken();

        await fetch(`${SPOTIFY_CONFIG.API_BASE}/me/player/play?device_id=${this.deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: trackUris,
                offset: { position: offset }
            })
        });
    }

    /**
     * Toggle play/pause
     */
    async togglePlay() {
        if (!this.player) return;
        await this.player.togglePlay();
    }

    /**
     * Resume playback
     */
    async resume() {
        if (!this.player) return;
        await this.player.resume();
    }

    /**
     * Pause playback
     */
    async pause() {
        if (!this.player) return;
        await this.player.pause();
    }

    /**
     * Next track
     */
    async nextTrack() {
        if (!this.player) return;
        await this.player.nextTrack();
    }

    /**
     * Previous track
     */
    async previousTrack() {
        if (!this.player) return;
        await this.player.previousTrack();
    }

    /**
     * Seek to position (ms)
     */
    async seek(positionMs) {
        if (!this.player) return;
        await this.player.seek(positionMs);
    }

    /**
     * Set volume (0.0 - 1.0)
     */
    async setVolume(volume) {
        if (!this.player) return;
        this.volume = Math.max(0, Math.min(1, volume));
        await this.player.setVolume(this.volume);
    }

    /**
     * Get current state
     */
    async getCurrentState() {
        if (!this.player) return null;
        return await this.player.getCurrentState();
    }

    /**
     * Disconnect player
     */
    disconnect() {
        if (this.player) {
            this.player.disconnect();
        }
    }

    /**
     * Get current playback position
     */
    getPosition() {
        return this.currentPosition;
    }

    /**
     * Get track duration
     */
    getDuration() {
        return this.duration;
    }

    /**
     * Check if playing
     */
    getIsPlaying() {
        return this.isPlaying;
    }

    /**
     * Get current track
     */
    getCurrentTrack() {
        return this.currentTrack;
    }
}

// Create singleton instance
const spotifyPlayer = new SpotifyPlayer();
