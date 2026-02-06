/**
 * Spotify Authentication Module
 * Handles OAuth 2.0 flow and token management
 */

class SpotifyAuth {
    constructor() {
        this.accessToken = null;
        this.tokenExpiration = null;
        this.loadToken();
    }

    /**
     * Load token from sessionStorage
     */
    loadToken() {
        this.accessToken = sessionStorage.getItem('spotify_access_token');
        const expiration = sessionStorage.getItem('spotify_token_expiration');
        this.tokenExpiration = expiration ? parseInt(expiration) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        if (!this.accessToken || !this.tokenExpiration) {
            return false;
        }

        // Check if token is expired
        if (Date.now() >= this.tokenExpiration) {
            this.logout();
            return false;
        }

        return true;
    }

    /**
     * Get access token
     */
    getAccessToken() {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated');
        }
        return this.accessToken;
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        window.location.href = 'index.html';
    }

    /**
     * Logout user
     */
    logout() {
        sessionStorage.removeItem('spotify_access_token');
        sessionStorage.removeItem('spotify_token_expiration');
        this.accessToken = null;
        this.tokenExpiration = null;
        this.redirectToLogin();
    }

    /**
     * Get time until token expires (in seconds)
     */
    getTimeUntilExpiration() {
        if (!this.tokenExpiration) return 0;
        return Math.max(0, Math.floor((this.tokenExpiration - Date.now()) / 1000));
    }
}

// Create singleton instance
const spotifyAuth = new SpotifyAuth();
