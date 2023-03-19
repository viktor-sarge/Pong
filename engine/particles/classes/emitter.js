import Particle from "./particle.js";

export default class Emitter {
    constructor(x, y, particleSpeed, particlesPerSecond, particleLifespan, particleColor, particlesToEmit, emitAllParticlesAtOnce = false) {
        this.x = x;
        this.y = y;
        this.particleSpeed = particleSpeed;
        this.particlesPerSecond = particlesPerSecond;
        this.particleLifespan = particleLifespan;
        this.particleColor = particleColor;
        this.particles = [];
        this.timeSinceLastEmission = 0;
        this.particlesToEmit = particlesToEmit;
        this.emitting = true;
        this.emitAllParticlesAtOnce = emitAllParticlesAtOnce;
    }

    update(deltaTime) {
        if (!this.emitting) return;
        if (this.emitAllParticlesAtOnce) {
            for (let i = 0; i < this.particlesToEmit; i++) {
                const particleAngle = Math.random() * 2 * Math.PI;
                const particleVelocityX = this.particleSpeed * Math.cos(particleAngle);
                const particleVelocityY = this.particleSpeed * Math.sin(particleAngle);
                const particle = new Particle(this.x, this.y, particleVelocityX, particleVelocityY, 0, 0, this.particleColor, this.particleLifespan);
                this.particles.push(particle);
            }
            this.emitting = false;
        } else {
            this.timeSinceLastEmission += deltaTime;
            while (this.timeSinceLastEmission > 1 / this.particlesPerSecond && this.particles.length < this.particlesToEmit) {
                const particleAngle = Math.random() * 2 * Math.PI;
                const particleVelocityX = this.particleSpeed * Math.cos(particleAngle);
                const particleVelocityY = this.particleSpeed * Math.sin(particleAngle);
                const particle = new Particle(this.x, this.y, particleVelocityX, particleVelocityY, 0, 0, this.particleColor, this.particleLifespan);
                this.particles.push(particle);
                this.timeSinceLastEmission -= 1 / this.particlesPerSecond;
            }
            if (this.particles.length >= this.particlesToEmit) {
                this.emitting = false;
            }
        }
    }

    getParticles() {
        return this.particles;
    }
}
