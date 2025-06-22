const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/;
    return regex.test(password);
};

export default function signUpValidation(formData) {
    const errors = {
        email: [],
        password: [],
        confirmPassword: []
    };

    if (!formData.email) {
        errors.email.push("Email is required");
    } else if (!validateEmail(formData.email)) {
        errors.email.push("Please enter a valid email address");
    }

    if (!formData.password) {
        errors.password.push("Password is required");
    } else {
        if (formData.password.length < 8) {
            errors.password.push("Password must be at least 8 characters long");
        }
        if (formData.password.length > 20) {
            errors.password.push("Password must be less than or equal to 20 characters long");
        }
        if (!validatePassword(formData.password)) {
            errors.password.push("Password must include uppercase, lowercase, numbers, and special characters");
        }
    }

    if (!formData.confirmPassword) {
        errors.confirmPassword.push("Confirm Password is required");
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword.push("Passwords do not match");
    }

    return errors;
}