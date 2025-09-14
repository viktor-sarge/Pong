import Emitter from './classes/emitter.js';

export default class ParticleSystem {
	constructor(ctx) {
		this.ctx = ctx;
		this.emitters = [];
		this.particles = [];
	}

	addEmitter(
		x,
		y,
		particleSpeed,
		particlesPerSecond,
		particleLifespan,
		particleColor,
		particlesToEmit,
		emitAllParticlesAtOnce
	) {
		this.emitters.push(
			new Emitter(
				x,
				y,
				particleSpeed,
				particlesPerSecond,
				particleLifespan,
				particleColor,
				particlesToEmit,
				emitAllParticlesAtOnce
			)
		);
	}

	update(deltaTime) {
		this.emitters.forEach((emitter) => {
			emitter.update(deltaTime);
			this.particles = this.particles.concat(emitter.getParticles());
			if (!emitter.emitting) {
				this.emitters.splice(this.emitters.indexOf(emitter), 1);
			}
		});

		this.particles.forEach((particle) => {
			particle.update(deltaTime);
		});

		this.particles = this.particles.filter((particle) => {
			return !particle.isDead();
		});
	}

	getParticles() {
		return this.particles;
	}

	clear() {
		this.emitters = [];
		this.particles = [];
	}

	render() {
		this.particles.forEach((particle) => {
			this.ctx.fillStyle = particle.color;
			this.ctx.fillRect(particle.x, particle.y, 3, 3);
		});
	}
}
