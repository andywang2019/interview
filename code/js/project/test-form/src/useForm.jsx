import { useState } from 'react';

const useForm = (initialValues, onSubmit) => {
    // State for form values and errors
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

    // Validate form
    const validate = () => {
        const newErrors = {};
        // Example validation
        if (!values.username) newErrors.username = "Username is required";
        if (!values.email.includes("@")) newErrors.email = "Invalid email";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            onSubmit(values);
            setIsSubmitting(false);
        }
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting
    };
};
export default useForm;