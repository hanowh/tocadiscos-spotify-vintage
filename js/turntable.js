/**
 * Turntable Module
 * Handles the vinyl record visual and animation
 */

class Turntable {
    constructor(recordElement) {
        this.recordElement = recordElement;
        this.isSpinning = false;
        this.currentTrackImage = null;
    }

    /**
     * Start spinning the record
     */
    startSpin() {
        this.isSpinning = true;
        this.recordElement.classList.add('playing');
    }

    /**
     * Stop spinning the record
     */
    stopSpin() {
        this.isSpinning = false;
        this.recordElement.classList.remove('playing');
    }

    /**
     * Toggle spin state
     */
    toggleSpin() {
        if (this.isSpinning) {
            this.stopSpin();
        } else {
            this.startSpin();
        }
    }

    /**
     * Update album art on the label
     */
    updateAlbumArt(imageUrl) {
        const albumArtElement = document.getElementById('albumArt');
        const labelTextElement = document.querySelector('.label-text');

        if (imageUrl && albumArtElement) {
            albumArtElement.src = imageUrl;
            albumArtElement.style.display = 'block';
            if (labelTextElement) {
                labelTextElement.style.display = 'none';
            }
            this.currentTrackImage = imageUrl;
        } else {
            if (albumArtElement) {
                albumArtElement.style.display = 'none';
            }
            if (labelTextElement) {
                labelTextElement.style.display = 'block';
            }
            this.currentTrackImage = null;
        }
    }

    /**
     * Create track markers on the record
     */
    createTrackMarkers(trackCount) {
        const markersContainer = document.getElementById('trackMarkers');
        if (!markersContainer) return;

        // Clear existing markers
        markersContainer.innerHTML = '';

        // Create markers for each track
        const angleStep = 360 / trackCount;
        const radius = TURNTABLE_CONFIG.GROOVE_END_RADIUS - 20; // Position near edge

        for (let i = 0; i < trackCount; i++) {
            const marker = document.createElement('div');
            marker.className = 'track-marker';
            marker.dataset.trackIndex = i;

            const angle = i * angleStep;
            const radian = (angle - 90) * (Math.PI / 180); // -90 to start at top

            const x = 200 + radius * Math.cos(radian); // 200 = center of record
            const y = 200 + radius * Math.sin(radian);

            marker.style.left = `${x}px`;
            marker.style.top = `${y}px`;

            markersContainer.appendChild(marker);
        }
    }

    /**
     * Highlight active track marker
     */
    highlightTrackMarker(trackIndex) {
        const markers = document.querySelectorAll('.track-marker');
        markers.forEach((marker, index) => {
            if (index === trackIndex) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }

    /**
     * Get spinning state
     */
    isRecordSpinning() {
        return this.isSpinning;
    }

    /**
     * Reset the turntable
     */
    reset() {
        this.stopSpin();
        this.updateAlbumArt(null);
        const markersContainer = document.getElementById('trackMarkers');
        if (markersContainer) {
            markersContainer.innerHTML = '';
        }
    }
}

// Initialize turntable (will be done in app.js)
let turntable = null;
