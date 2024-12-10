export class AppError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UserNotFoundError extends AppError {
  constructor(userId: number) {
    super(`User with ID ${userId} not found`, 404, 'USER_NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
} 
