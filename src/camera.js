class Camera {
    constructor() {
        this.targetZoom = 1;
        this.currentZoom = 1;
        this.position = { x: 0, y: 0 };
        this.stage = undefined;
        this.targetObject = undefined;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        window.addEventListener('resize', this.resize.bind(this));
    }

    setStage(stage) {
        this.stage = stage;
    }

    setObject(targetObject) {
        this.targetObject = targetObject;
    }

    setZoom(value) {
        this.targetZoom = value;
    }

    resize() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    update(dt) {
        const FOLLOW_COEIFFICIENT = 1.004 ** dt - 1;
        const ZOOM_COEIFFICIENT = 1.004 ** dt - 1;
        this.updateFollowObj(FOLLOW_COEIFFICIENT);
        this.updateFollowZoom(ZOOM_COEIFFICIENT);
        this.updateStage();
    }

    updateStage() {
        if (this.stage === undefined) return;
        this.interpolation();
        this.stage.scale.x = this.currentZoom;
        this.stage.scale.y = this.currentZoom;
        this.stage.position.x = this.position.x;
        this.stage.position.y = this.position.y;
    }

    interpolation() {
        const BOUNDARY = {
            X: { MIN: 0, MAX: -this.stage.width / this.stage.scale.x },
            Y: { MIN: 0, MAX: -this.stage.height / this.stage.scale.y }
        }
        if (this.position.x >= BOUNDARY.X.MIN * this.currentZoom && this.position.x <= BOUNDARY.X.MAX * this.currentZoom + this.screenWidth) {
            this.position.x = ((BOUNDARY.X.MIN * this.currentZoom) + (BOUNDARY.X.MAX * this.currentZoom + this.screenWidth)) / 2;
        } else if (this.position.x >= BOUNDARY.X.MIN * this.currentZoom) {
            this.position.x = BOUNDARY.X.MIN * this.currentZoom;
        } else if (this.position.x <= BOUNDARY.X.MAX * this.currentZoom + this.screenWidth) {
            this.position.x = BOUNDARY.X.MAX * this.currentZoom + this.screenWidth;
        }

        if (this.position.y >= BOUNDARY.Y.MIN * this.currentZoom && this.position.y <= BOUNDARY.Y.MAX * this.currentZoom + this.screenHeight) {
            this.position.y = ((BOUNDARY.Y.MIN * this.currentZoom) + (BOUNDARY.Y.MAX * this.currentZoom + this.screenHeight)) / 2;
        } else if (this.position.y >= BOUNDARY.Y.MIN * this.currentZoom) {
            this.position.y = BOUNDARY.Y.MIN * this.currentZoom;
        } else if (this.position.y <= BOUNDARY.Y.MAX * this.currentZoom + this.screenHeight) {
            this.position.y = BOUNDARY.Y.MAX * this.currentZoom + this.screenHeight;
        }
    }

    updateFollowObj(coeifficient) {
        if (this.targetObject === undefined) return;

        const targetPosition = {
            x: ((-this.targetObject.position.x - this.targetObject.width / 2) * this.currentZoom + this.screenWidth / 2),
            y: ((-this.targetObject.position.y - this.targetObject.height / 2) * this.currentZoom + this.screenHeight / 2)
        };

        if (Math.abs((targetPosition.x - this.position.x) * coeifficient) < 1) {
            if (Math.abs(this.position.x - targetPosition.x) <= 1) {
                this.position.x = targetPosition.x;
            } else if (this.position.x < targetPosition.x) {
                this.position.x += 1;
            } else {
                this.position.x -= 1;
            }
        } else {
            this.position.x += (targetPosition.x - this.position.x) * coeifficient;
        }

        if (Math.abs((targetPosition.y - this.position.y) * coeifficient) < 1) {
            if (Math.abs(this.position.y - targetPosition.y) <= 1) {
                this.position.y = targetPosition.y;
            } else if (this.position.y < targetPosition.y) {
                this.position.y += 1;
            } else {
                this.position.y -= 1;
            }
        } else {
            this.position.y += (targetPosition.y - this.position.y) * coeifficient;
        }
    }

    updateFollowZoom(coeifficient) {
        const zoom = this.currentZoom + (this.targetZoom - this.currentZoom) * coeifficient;
        const centerPos = {
            x: (this.position.x - this.screenWidth / 2) / this.currentZoom,
            y: (this.position.y - this.screenHeight / 2) / this.currentZoom
        };

        this.currentZoom = zoom;
        this.position.x = (centerPos.x * this.currentZoom) + this.screenWidth / 2;
        this.position.y = (centerPos.y * this.currentZoom) + this.screenHeight / 2;
    }

    destroy() {
        window.removeEventListener('resize', this.resize);
    }
}

export default Camera;