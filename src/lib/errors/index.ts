export class AuthError extends Error {
  static defaultMessage = 'Authentication needed.'

  constructor(message: string = AuthError.defaultMessage) {
    super(message)
    this.name = this.constructor.name
  }
}

export class ValidationError extends Error {
  static defaultMessage = 'Validation failed.'

  constructor(message: string = ValidationError.defaultMessage) {
    super(message)
    this.name = this.constructor.name
  }
}

export class WorkspaceMissingError extends Error {
  static defaultMessage = 'Workspace missing.'

  constructor(message: string = WorkspaceMissingError.defaultMessage) {
    super(message)
    this.name = this.constructor.name
  }
}

export class BuildScriptError extends Error {
  static defaultMessage = 'Failed to build script.'

  constructor(message: string = BuildScriptError.defaultMessage) {
    super(message)
    this.name = this.constructor.name
  }
}

export const publicErrors = [
  AuthError,
  ValidationError,
  WorkspaceMissingError,
  BuildScriptError,
]
