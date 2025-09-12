import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "sequelize";

const errorMiddleware = (err, req, res, next) => {
  try {
    console.error(err); // Log full error for debugging

    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";

    // Sequelize Validation Error (model validations failed)
    if (err instanceof ValidationError) {
      message = err.errors.map((e) => e.message).join(", ");
      statusCode = 400;
    }

    // Sequelize Unique Constraint Error (duplicate key)
    if (err instanceof UniqueConstraintError) {
      message = "Duplicate field value entered";
      statusCode = 400;
    }

    // Sequelize Foreign Key Constraint Error
    if (err instanceof ForeignKeyConstraintError) {
      message = "Invalid reference: Foreign key constraint failed";
      statusCode = 400;
    }

    // Sequelize Database Error (e.g., bad SQL)
    if (err instanceof DatabaseError) {
      message = "Database query error";
      statusCode = 500;
    }

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
