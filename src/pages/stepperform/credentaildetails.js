import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setValidationErrors, updateCredentialDetails } from "../../features/user/userSlice";

export default function Credentaildetails() {
    const dispatch = useDispatch();
    const { credentialDetails, validationErrors } = useSelector(state => ({
        credentialDetails: state.user.userData.credentialDetails,
        validationErrors: state.user.validationErrors.credentialDetails || {}
    }));

    // Local UI state for show/hide password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateCredentialDetails({ [name]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            dispatch(setValidationErrors({
                credentialDetails: { ...validationErrors, [name]: '' }
            }));
        }
    };

    return (
        <div className="flex w-full p-2">
            <div className="w-full">
                <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">
                    Credentials Details
                </h1>
                <form>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700 text-left" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={credentialDetails.email || ''}
                            placeholder="Email"
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-xs italic mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                        {/* Password */}
                        <div className="mb-4 relative">
                            <label className="block mb-2 text-sm font-medium text-left text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded shadow appearance-none focus:outline-none focus:shadow-outline pr-10"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={handleChange}
                                value={credentialDetails.password || ''}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500 text-sm"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs italic mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4 relative">
                            <label className="block mb-2 text-sm font-medium text-left text-gray-700" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded shadow appearance-none focus:outline-none focus:shadow-outline pr-10"
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={credentialDetails.confirmPassword || ''}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500 text-sm"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                            {validationErrors.confirmPassword && (
                                <p className="text-red-500 text-xs italic mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}