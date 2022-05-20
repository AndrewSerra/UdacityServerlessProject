export class UserInputError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, UserInputError.prototype);
    }
}