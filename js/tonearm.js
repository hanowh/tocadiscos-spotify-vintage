/**
 * Tonearm Module
 * Handles the interactive draggable tonearm
 */

class Tonearm {
    constructor(armElement, recordElement) {
        this.armElement = armElement;
        this.recordElement = recordElement;

        // State
        this.isDragging = false;
        this.isOnRecord = false;
        this.currentAngle = TURNTABLE_CONFIG.ARM_MIN_ANGLE;
        this.currentTrackIndex = -1;
        this.tracks = [];

        // Pivot point (relative to turntable wrapper)
        // tonearm is at left: 370px, top: 75px
        // arm-base is at left: 10px, top: 10px (inside tonearm)
        // arm-base center: + 20px (half of 40px)
        this.pivotX = 400; // 370 + 10 + 20
        this.pivotY = 105; // 75 + 10 + 20

        // Callbacks
        this.onTrackChange = null;
        this.onArmLift = null;
        this.onArmDrop = null;

        this.setupEventListeners();
        this.updateArmPosition();
    }

    /**
     * Setup drag event listeners
     */
    setupEventListeners() {
        // Mouse events
        this.armElement.addEventListener('mousedown', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));

        // Touch events
        this.armElement.addEventListener('touchstart', this.handleDragStart.bind(this));
        document.addEventListener('touchmove', this.handleDragMove.bind(this));
        document.addEventListener('touchend', this.handleDragEnd.bind(this));
    }

    /**
     * Handle drag start
     */
    handleDragStart(e) {
        e.preventDefault();
        this.isDragging = true;
        this.armElement.style.transition = 'none';
    }

    /**
     * Handle drag move
     */
    handleDragMove(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        // Get mouse/touch position
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        // Get turntable wrapper position
        const wrapperRect = this.armElement.parentElement.getBoundingClientRect();
        const relativeX = clientX - wrapperRect.left;
        const relativeY = clientY - wrapperRect.top;

        // Calculate angle from pivot point
        const deltaX = relativeX - this.pivotX;
        const deltaY = relativeY - this.pivotY;
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // Constrain angle
        angle = Math.max(
            TURNTABLE_CONFIG.ARM_MIN_ANGLE,
            Math.min(TURNTABLE_CONFIG.ARM_MAX_ANGLE, angle)
        );

        this.currentAngle = angle;
        this.updateArmPosition();
        this.checkRecordContact();
    }

    /**
     * Handle drag end
     */
    handleDragEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.armElement.style.transition = 'transform 0.3s ease';
    }

    /**
     * Update arm visual position
     */
    updateArmPosition() {
        this.armElement.style.transform = `rotate(${this.currentAngle}deg)`;
    }

    /**
     * Check if arm is touching the record
     */
    checkRecordContact() {
        // Calculate needle position
        const armLength = TURNTABLE_CONFIG.ARM_LENGTH;
        const angleRad = this.currentAngle * (Math.PI / 180);

        const needleX = this.pivotX + (armLength + 30) * Math.cos(angleRad);
        const needleY = this.pivotY + (armLength + 30) * Math.sin(angleRad);

        // Record center (in turntable wrapper coordinates)
        const recordCenterX = 250;
        const recordCenterY = 250;

        // Calculate distance from needle to record center
        const distanceFromCenter = Math.sqrt(
            Math.pow(needleX - recordCenterX, 2) +
            Math.pow(needleY - recordCenterY, 2)
        );

        // Check if needle is on the record
        const wasOnRecord = this.isOnRecord;
        const recordRadius = TURNTABLE_CONFIG.RECORD_RADIUS;

        if (distanceFromCenter <= recordRadius && distanceFromCenter >= TURNTABLE_CONFIG.GROOVE_START_RADIUS) {
            this.isOnRecord = true;

            // Calculate which track (groove) we're on
            if (this.tracks.length > 0) {
                // Calculate angle from record center to needle
                const needleAngle = Math.atan2(
                    needleY - recordCenterY,
                    needleX - recordCenterX
                ) * (180 / Math.PI);

                // Normalize angle to 0-360
                const normalizedAngle = (needleAngle + 360) % 360;

                // Calculate track index based on angle
                const trackIndex = Math.floor(
                    (normalizedAngle / 360) * this.tracks.length
                );

                if (trackIndex !== this.currentTrackIndex) {
                    this.currentTrackIndex = trackIndex;
                    if (this.onTrackChange) {
                        this.onTrackChange(trackIndex);
                    }
                }
            }

            // Trigger arm drop event
            if (!wasOnRecord && this.onArmDrop) {
                this.onArmDrop();
            }
        } else {
            this.isOnRecord = false;
            this.currentTrackIndex = -1;

            // Trigger arm lift event
            if (wasOnRecord && this.onArmLift) {
                this.onArmLift();
            }
        }
    }

    /**
     * Set tracks for the arm to interact with
     */
    setTracks(tracks) {
        this.tracks = tracks;
    }

    /**
     * Lift arm to rest position
     */
    liftArm() {
        this.currentAngle = TURNTABLE_CONFIG.ARM_MIN_ANGLE;
        this.armElement.style.transition = 'transform 0.5s ease';
        this.updateArmPosition();
        this.isOnRecord = false;
        this.currentTrackIndex = -1;

        if (this.onArmLift) {
            this.onArmLift();
        }
    }

    /**
     * Move arm to specific track
     */
    moveToTrack(trackIndex) {
        if (trackIndex < 0 || trackIndex >= this.tracks.length) return;

        // Calculate angle for this track
        const trackAngle = (trackIndex / this.tracks.length) * 360;

        // Convert to arm angle (this is approximate)
        // The relationship between track position and arm angle is complex
        // For simplicity, we'll map it linearly to the arm range
        const armRange = TURNTABLE_CONFIG.ARM_MAX_ANGLE - TURNTABLE_CONFIG.ARM_MIN_ANGLE;
        const normalizedPosition = trackIndex / this.tracks.length;
        const targetAngle = TURNTABLE_CONFIG.ARM_MIN_ANGLE + (normalizedPosition * armRange);

        this.currentAngle = targetAngle;
        this.armElement.style.transition = 'transform 0.5s ease';
        this.updateArmPosition();

        // Simulate contact after animation
        setTimeout(() => {
            this.isOnRecord = true;
            this.currentTrackIndex = trackIndex;
            if (this.onArmDrop) {
                this.onArmDrop();
            }
            if (this.onTrackChange) {
                this.onTrackChange(trackIndex);
            }
        }, 500);
    }

    /**
     * Get current track index
     */
    getCurrentTrackIndex() {
        return this.currentTrackIndex;
    }

    /**
     * Check if arm is on record
     */
    isArmOnRecord() {
        return this.isOnRecord;
    }

    /**
     * Get current angle
     */
    getAngle() {
        return this.currentAngle;
    }
}

// Initialize tonearm (will be done in app.js)
let tonearm = null;
