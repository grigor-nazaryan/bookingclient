const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export default function forgotPasswordValidation(formData) {
    console.log("formData: ", formData);
    const errors = {
        email: [],
    };

    if (!formData.email) {
        errors.email.push("Email is required");
    } else if (!validateEmail(formData.email)) {
        errors.email.push("Please enter a valid email address");
    }

    return errors;
}