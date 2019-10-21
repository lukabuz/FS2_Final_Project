// interface for validator configuration
interface validationConfig {
	variableName: string; // name of variable in http request
	displayName: string; // what the variable should be reffered to as in errors
	minLength: number; // minimum length of the value
	maxLength: number; // maximum length of the value
}

// Validator class, handles http request body validation
export class Validator {
	private configs: validationConfig[]; // array for configs of each expected variable
	private body: any; // req.body
	public errors: string[]; // array of errors found in req.body

	// constructor, takes an array of configs and a req.body
	constructor(configs: validationConfig[], body: any) {
		this.configs = configs;
		this.errors = [];
		this.body = body;
	}

	// the validate method. First checks if all variables ar present, then checks their size
	// if this returns false, this.errors.length > 0
	public validate(): boolean {
		return (
			typeof this.body === "object" &&
			this.checkExistence() &&
			this.checkLength()
		);
	}

	// check if all variables in the config exist
	private checkExistence(): boolean {
		for (const config of this.configs) {
			if (typeof this.body[config.variableName] === "undefined") {
				this.errors.push("Please enter " + config.displayName); // push to errors array
			}
		}
		return this.errors.length === 0;
	}

	// check lengths of all variables
	private checkLength(): boolean {
		for (const config of this.configs) {
			if (this.body[config.variableName].length > config.maxLength) {
				// check for max
				this.errors.push(
					config.displayName +
						" must be a minimum of " +
						config.maxLength +
						" letters"
				);
			}
			if (this.body[config.variableName].length < config.minLength) {
				// check for min
				this.errors.push(
					config.displayName +
						" must be a maximum of " +
						config.minLength +
						" letters"
				);
			}
		}
		return this.errors.length === 0;
	}
}
