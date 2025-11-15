import { useState, useCallback } from 'react';

export interface ValidationRule {
  validator: (value: string) => boolean;
  message: string;
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: FieldValidation
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback(
    (name: string, value: string): string => {
      if (!validationRules || !validationRules[name]) {
        return '';
      }

      const rules = validationRules[name];
      for (const rule of rules) {
        if (!rule.validator(value)) {
          return rule.message;
        }
      }

      return '';
    },
    [validationRules]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (validationRules) {
      Object.keys(validationRules).forEach((field) => {
        const error = validateField(field, values[field] || '');
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const handleChange = useCallback(
    (name: string, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name] || '');
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [values, validateField]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: string) => {
    handleChange(name, value);
  }, [handleChange]);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
  };
};

// Common validation rules
export const validators = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    validator: (value: string) => value.trim().length > 0,
    message,
  }),

  email: (message: string = 'Please enter a valid email address'): ValidationRule => ({
    validator: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: string) => value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),

  password: (message: string = 'Password must be at least 8 characters'): ValidationRule => ({
    validator: (value: string) => value.length >= 8,
    message,
  }),

  url: (message: string = 'Please enter a valid URL'): ValidationRule => ({
    validator: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  match: (matchValue: string, message: string = 'Values do not match'): ValidationRule => ({
    validator: (value: string) => value === matchValue,
    message,
  }),
};

