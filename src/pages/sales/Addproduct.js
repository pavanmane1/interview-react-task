import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../features/product/productSlice";
import ShowAlert from "../../component/Aleart/ShowAlert";
import { ToastContainer } from "react-toastify";


export default function Addproduct() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        price: "",
        image: ""
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            name: "",
            description: "",
            price: "",
            image: ""
        };

        // Name validation
        if (!productData.name.trim()) {
            newErrors.name = "Product name is required";
            valid = false;
        } else if (productData.name.length > 100) {
            newErrors.name = "Product name must be less than 100 characters";
            valid = false;
        }

        // Description validation
        if (!productData.description.trim()) {
            newErrors.description = "Description is required";
            valid = false;
        } else if (productData.description.length > 500) {
            newErrors.description = "Description must be less than 500 characters";
            valid = false;
        }

        // Price validation
        if (!productData.price) {
            newErrors.price = "Price is required";
            valid = false;
        } else if (isNaN(productData.price)) {
            newErrors.price = "Price must be a number";
            valid = false;
        } else if (Number(productData.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
            valid = false;
        }

        // Image validation
        if (!productData.image) {
            newErrors.image = "Product image is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                setErrors(prev => ({ ...prev, image: "Please select an image file" }));
                return;
            }

            // Validate file size (e.g., 2MB max)
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: "File size must be less than 2MB" }));
                return;
            }

            // Create preview URL
            setPreview(URL.createObjectURL(file));
            setProductData(prev => ({ ...prev, image: file }));
            setErrors(prev => ({ ...prev, image: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            ShowAlert("Please fix the errors in the form", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", productData.name);
            formData.append("description", productData.description);
            formData.append("price", productData.price);
            formData.append("image", productData.image);

            const response = await dispatch(addProduct(formData)).unwrap();

            // Show success message and navigate when it closes
            ShowAlert(`${response.message}`, "success", () => {
                navigate('/product');
            });

        } catch (error) {
            ShowAlert(`Error: ${error}`, "error");
        }
    };

    return (
        <>
            <div className="bg-white p-4 mb-2 rounded-lg dark:border-gray-700 mt-14">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
                        Add Product
                    </h3>
                </div>
            </div>
            <ToastContainer />
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700">
                    <div className="">
                        <div className="w-full">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                                        Product Name
                                    </label>
                                    <input
                                        className={`w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                                        name="name"
                                        type="text"
                                        placeholder="Product Name"
                                        value={productData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                                        Product Image
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 border-2 ${errors.image ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}>
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        SVG, PNG, JPG or GIF (MAX. 2MB)
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                name="image"
                                                className="hidden"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Description"
                                        className={`w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''}`}
                                        name="description"
                                        value={productData.description}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                                        Price
                                    </label>
                                    <input
                                        className={`w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.price ? 'border-red-500' : ''}`}
                                        name="price"
                                        type="number"
                                        placeholder="Price"
                                        value={productData.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                </div>

                                <div className='flex justify-between'>
                                    <Link to="/Product" type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                        Back
                                    </Link>
                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}