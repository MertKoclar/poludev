/**
 * Global Error Handler Utility
 * Provides consistent error handling and user-friendly error messages
 */

export interface AppError {
  message: string;
  code?: string;
  details?: string;
  statusCode?: number;
}

/**
 * Parse Supabase errors into user-friendly messages
 */
export const parseSupabaseError = (error: any): AppError => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN',
    };
  }

  // Handle Supabase PostgREST errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return {
          message: 'No data found or you do not have permission to access this resource',
          code: error.code,
          details: error.message,
        };
      case '23505': // Unique violation
        return {
          message: 'This record already exists',
          code: error.code,
          details: error.message,
        };
      case '23503': // Foreign key violation
        return {
          message: 'Cannot delete this record because it is referenced by other records',
          code: error.code,
          details: error.message,
        };
      case '42501': // Insufficient privilege
        return {
          message: 'You do not have permission to perform this action',
          code: error.code,
          details: error.message,
        };
      default:
        return {
          message: error.message || 'A database error occurred',
          code: error.code,
          details: error.details,
        };
    }
  }

  // Handle network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return {
      message: 'Network error. Please check your internet connection and try again',
      code: 'NETWORK_ERROR',
      details: error.message,
    };
  }

  // Handle authentication errors
  if (error.message?.includes('JWT') || error.message?.includes('session')) {
    return {
      message: 'Your session has expired. Please log in again',
      code: 'AUTH_ERROR',
      details: error.message,
    };
  }

  // Handle storage errors
  if (error.message?.includes('storage') || error.message?.includes('bucket')) {
    return {
      message: 'File upload failed. Please check the file size and format',
      code: 'STORAGE_ERROR',
      details: error.message,
    };
  }

  // Handle RLS errors
  if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
    return {
      message: 'You do not have permission to access this resource',
      code: 'RLS_ERROR',
      details: error.message,
    };
  }

  // Default error
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN',
    details: error.details || error.stack,
  };
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: any, fallback?: string): string => {
  const parsed = parseSupabaseError(error);
  return parsed.message || fallback || 'An error occurred';
};

/**
 * Log error to console (and potentially to error tracking service)
 */
export const logError = (error: any, context?: string) => {
  const parsed = parseSupabaseError(error);
  const errorLog = {
    message: parsed.message,
    code: parsed.code,
    details: parsed.details,
    context,
    timestamp: new Date().toISOString(),
    originalError: error,
  };

  console.error('Error logged:', errorLog);

  // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
  // if (process.env.NODE_ENV === 'production') {
  //   errorTrackingService.captureException(error, { extra: errorLog });
  // }
};

/**
 * Handle async errors with consistent error handling
 */
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error: any) {
    const parsed = parseSupabaseError(error);
    logError(error, 'handleAsyncError');
    
    if (errorHandler) {
      errorHandler(parsed);
    }
    
    return null;
  }
};

