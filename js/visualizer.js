/**
 * Audio Visualizer Module
 * Creates visual representation of audio (generative, since we can't access Spotify's audio stream directly)
 */

class AudioVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;

        // Visualization settings
        this.bars = TURNTABLE_CONFIG.VISUALIZER_BARS;
        this.barValues = new Array(this.bars).fill(0);
        this.targetValues = new Array(this.bars).fill(0);

        // Colors - Vintage theme
        this.colors = {
            primary: '#d4a574',
            secondary: '#bf9b6a',
            accent: '#ffd796'
        };

        // Audio analyser (for local playback)
        this.analyser = null;
        this.dataArray = null;
        this.useRealAudio = false;

        // Audio features (will be updated with track data)
        this.tempo = 120;
        this.energy = 0.5;
        this.loudness = 0.5;

        // Animation state
        this.beatPhase = 0;
        this.beatSpeed = 0.1;
    }

    /**
     * Connect to Web Audio API analyser
     */
    connectToAnalyser(analyser) {
        if (!analyser) {
            this.disconnectAnalyser();
            return;
        }

        this.analyser = analyser;
        this.dataArray = new Uint8Array(analyser.frequencyBinCount);
        this.useRealAudio = true;
        console.log('Visualizer connected to audio analyser');
    }

    /**
     * Disconnect from analyser
     */
    disconnectAnalyser() {
        this.analyser = null;
        this.dataArray = null;
        this.useRealAudio = false;
        console.log('Visualizer disconnected from audio analyser');
    }

    /**
     * Start visualization
     */
    start() {
        this.isActive = true;
        this.animate();
    }

    /**
     * Stop visualization
     */
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.clear();
    }

    /**
     * Update with track audio features
     */
    updateAudioFeatures(features) {
        if (features) {
            this.tempo = features.tempo || 120;
            this.energy = features.energy || 0.5;
            this.loudness = Math.min(1, Math.max(0, (features.loudness + 60) / 60)) || 0.5;
            this.beatSpeed = (this.tempo / 60) * 0.05; // Convert BPM to animation speed
        }
    }

    /**
     * Generate values from real audio or pseudo-random
     */
    generateValues() {
        if (this.useRealAudio && this.analyser && this.dataArray) {
            this.generateRealAudioValues();
        } else {
            this.generatePseudoValues();
        }
    }

    /**
     * Generate values from real audio analyser
     */
    generateRealAudioValues() {
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);

        // Map frequency data to bars
        const binSize = Math.floor(this.dataArray.length / this.bars);

        for (let i = 0; i < this.bars; i++) {
            let sum = 0;
            const start = i * binSize;
            const end = start + binSize;

            // Average the frequency bins for this bar
            for (let j = start; j < end; j++) {
                sum += this.dataArray[j];
            }

            // Normalize to 0-1 range
            let value = sum / (binSize * 255);

            // Apply some boosting for better visuals
            value = Math.pow(value, 0.7); // Slight compression

            // Boost bass (lower frequencies)
            if (i < this.bars / 4) {
                value *= 1.3;
            }

            this.targetValues[i] = Math.min(1, value);
        }
    }

    /**
     * Generate pseudo-random values that look like audio
     */
    generatePseudoValues() {
        this.beatPhase += this.beatSpeed;

        for (let i = 0; i < this.bars; i++) {
            // Create wave patterns based on beat phase
            const wave1 = Math.sin(this.beatPhase + i * 0.2) * 0.5 + 0.5;
            const wave2 = Math.sin(this.beatPhase * 1.5 + i * 0.15) * 0.3 + 0.3;
            const wave3 = Math.sin(this.beatPhase * 2 + i * 0.1) * 0.2 + 0.2;

            // Combine waves with energy and randomness
            let value = (wave1 + wave2 + wave3) / 3;
            value *= this.energy;
            value *= (0.8 + Math.random() * 0.4); // Add randomness

            // Boost certain frequencies for visual interest
            if (i < this.bars / 4) {
                value *= 1.2; // Boost bass
            } else if (i > this.bars * 3 / 4) {
                value *= 0.9; // Slightly reduce highs
            }

            this.targetValues[i] = value;
        }
    }

    /**
     * Smooth interpolation between current and target values
     */
    smoothValues() {
        for (let i = 0; i < this.bars; i++) {
            const diff = this.targetValues[i] - this.barValues[i];
            this.barValues[i] += diff * 0.2; // Smooth transition
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isActive) return;

        this.generateValues();
        this.smoothValues();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Draw the visualization
     */
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Draw bars in a circle
        const radius = TURNTABLE_CONFIG.VISUALIZER_RADIUS;
        const barWidth = (2 * Math.PI * radius) / this.bars * 0.8; // 80% to leave gaps
        const maxBarHeight = 80;

        for (let i = 0; i < this.bars; i++) {
            const angle = (i / this.bars) * 2 * Math.PI - Math.PI / 2; // Start at top
            const barHeight = this.barValues[i] * maxBarHeight;

            // Calculate bar position (outside the record)
            const x1 = centerX + radius * Math.cos(angle);
            const y1 = centerY + radius * Math.sin(angle);
            const x2 = centerX + (radius + barHeight) * Math.cos(angle);
            const y2 = centerY + (radius + barHeight) * Math.sin(angle);

            // Create gradient for each bar
            const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, this.colors.primary);
            gradient.addColorStop(1, this.colors.secondary);

            // Draw bar
            this.ctx.beginPath();
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = barWidth;
            this.ctx.lineCap = 'round';
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.barValues.fill(0);
        this.targetValues.fill(0);
    }

    /**
     * Resize canvas (call when window resizes)
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

// Initialize visualizer (will be done in app.js)
let visualizer = null;
