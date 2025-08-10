import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePersonalDetails, setValidationErrors } from "../../features/user/userSlice";

export default function PersonalDetails() {
    const dispatch = useDispatch();
    const { personalDetails, validationErrors } = useSelector(state => ({
        personalDetails: state.user.userData.personalDetails,
        validationErrors: state.user.validationErrors.personalDetails || {}
    }));

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (personalDetails.profileImagePreview) {
                URL.revokeObjectURL(personalDetails.profileImagePreview);
            }
        };
    }, [personalDetails.profileImagePreview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updatePersonalDetails({ [name]: value }));

        if (validationErrors[name]) {
            dispatch(setValidationErrors({
                personalDetails: { ...validationErrors, [name]: '' }
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.(jpeg|jpg|png|gif)')) {
            dispatch(setValidationErrors({
                personalDetails: {
                    ...validationErrors,
                    profileImage: 'Only JPEG, PNG, or GIF images are allowed'
                }
            }));
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            dispatch(setValidationErrors({
                personalDetails: {
                    ...validationErrors,
                    profileImage: 'Image must be smaller than 2MB'
                }
            }));
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        // Update Redux store
        dispatch(updatePersonalDetails({
            profileImage: file,
            profileImagePreview: previewUrl
        }));

        // Clear any previous error
        if (validationErrors.profileImage) {
            dispatch(setValidationErrors({
                personalDetails: { ...validationErrors, profileImage: '' }
            }));
        }
    };

    return (
        <div className="flex w-full p-2">
            <div className="w-full">
                <h1 className="block text-left w-full text-gray-500 text-2xl font-bold mb-6">
                    Personal Details
                </h1>

                <form>
                    {/* Profile Image Upload */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                            Profile Image
                        </label>
                        <div className="mt-1 flex flex-col items-start">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                                <img
                                    src={personalDetails.profileImagePreview ||
                                        "https://images.unsplash.com/photo-1531316282956-d38457be0993?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="flex flex-col items-center px-4 py-2 bg-blue-100 text-gray-700 rounded-lg shadow cursor-pointer hover:bg-blue-200 transition-colors">
                                    <span className="text-sm font-medium">Choose Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        accept="image/jpeg, image/png, image/gif"
                                    />
                                </label>
                                {validationErrors.profileImage && (
                                    <p className="text-red-500 text-xs italic mt-1">
                                        {validationErrors.profileImage}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name and Gender */}
                    <div className="grid gap-x-7 md:grid-cols-2">
                        <div className="mb-4">
                            <label
                                className="block mb-2 text-sm font-medium text-gray-700 text-left"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                className={`w-full sm:w-64 md:w-72 lg:w-80 px-3 py-2 text-sm text-gray-700 border ${validationErrors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your full name"
                                value={personalDetails.name || ""}
                                onChange={handleChange}
                            />
                            {validationErrors.name && (
                                <p className="text-red-500 text-xs italic mt-1">
                                    {validationErrors.name}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                                Gender
                            </label>
                            <div className="flex space-x-4">
                                {["Male", "Female", "Other"].map((gender) => (
                                    <div key={gender} className="flex items-center">
                                        <input
                                            id={`gender-${gender}`}
                                            type="radio"
                                            name="gender"
                                            value={gender}
                                            checked={personalDetails.gender === gender}
                                            onChange={() => {
                                                dispatch(
                                                    updatePersonalDetails({ gender })
                                                );
                                                if (validationErrors.gender) {
                                                    dispatch(
                                                        setValidationErrors({
                                                            personalDetails: {
                                                                ...validationErrors,
                                                                gender: "",
                                                            },
                                                        })
                                                    );
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`gender-${gender}`}
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            {gender}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {validationErrors.gender && (
                                <p className="text-red-500 text-xs italic mt-1">
                                    {validationErrors.gender}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-700 text-left"
                            htmlFor="phoneNumber"
                        >
                            Phone Number
                        </label>
                        <input
                            className={`w-full sm:w-64 md:w-72 lg:w-80 px-3 py-2 text-sm text-gray-700 border ${validationErrors.phoneNumber
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="Phone"
                            value={personalDetails.phoneNumber || ""}
                            onChange={handleChange}
                        />
                        {validationErrors.phoneNumber && (
                            <p className="text-red-500 text-xs italic mt-1">
                                {validationErrors.phoneNumber}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}