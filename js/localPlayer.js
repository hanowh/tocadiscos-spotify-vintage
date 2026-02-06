/**
 * Local Music Player
 * Handles local audio files with metadata reading and playback
 */

class LocalMusicPlayer {
    constructor() {
        this.audioContext = null;
        this.currentAudio = null;
        this.sourceNode = null;
        this.analyser = null;
        this.gainNode = null;

        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;

        // Callbacks
        this.onStateChange = null;
        this.onTrackEnd = null;
        this.onError = null;

        this.initializeAudioContext();
    }

    /**
     * Initialize Web Audio API context
     */
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.gainNode = this.audioContext.createGain();

            // Connect nodes
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        } catch (error) {
            console.error('Error initializing audio context:', error);
            if (this.onError) this.onError(error);
        }
    }

    /**
     * Load files from input
     */
    async loadFiles(files) {
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('audio/') ||
            /\.(mp3|wav|ogg|m4a|flac)$/i.test(file.name)
        );

        for (const file of validFiles) {
            try {
                const track = await this.parseAudioFile(file);
                this.playlist.push(track);
            } catch (error) {
                console.error('Error loading file:', file.name, error);
            }
        }

        return this.playlist;
    }

    /**
     * Parse audio file and extract metadata
     */
    async parseAudioFile(file) {
        const url = URL.createObjectURL(file);

        // Create temporary audio element to get duration
        const tempAudio = new Audio(url);
        await new Promise((resolve, reject) => {
            tempAudio.addEventListener('loadedmetadata', resolve);
            tempAudio.addEventListener('error', reject);
        });

        const track = {
            id: this.generateId(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            duration: Math.floor(tempAudio.duration * 1000),
            url: url,
            file: file,
            image: null,
            isLocal: true
        };

        // Try to read ID3 tags if jsmediatags is available
        if (window.jsmediatags) {
            try {
                const metadata = await this.readID3Tags(file);
                if (metadata) {
                    track.name = metadata.title || track.name;
                    track.artist = metadata.artist || track.artist;
                    track.album = metadata.album || track.album;
                    track.image = metadata.picture || null;
                }
            } catch (error) {
                console.warn('Could not read ID3 tags:', error);
            }
        }

        return track;
    }

    /**
     * Read ID3 tags from audio file
     */
    readID3Tags(file) {
        return new Promise((resolve, reject) => {
            window.jsmediatags.read(file, {
                onSuccess: (tag) => {
                    const picture = tag.tags.picture;
                    let imageUrl = null;

                    if (picture) {
                        const { data, format } = picture;
                        const byteArray = new Uint8Array(data);
                        const blob = new Blob([byteArray], { type: format });
                        imageUrl = URL.createObjectURL(blob);
                    }

                    resolve({
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        album: tag.tags.album,
                        picture: imageUrl
                    });
                },
                onError: (error) => {
                    reject(error);
                }
            });
        });
    }

    /**
     * Play a specific track
     */
    async playTrack(index) {
        if (index < 0 || index >= this.playlist.length) {
            console.error('Invalid track index');
            return;
        }

        const track = this.playlist[index];

        // Stop current playback
        this.stop();

        // Resume AudioContext if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            console.log('Resuming AudioContext...');
            await this.audioContext.resume();
            console.log('AudioContext state:', this.audioContext.state);
        }

        // Disconnect previous source if exists
        if (this.sourceNode) {
            try {
                this.sourceNode.disconnect();
            } catch (e) {
                console.warn('Error disconnecting source:', e);
            }
            this.sourceNode = null;
        }

        // Create new audio element
        this.currentAudio = new Audio(track.url);
        this.currentTrackIndex = index;

        // Set volume
        this.currentAudio.volume = this.gainNode ? this.gainNode.gain.value : 0.5;

        // Setup event listeners
        this.currentAudio.addEventListener('ended', () => {
            this.handleTrackEnd();
        });

        this.currentAudio.addEventListener('timeupdate', () => {
            this.currentTime = Math.floor(this.currentAudio.currentTime * 1000);
            this.duration = Math.floor(this.currentAudio.duration * 1000);
        });

        this.currentAudio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            if (this.onError) this.onError(e);
        });

        this.currentAudio.addEventListener('loadedmetadata', () => {
            console.log('Audio loaded, duration:', this.currentAudio.duration);
        });

        this.currentAudio.addEventListener('canplay', () => {
            console.log('Audio can play');
        });

        // Connect to Web Audio API for visualization
        if (this.audioContext) {
            try {
                this.sourceNode = this.audioContext.createMediaElementSource(this.currentAudio);
                this.sourceNode.connect(this.gainNode);
                console.log('Audio connected to Web Audio API');
            } catch (error) {
                console.error('Error connecting to Web Audio API:', error);
            }
        }

        // Play
        try {
            console.log('Attempting to play track:', track.name);
            console.log('AudioContext state before play:', this.audioContext?.state);

            await this.currentAudio.play();

            console.log('Play() called successfully');
            console.log('Audio paused?', this.currentAudio.paused);
            console.log('Audio currentTime:', this.currentAudio.currentTime);
            console.log('Audio duration:', this.currentAudio.duration);

            this.isPlaying = true;
            this.notifyStateChange();
            console.log('Track playing successfully');
        } catch (error) {
            console.error('Error playing track:', error);
            if (this.onError) this.onError(error);
        }
    }

    /**
     * Resume playback
     */
    async play() {
        // Resume AudioContext if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            console.log('Resuming AudioContext...');
            await this.audioContext.resume();
        }

        if (this.currentAudio && this.currentAudio.paused) {
            try {
                await this.currentAudio.play();
                this.isPlaying = true;
                this.notifyStateChange();
                console.log('Playback resumed');
            } catch (error) {
                console.error('Error resuming playback:', error);
            }
        }
    }

    /**
     * Pause playback
     */
    pause() {
        if (this.currentAudio && !this.currentAudio.paused) {
            this.currentAudio.pause();
            this.isPlaying = false;
            this.notifyStateChange();
        }
    }

    /**
     * Stop playback
     */
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            // Don't destroy audio element, just pause it
            this.isPlaying = false;
            this.notifyStateChange();
        }
    }

    /**
     * Seek to position
     */
    seek(positionMs) {
        if (this.currentAudio) {
            this.currentAudio.currentTime = positionMs / 1000;
        }
    }

    /**
     * Set volume (0-1)
     */
    setVolume(volume) {
        if (this.currentAudio) {
            this.currentAudio.volume = Math.max(0, Math.min(1, volume));
        }
        if (this.gainNode) {
            this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Get current position
     */
    getPosition() {
        return this.currentTime;
    }

    /**
     * Get duration
     */
    getDuration() {
        return this.duration;
    }

    /**
     * Get current track
     */
    getCurrentTrack() {
        if (this.currentTrackIndex >= 0 && this.currentTrackIndex < this.playlist.length) {
            return this.playlist[this.currentTrackIndex];
        }
        return null;
    }

    /**
     * Get playlist
     */
    getPlaylist() {
        return this.playlist;
    }

    /**
     * Clear playlist
     */
    clearPlaylist() {
        this.stop();

        // Revoke object URLs
        this.playlist.forEach(track => {
            if (track.url) URL.revokeObjectURL(track.url);
            if (track.image) URL.revokeObjectURL(track.image);
        });

        this.playlist = [];
        this.currentTrackIndex = -1;
    }

    /**
     * Remove track from playlist
     */
    removeTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            const track = this.playlist[index];

            // Stop if currently playing
            if (index === this.currentTrackIndex) {
                this.stop();
                this.currentTrackIndex = -1;
            } else if (index < this.currentTrackIndex) {
                this.currentTrackIndex--;
            }

            // Revoke URLs
            if (track.url) URL.revokeObjectURL(track.url);
            if (track.image) URL.revokeObjectURL(track.image);

            // Remove from playlist
            this.playlist.splice(index, 1);
        }
    }

    /**
     * Get analyser for visualization
     */
    getAnalyser() {
        return this.analyser;
    }

    /**
     * Handle track end
     */
    handleTrackEnd() {
        this.isPlaying = false;
        if (this.onTrackEnd) {
            this.onTrackEnd();
        }
    }

    /**
     * Notify state change
     */
    notifyStateChange() {
        if (this.onStateChange) {
            const track = this.getCurrentTrack();
            this.onStateChange({
                isPlaying: this.isPlaying,
                track: track ? {
                    name: track.name,
                    artists: [{ name: track.artist }],
                    album: { name: track.album },
                    duration_ms: track.duration,
                    uri: track.id
                } : null,
                position: this.currentTime,
                duration: this.duration
            });
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Check if local mode is active
     */
    isActive() {
        return this.currentTrackIndex >= 0;
    }

    /**
     * Cleanup
     */
    cleanup() {
        this.clearPlaylist();
        if (this.sourceNode) {
            this.sourceNode.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Global instance
let localPlayer = null;

// Initialize on load
if (typeof window !== 'undefined') {
    localPlayer = new LocalMusicPlayer();
}
