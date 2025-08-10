// utils/validation.js
export const validatePersonalDetails = (data) => {
    const errors = {};
    if (!data.name) errors.name = 'Name is required';
    if (!data.gender) errors.gender = 'Gender is required';
    if (!data.phoneNumber) errors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(data.phoneNumber)) errors.phoneNumber = 'Invalid phone number';
    return errors;
};

export const validateCountryDetails = (data) => {
    const errors = {};
    if (!data.country) errors.country = 'Country is required';
    if (!data.state) errors.state = 'State is required';
    return errors;
};

export const validateSkillsDetails = (data) => {
    const errors = {};
    if (data.skills.length === 0) errors.skills = 'At least one skill is required';
    return errors;
};

export const validateCredentialDetails = (data) => {
    const errors = {};
    if (!data.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';
    if (!data.password) errors.password = 'Password is required';
    else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
};