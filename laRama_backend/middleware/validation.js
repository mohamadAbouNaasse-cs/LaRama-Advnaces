// Request validation middleware
const validateRequest = (validationRules) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const rule of validationRules) {
      const { field, required, type, minLength, maxLength, pattern, min, max } = rule;
      const value = req.body[field];
      
      // Check required fields
      if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip validation if field is not provided and not required
      if (!value && !required) continue;
      
      // Type validation
      if (type && typeof value !== type) {
        errors.push(`${field} must be of type ${type}`);
        continue;
      }
      
      // String validations
      if (type === 'string' && value) {
        if (minLength && value.length < minLength) {
          errors.push(`${field} must be at least ${minLength} characters long`);
        }
        if (maxLength && value.length > maxLength) {
          errors.push(`${field} must not exceed ${maxLength} characters`);
        }
        if (pattern && !pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
      
      // Number validations
      if (type === 'number' && value !== undefined) {
        if (min !== undefined && value < min) {
          errors.push(`${field} must be at least ${min}`);
        }
        if (max !== undefined && value > max) {
          errors.push(`${field} must not exceed ${max}`);
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    next();
  };
};

// Common validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

// Pre-defined validation rules
const validationRules = {
  register: [
    { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
    { field: 'email', required: true, type: 'string', pattern: patterns.email },
    { field: 'password', required: true, type: 'string', minLength: 6, maxLength: 50 }
  ],
  login: [
    { field: 'email', required: true, type: 'string', pattern: patterns.email },
    { field: 'password', required: true, type: 'string' }
  ],
  addToCart: [
    { field: 'product_id', required: true, type: 'string', pattern: patterns.uuid },
    { field: 'quantity', required: true, type: 'number', min: 1, max: 100 }
  ],
  updateCartItem: [
    { field: 'quantity', required: true, type: 'number', min: 1, max: 100 }
  ],
  createOrder: [
    { field: 'shipping_address', required: true, type: 'string', minLength: 10, maxLength: 500 }
  ],
  newsletter: [
    { field: 'email', required: true, type: 'string', pattern: patterns.email }
  ]
};

module.exports = {
  validateRequest,
  validationRules,
  patterns
};