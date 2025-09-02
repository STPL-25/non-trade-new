const { de } = require("zod/v4/locales");

const ValidationRules = {
  required: (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },
  
  maxLength: (value, maxLen, fieldName) => {
    if (value && value.toString().length > maxLen) {
      return `${fieldName} cannot exceed ${maxLen} characters`;
    }
    return null;
  },
  
  minLength: (value, minLen, fieldName) => {
    if (value && value.toString().length < minLen) {
      return `${fieldName} must be at least ${minLen} characters`;
    }
    return null;
  },
  
  alphanumeric: (value, fieldName) => {
    if (value && !/^[a-zA-Z0-9\s]*$/.test(value)) {
      return `${fieldName} can only contain letters, numbers, and spaces`;
    }
    return null;
  },
  
  alphabets: (value, fieldName) => {
    if (value && !/^[a-zA-Z\s]*$/.test(value)) {
      return `${fieldName} can only contain letters and spaces`;
    }
    return null;
  },
  
  numeric: (value, fieldName) => {
    if (value && !/^\d*\.?\d+$/.test(value)) {
      return `${fieldName} must be a valid number`;
    }
    return null;
  },
  
  pan: (value, fieldName) => {
    if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
      return `${fieldName} must be in format ABCDE1234F`;
    }
    return null;
  },
  
  gst: (value, fieldName) => {
    if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
      return `${fieldName} must be a valid 15-digit GST number`;
    }
    return null;
  },
  
  tan: (value, fieldName) => {
    if (value && !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value)) {
      return `${fieldName} must be in format ABCD12345E`;
    }
    return null;
  },
  
  cin: (value, fieldName) => {
    if (value && !/^[LUF]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value)) {
      return `${fieldName} must be a valid 21-character CIN`;
    }
    return null;
  },
  
  pincode: (value, fieldName) => {
    if (value && !/^[1-9][0-9]{5}$/.test(value)) {
      return `${fieldName} must be a valid 6-digit pincode`;
    }
    return null;
  },
  
  stateCode: (value, fieldName) => {
    if (value && (!/^\d{2}$/.test(value) || parseInt(value) < 1 || parseInt(value) > 37)) {
      return `${fieldName} must be a valid 2-digit state code (01-37)`;
    }
    return null;
  }
};

const validateField = (value, field, allFields = []) => {
  const errors = [];
  
  // Required validation
  if (field.require) {
    const requiredError = ValidationRules.required(value, field.label);
    if (requiredError) errors.push(requiredError);
  }
  
  // Skip other validations if value is empty and not required
  if (!value && !field.require) return errors;
  
  // Max length validation
  if (field.maxLength) {
    const maxLengthError = ValidationRules.maxLength(value, field.maxLength, field.label);
    if (maxLengthError) errors.push(maxLengthError);
  }
  
  // Min length validation
  if (field.minLength) {
    const minLengthError = ValidationRules.minLength(value, field.minLength, field.label);
    if (minLengthError) errors.push(minLengthError);
  }
  
  // Custom validations based on field type or field name
  if (field.validation) {
    field.validation.forEach(validationType => {
      if (ValidationRules[validationType]) {
        const error = ValidationRules[validationType](value, field.label);
        if (error) errors.push(error);
      }
    });
  }
  
  return errors;
};


export  {   validateField };