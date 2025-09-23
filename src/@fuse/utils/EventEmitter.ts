class EventEmitter {
	private readonly events: Record<string, Set<(...args: unknown[]) => void>>;

	constructor() {
		this.events = {};
	}

	private _getEventListByName<T extends unknown[]>(eventName: string): Set<(...args: T) => void> {
		if (typeof this.events[eventName] === 'undefined') {
			this.events[eventName] = new Set();
		}

		return this.events[eventName];
	}

	on<T extends unknown[]>(eventName: string, fn: (...args: T) => void): void {
		this._getEventListByName<T>(eventName).add(fn);
	}

	once(eventName: string, fn: (...args: unknown[]) => void): void {
		const onceFn = (...args: unknown[]) => {
			this.removeListener(eventName, onceFn);
			fn.apply(this, args);
		};
		this.on(eventName, onceFn);
	}

	emit(eventName: string, ...args: unknown[]): void {
		this._getEventListByName(eventName).forEach((fn) => {
			fn.apply(this, args);
		});
	}

	removeListener(eventName: string, fn: (...args: unknown[]) => void): void {
		this._getEventListByName(eventName).delete(fn);
	}
}

export default EventEmitter;
