// Spotify Configuration
const SPOTIFY_CONFIG = {
    // IMPORTANT: Replace with your Spotify App Client ID
    // Get it from: https://developer.spotify.com/dashboard
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE',

    // Redirect URI must match the one configured in your Spotify App
    REDIRECT_URI: 'http://localhost:8080/callback.html',

    // Scopes needed for the app
    SCOPES: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'playlist-read-private',
        'user-read-playback-state',
        'user-modify-playback-state'
    ],

    // API endpoints
    AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
    TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
    API_BASE: 'https://api.spotify.com/v1'
};

// Turntable Configuration
const TURNTABLE_CONFIG = {
    // Tonearm constraints
    ARM_LENGTH: 150,
    ARM_MIN_ANGLE: -45,
    ARM_MAX_ANGLE: 45,
    ARM_PIVOT_OFFSET_X: 0,
    ARM_PIVOT_OFFSET_Y: -200,

    // Record dimensions
    RECORD_RADIUS: 200,
    GROOVE_START_RADIUS: 80,
    GROOVE_END_RADIUS: 190,

    // Animation
    RPM: 33.33,
    ROTATION_DURATION: 1.8, // seconds per rotation (60/33.33)

    // Visualization
    VISUALIZER_BARS: 64,
    VISUALIZER_RADIUS: 220,

    // Colors
    COLORS: {
        background: '#2C1810',
        wood: '#3E2723',
        vinyl: '#1a1a1a',
        vinylShine: '#2a2a2a',
        tonearm: '#c0c0c0',
        accent: '#d4af37',
        label: '#8B0000'
    },

    // Default playlist (Today's Top Hits - public playlist)
    DEFAULT_PLAYLIST_ID: '37i9dQZF1DXcBWIGoYBM5M',

    // Number of tracks to load
    MAX_TRACKS: 12
};

// Audio effects volume levels
const AUDIO_EFFECTS = {
    VINYL_CRACKLE_VOLUME: 0.15,
    NEEDLE_DROP_VOLUME: 0.3,
    LIFT_VOLUME: 0.25,
    SCRATCH_VOLUME: 0.2
};
