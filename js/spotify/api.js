/**
 * Spotify Web API Module
 * Handles all API calls to Spotify Web API
 */

class SpotifyAPI {
    constructor() {
        this.baseUrl = SPOTIFY_CONFIG.API_BASE;
    }

    /**
     * Make authenticated API request
     */
    async request(endpoint, options = {}) {
        const token = spotifyAuth.getAccessToken();
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired
                spotifyAuth.logout();
                throw new Error('Token expired');
            }
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Get current user's profile
     */
    async getCurrentUser() {
        return await this.request('/me');
    }

    /**
     * Get user's playlists
     */
    async getUserPlaylists(limit = 50) {
        return await this.request(`/me/playlists?limit=${limit}`);
    }

    /**
     * Get playlist tracks
     */
    async getPlaylistTracks(playlistId) {
        const data = await this.request(`/playlists/${playlistId}/tracks`);

        return data.items
            .filter(item => item.track && item.track.uri) // Filter out null tracks
            .map(item => ({
                uri: item.track.uri,
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0]?.name || 'Unknown Artist',
                album: item.track.album.name,
                image: item.track.album.images[0]?.url || '',
                duration: item.track.duration_ms
            }));
    }

    /**
     * Search for tracks
     */
    async searchTracks(query, limit = 20) {
        const data = await this.request(
            `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
        );

        return data.tracks.items.map(track => ({
            uri: track.uri,
            id: track.id,
            name: track.name,
            artist: track.artists[0]?.name || 'Unknown Artist',
            album: track.album.name,
            image: track.album.images[0]?.url || '',
            duration: track.duration_ms
        }));
    }

    /**
     * Get audio features for a track
     */
    async getAudioFeatures(trackId) {
        return await this.request(`/audio-features/${trackId}`);
    }

    /**
     * Get audio analysis for a track
     */
    async getAudioAnalysis(trackId) {
        return await this.request(`/audio-analysis/${trackId}`);
    }

    /**
     * Get track details
     */
    async getTrack(trackId) {
        return await this.request(`/tracks/${trackId}`);
    }

    /**
     * Get playlist details
     */
    async getPlaylist(playlistId) {
        return await this.request(`/playlists/${playlistId}`);
    }

    /**
     * Format duration from milliseconds to MM:SS
     */
    formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Create singleton instance
const spotifyAPI = new SpotifyAPI();
