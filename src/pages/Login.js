import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthError, loginUser } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = {};
        if (!formData.username.trim()) {
            validationErrors.username = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
            validationErrors.username = "Email is invalid";
        }
        if (!formData.password) {
            validationErrors.password = "Password is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Clear previous errors
            dispatch(clearAuthError());

            // Reset loading state
            setErrors({});

            // Dispatch login action
            await dispatch(loginUser({
                username: formData.username,
                password: formData.password
            })).unwrap();

            // Redirect on success
            navigate("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <section
            className="min-h-screen flex items-center justify-center bg-img"
            style={{ backgroundImage: "url('/assets/image/bbblurry.svg')" }}
        >
            <div className="container mx-auto">
                <div className="flex justify-center px-6 my-12">
                    <div className="w-96 flex">
                        <div className="w-full bg-login p-6 rounded-lg">
                            <div className="heading-1 pt-10 m-auto">
                                <img
                                    src="https://i.pinimg.com/originals/0a/5f/ea/0a5feae400fc816c4ca2aca8bd67a168.jpg"
                                    alt="login"
                                    className="rounded-full m-auto p-1 border"
                                    width="100px"
                                    height="100px"
                                />
                                <h3 className="pt-8 font-bold text-4xl text-center tracking-wider text-white">
                                    Login
                                </h3>
                            </div>

                            <form className="pt-8 rounded" onSubmit={handleSubmit}>
                                {/* Username/Email Field */}
                                <div className="mb-4">
                                    <input
                                        name="username"
                                        className={`w-full px-3 py-3 text-sm leading-normal text-gray-50 border-0 bg-[#ffffff1a] rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.username ? 'border border-red-500' : ''}`}
                                        type="email"
                                        placeholder="Email"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="mb-4">
                                    <input
                                        name="password"
                                        className={`w-full px-3 py-3 text-sm leading-normal text-gray-50 border-0 bg-[#ffffff1a] rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.password ? 'border border-red-500' : ''}`}
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error?.userInfo && (
                                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
                                        <strong>Error:</strong> {error.userInfo}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="mb-6 text-center">
                                    <button
                                        disabled={loading.userInfo}
                                        className={`w-full px-4 py-3 font-bold tracking-wider text-[#000] rounded-lg bg-white hover:bg-gray-200 focus:outline-none focus:shadow-outline ${loading.userInfo ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        type="submit"
                                    >
                                        {loading.userInfo ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>

                                {/* Forgot Password Link */}
                                <div className="text-center">
                                    <a
                                        href="/forgot-password"
                                        className="text-white text-sm hover:underline"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}