import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'
import { getcountry, getState, setValidationErrors, updateCountryDetails } from "../../features/user/userSlice";

export default function CountryDetails() {
    const dispatch = useDispatch();
    const {
        countryList,
        stateList,
        userData: { countryDetails },
        validationErrors: { countryDetails: errors = {} }
    } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getcountry());
    }, [dispatch]);

    useEffect(() => {
        if (countryDetails?.country?.value) {
            dispatch(getState(countryDetails.country.value));
        }
    }, [countryDetails?.country?.value, dispatch]);

    const countryOptions = countryList?.map(country => ({
        value: country.id,
        label: country.name
    })) || [];

    const stateOptions = stateList?.map(state => ({
        value: state.id,
        label: state.name
    })) || [];

    const handleCountryChange = (selectedOption) => {
        dispatch(updateCountryDetails({
            country: selectedOption,
            state: null // Reset state when country changes
        }));
        if (errors.country) {
            dispatch(setValidationErrors({
                countryDetails: { ...errors, country: '' }
            }));
        }
    };

    const handleStateChange = (selectedOption) => {
        dispatch(updateCountryDetails({ state: selectedOption }));
        if (errors.state) {
            dispatch(setValidationErrors({
                countryDetails: { ...errors, state: '' }
            }));
        }
    };

    return (
        <div className="flex w-full p-2">
            <div className="w-full">
                <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">
                    Details
                </h1>
                <form>
                    <div className="grid gap-2 md:grid-cols-2">
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                                Select Country
                            </label>
                            <Select
                                className={`basic-single text-left text-sm text-gray-700 rounded border ${errors.country ? 'border-red-500' : 'border-gray-200'}`}
                                classNamePrefix="select"
                                options={countryOptions}
                                isLoading={!countryList}
                                placeholder="Select country"
                                onChange={handleCountryChange}
                                value={countryDetails?.country || null}
                            />
                            {errors.country && (
                                <p className="text-red-500 text-xs italic mt-1">{errors.country}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
                                Select State
                            </label>
                            <Select
                                className={`basic-single text-left text-sm rounded text-gray-700 border ${errors.state ? 'border-red-500' : 'border-gray-200'}`}
                                classNamePrefix="select"
                                options={stateOptions}
                                isLoading={countryDetails?.country?.value && !stateList}
                                placeholder={countryDetails?.country ? "Select state" : "Select country first"}
                                onChange={handleStateChange}
                                value={countryDetails?.state || null}
                                isDisabled={!countryDetails?.country}
                            />
                            {errors.state && (
                                <p className="text-red-500 text-xs italic mt-1">{errors.state}</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}