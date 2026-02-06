/**
 * Main Application
 * Coordinates all modules and manages app state
 */

class TurntableApp {
    constructor() {
        this.isInitialized = false;
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.currentMode = 'spotify'; // 'spotify' or 'local'

        // UI Elements
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playIcon = document.getElementById('playIcon');
        this.pauseIcon = document.getElementById('pauseIcon');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.liftArmBtn = document.getElementById('liftArmBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.logoutBtn = document.getElementById('logoutBtn');

        this.trackNameEl = document.getElementById('trackName');
        this.trackArtistEl = document.getElementById('trackArtist');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.progressFill = document.getElementById('progressFill');

        this.progressUpdateInterval = null;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing Turntable App...');

            // Initialize modules
            this.initializeModules();

            // Setup event listeners
            this.setupEventListeners();

            // Check if user wants to use local mode only
            const urlParams = new URLSearchParams(window.location.search);
            const localOnly = urlParams.get('local') === 'true';

            if (!localOnly && spotifyAuth.isAuthenticated()) {
                // Initialize Spotify mode
                await this.initializeSpotifyMode();
            } else if (!localOnly) {
                // Not authenticated, allow local mode only
                console.log('Not authenticated with Spotify. Local mode available.');
                this.switchToLocalMode();
            } else {
                // Local mode requested
                this.switchToLocalMode();
            }

            this.isInitialized = true;
            console.log('Turntable App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Error al inicializar la aplicación: ' + error.message);
        }
    }

    /**
     * Initialize Spotify mode
     */
    async initializeSpotifyMode() {
        try {
            // Wait for Spotify SDK to load
            await this.waitForSpotifySDK();

            // Initialize Spotify Player
            await this.initializePlayer();

            // Load default playlist
            await playlistManager.loadDefaultPlaylist();

            console.log('Spotify mode initialized');
        } catch (error) {
            console.error('Error initializing Spotify mode:', error);
            throw error;
        }
    }

    /**
     * Switch to local mode
     */
    switchToLocalMode() {
        this.currentMode = 'local';
        if (modeManager) {
            modeManager.switchMode('local');
        }
    }

    /**
     * Initialize all modules
     */
    initializeModules() {
        // Initialize turntable
        const recordElement = document.getElementById('vinylRecord');
        turntable = new Turntable(recordElement);

        // Initialize tonearm
        const armElement = document.getElementById('tonearm');
        tonearm = new Tonearm(armElement, recordElement);

        // Setup tonearm callbacks
        tonearm.onTrackChange = (trackIndex) => this.handleTrackChange(trackIndex);
        tonearm.onArmLift = () => this.handleArmLift();
        tonearm.onArmDrop = () => this.handleArmDrop();

        // Initialize visualizer
        const canvas = document.getElementById('visualizer');
        visualizer = new AudioVisualizer(canvas);

        // Initialize playlist manager
        playlistManager = new PlaylistManager();
        playlistManager.onPlaylistChange = (tracks) => this.handlePlaylistChange(tracks);

        // Setup mode manager callback
        if (modeManager) {
            modeManager.onModeChange = (newMode, oldMode) => this.handleModeChange(newMode, oldMode);
        }

        // Setup local player callbacks
        if (localPlayer) {
            localPlayer.onStateChange = (state) => this.handlePlayerStateChange(state);
            localPlayer.onTrackEnd = () => this.handleLocalTrackEnd();
        }
    }

    /**
     * Wait for Spotify SDK to load
     */
    waitForSpotifySDK() {
        return new Promise((resolve) => {
            if (window.Spotify) {
                resolve();
            } else {
                window.onSpotifyWebPlaybackSDKReady = () => {
                    resolve();
                };
            }
        });
    }

    /**
     * Initialize Spotify Player
     */
    async initializePlayer() {
        // Setup player callbacks
        spotifyPlayer.onStateChange = (state) => this.handlePlayerStateChange(state);

        // Initialize player
        await spotifyPlayer.initialize();

        // Set initial volume
        await spotifyPlayer.setVolume(0.5);
    }

    /**
     * Setup UI event listeners
     */
    setupEventListeners() {
        // Play/Pause button
        this.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());

        // Previous button
        this.prevBtn?.addEventListener('click', () => this.previousTrack());

        // Next button
        this.nextBtn?.addEventListener('click', () => this.nextTrack());

        // Lift arm button
        this.liftArmBtn?.addEventListener('click', () => this.liftArm());

        // Volume slider
        this.volumeSlider?.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            if (this.currentMode === 'local') {
                localPlayer.setVolume(volume);
            } else {
                spotifyPlayer.setVolume(volume);
            }
        });

        // Logout button
        this.logoutBtn?.addEventListener('click', () => {
            spotifyPlayer.disconnect();
            spotifyAuth.logout();
        });

        // Start progress update interval
        this.progressUpdateInterval = setInterval(() => {
            this.updateProgress();
        }, 1000);
    }

    /**
     * Handle mode change
     */
    handleModeChange(newMode, oldMode) {
        console.log('Mode changed:', oldMode, '->', newMode);

        this.currentMode = newMode;

        // Stop current playback
        this.stop();

        // Update playlist/tracks
        if (newMode === 'local') {
            const localPlaylist = localPlayer.getPlaylist();
            this.handlePlaylistChange(localPlaylist);
        } else if (newMode === 'spotify') {
            // Reload Spotify playlist if available
            const spotifyTracks = playlistManager.getTracks();
            if (spotifyTracks && spotifyTracks.length > 0) {
                this.handlePlaylistChange(spotifyTracks);
            }
        }
    }

    /**
     * Handle local track end
     */
    handleLocalTrackEnd() {
        console.log('Local track ended');
        // Auto-play next track
        this.nextTrack();
    }

    /**
     * Handle playlist change
     */
    handlePlaylistChange(tracks) {
        // Set tracks on tonearm
        tonearm.setTracks(tracks);

        // Create track markers on record
        turntable.createTrackMarkers(tracks.length);

        // Reset state
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.updatePlayPauseButton();

        // Update track list UI
        this.updateTrackListUI(tracks);
    }

    /**
     * Update track list UI
     */
    updateTrackListUI(tracks) {
        const trackListItems = document.getElementById('trackListItems');
        if (!trackListItems) return;

        trackListItems.innerHTML = '';

        tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.dataset.index = index;

            const trackNumber = document.createElement('div');
            trackNumber.className = 'track-number';
            trackNumber.textContent = index + 1;

            const trackInfo = document.createElement('div');
            trackInfo.className = 'track-item-info';

            const trackName = document.createElement('div');
            trackName.className = 'track-item-name';
            trackName.textContent = track.name;

            const trackArtist = document.createElement('div');
            trackArtist.className = 'track-item-artist';
            trackArtist.textContent = track.artist || (track.artists ? track.artists.map(a => a.name).join(', ') : 'Unknown Artist');

            trackInfo.appendChild(trackName);
            trackInfo.appendChild(trackArtist);

            const trackDuration = document.createElement('div');
            trackDuration.className = 'track-duration';
            trackDuration.textContent = this.formatTime(track.duration || track.duration_ms);

            trackItem.appendChild(trackNumber);
            trackItem.appendChild(trackInfo);
            trackItem.appendChild(trackDuration);

            // Click handler
            trackItem.addEventListener('click', () => {
                tonearm.moveToTrack(index);
            });

            trackListItems.appendChild(trackItem);
        });
    }

    /**
     * Handle track change (when arm moves to different groove)
     */
    async handleTrackChange(trackIndex) {
        if (this.currentTrackIndex === trackIndex) return;

        this.currentTrackIndex = trackIndex;

        // Get track based on current mode
        let track;
        if (this.currentMode === 'local') {
            const localPlaylist = localPlayer.getPlaylist();
            track = localPlaylist[trackIndex];
        } else {
            track = playlistManager.getTrack(trackIndex);
        }

        if (!track) return;

        console.log('Track changed to:', track.name);

        // Update UI
        turntable.highlightTrackMarker(trackIndex);
        if (this.currentMode === 'spotify') {
            playlistManager.highlightTrack(trackIndex);
        }
        turntable.updateAlbumArt(track.image);

        // Play track based on mode
        try {
            if (this.currentMode === 'local') {
                await localPlayer.playTrack(trackIndex);

                // Connect visualizer to local player
                const analyser = localPlayer.getAnalyser();
                if (analyser) {
                    visualizer.connectToAnalyser(analyser);
                }
            } else {
                await spotifyPlayer.playTrack(track.uri);

                // Load audio features for visualizer
                try {
                    const features = await spotifyAPI.getAudioFeatures(track.id);
                    visualizer.updateAudioFeatures(features);
                } catch (error) {
                    console.warn('Could not load audio features:', error);
                }
            }
        } catch (error) {
            console.error('Error playing track:', error);
        }
    }

    /**
     * Handle arm lift (pause)
     */
    handleArmLift() {
        console.log('Arm lifted');
        this.pause();
    }

    /**
     * Handle arm drop (play current track)
     */
    handleArmDrop() {
        console.log('Arm dropped');
        // Track will be played via handleTrackChange
    }

    /**
     * Handle player state change
     */
    handlePlayerStateChange(state) {
        this.isPlaying = state.isPlaying;

        // Update UI
        this.updatePlayPauseButton();

        if (state.track) {
            this.updateTrackInfo(state.track);
        }

        // Control turntable and visualizer
        if (this.isPlaying) {
            turntable.startSpin();
            visualizer.start();
        } else {
            turntable.stopSpin();
            visualizer.stop();
        }
    }

    /**
     * Update track info display
     */
    updateTrackInfo(track) {
        if (this.trackNameEl) {
            this.trackNameEl.textContent = track.name;
        }

        if (this.trackArtistEl) {
            const artists = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
            this.trackArtistEl.textContent = artists;
        }

        // Update total time
        if (this.totalTimeEl) {
            const duration = track.duration_ms;
            this.totalTimeEl.textContent = this.formatTime(duration);
        }
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        if (!this.isPlaying) return;

        let position, duration;

        if (this.currentMode === 'local') {
            position = localPlayer.getPosition();
            duration = localPlayer.getDuration();
        } else {
            position = spotifyPlayer.getPosition();
            duration = spotifyPlayer.getDuration();
        }

        if (duration > 0) {
            const progress = (position / duration) * 100;
            if (this.progressFill) {
                this.progressFill.style.width = `${progress}%`;
            }

            if (this.currentTimeEl) {
                this.currentTimeEl.textContent = this.formatTime(position);
            }
        }
    }

    /**
     * Format time from ms to M:SS
     */
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Toggle play/pause
     */
    async togglePlayPause() {
        if (this.isPlaying) {
            await this.pause();
        } else {
            await this.play();
        }
    }

    /**
     * Play current track
     */
    async play() {
        // If arm is not on record, move to first track
        if (!tonearm.isArmOnRecord()) {
            tonearm.moveToTrack(0);
        } else {
            if (this.currentMode === 'local') {
                await localPlayer.play();
            } else {
                await spotifyPlayer.resume();
            }
        }
    }

    /**
     * Pause playback
     */
    async pause() {
        if (this.currentMode === 'local') {
            localPlayer.pause();
        } else {
            await spotifyPlayer.pause();
        }
    }

    /**
     * Stop playback
     */
    stop() {
        if (this.currentMode === 'local') {
            localPlayer.stop();
        } else if (spotifyPlayer) {
            spotifyPlayer.pause();
        }
    }

    /**
     * Next track
     */
    async nextTrack() {
        const trackCount = this.currentMode === 'local'
            ? localPlayer.getPlaylist().length
            : playlistManager.getTrackCount();
        const nextIndex = (this.currentTrackIndex + 1) % trackCount;
        tonearm.moveToTrack(nextIndex);
    }

    /**
     * Previous track
     */
    async previousTrack() {
        const trackCount = this.currentMode === 'local'
            ? localPlayer.getPlaylist().length
            : playlistManager.getTrackCount();
        let prevIndex = this.currentTrackIndex - 1;
        if (prevIndex < 0) {
            prevIndex = trackCount - 1;
        }
        tonearm.moveToTrack(prevIndex);
    }

    /**
     * Lift arm to rest position
     */
    liftArm() {
        tonearm.liftArm();
    }

    /**
     * Update play/pause button
     */
    updatePlayPauseButton() {
        if (this.isPlaying) {
            if (this.playIcon) this.playIcon.style.display = 'none';
            if (this.pauseIcon) this.pauseIcon.style.display = 'block';
        } else {
            if (this.playIcon) this.playIcon.style.display = 'block';
            if (this.pauseIcon) this.pauseIcon.style.display = 'none';
        }
    }

    /**
     * Cleanup on page unload
     */
    cleanup() {
        if (this.progressUpdateInterval) {
            clearInterval(this.progressUpdateInterval);
        }
        spotifyPlayer.disconnect();
        visualizer.stop();
    }
}

// Initialize app when DOM is ready
let app = null;

document.addEventListener('DOMContentLoaded', () => {
    app = new TurntableApp();
    app.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});
