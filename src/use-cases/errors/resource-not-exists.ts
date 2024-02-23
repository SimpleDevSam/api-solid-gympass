export class ResourcesNotExistError extends Error {
    constructor () {
        super('Resource not found.')
    }
}