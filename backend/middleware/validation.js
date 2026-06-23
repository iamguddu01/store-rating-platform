export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return false;
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUppercase && hasSpecial;
};

export const validateName = (name) => {
  return name && name.trim().length >= 20 && name.trim().length <= 60;
};

export const validateAddress = (address) => {
  return address !== undefined && address.trim().length <= 400;
};

export const runValidation = (rules) => {
  return (req, res, next) => {
    const errors = [];

    if (rules.name && !validateName(req.body.name)) {
      errors.push('Name must be between 20 and 60 characters in length.');
    }

    if (rules.email && !validateEmail(req.body.email)) {
      errors.push('Please provide a valid email address.');
    }

    if (rules.password && !validatePassword(req.body.password)) {
      errors.push('Password must be 8-16 characters long and include at least one uppercase letter and one special character.');
    }

    if (rules.address && !validateAddress(req.body.address)) {
      errors.push('Address is required and must not exceed 400 characters.');
    }

    if (rules.role) {
      const allowedRoles = ['ADMIN', 'USER', 'STORE_OWNER'];
      if (!req.body.role || !allowedRoles.includes(req.body.role.toUpperCase())) {
        errors.push('Invalid user role specified.');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

export const validateSignup = runValidation({ name: true, email: true, password: true, address: true });
export const validateCreateUser = runValidation({ name: true, email: true, password: true, address: true, role: true });
export const validateUpdatePassword = runValidation({ password: true });
export const validateCreateStore = (req, res, next) => {
  const errors = [];
  
  if (!validateName(req.body.name)) {
    errors.push('Store Name must be between 20 and 60 characters in length.');
  }
  
  if (!validateEmail(req.body.email)) {
    errors.push('Please provide a valid store email address.');
  }

  if (!validateAddress(req.body.address)) {
    errors.push('Store Address must not exceed 400 characters.');
  }

  if (!validateEmail(req.body.ownerEmail)) {
    errors.push('Please provide a valid owner email address.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
