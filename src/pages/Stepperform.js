import React, { useEffect, useState } from 'react';
import Personaldetails from "./stepperform/personaldetails";
import Countrydetails from "./stepperform/countrydetails";
import Skillsdetails from "./stepperform/skillsdetails";
import Credentaildetails from "./stepperform/credentaildetails";
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { validateCountryDetails, validateCredentialDetails, validatePersonalDetails, validateSkillsDetails } from '../utils/functions/validation';
import { addUser, setValidationErrors } from '../features/user/userSlice';
import ShowAlert from '../component/Aleart/ShowAlert';
const steps = ['Personal Information', 'Details', 'Skills Details', "Credentail Details"];




export default function Stepperform() {
    const dispatch = useDispatch();
    const { userData, validationErrors } = useSelector(state => state.user);
    const [activeStep, setActiveStep] = useState(() => {
        const savedStep = localStorage.getItem('activeStep');
        // Reset to 0 if previously completed
        return savedStep && Number(savedStep) < steps.length ? Number(savedStep) : 0;
    });

    useEffect(() => {
        localStorage.setItem('activeStep', activeStep);

        // Cleanup function to reset if navigating away
        return () => {
            if (activeStep === steps.length) {
                localStorage.removeItem('activeStep');
            }
        };
    }, [activeStep]);

    const validateCurrentStep = () => {
        let errors = {};

        switch (activeStep) {
            case 0:
                errors.personalDetails = validatePersonalDetails(userData.personalDetails);
                break;
            case 1:
                errors.countryDetails = validateCountryDetails(userData.countryDetails);
                break;
            case 2:
                errors.skillsDetails = validateSkillsDetails(userData.skillsDetails);
                break;
            case 3:
                errors.credentialDetails = validateCredentialDetails(userData.credentialDetails);
                break;
            default:
                break;
        }

        dispatch(setValidationErrors(errors));
        return Object.keys(errors).length === 0 ||
            Object.values(errors).every(error => Object.keys(error).length === 0);
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        if (validateCurrentStep()) {
            try {
                const response = await dispatch(addUser(userData)).unwrap();
                setActiveStep(steps.length);
                ShowAlert(`${response.message}`, "success");
                localStorage.removeItem('activeStep');
                console.log("data saved success");

            } catch (error) {
                ShowAlert(`Error: ${error}`, "error");
                console.error('Error submitting form:', error);
            }
        }
    };


    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Personaldetails />
                );
            case 1:
                return (
                    <Countrydetails />
                );
            case 2:
                return (
                    <Skillsdetails />
                );
            case 3:
                return (
                    <Credentaildetails />
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <>
            <div className="bg-white p-4 mb-2 rounded-lg dark:border-gray-700 mt-14">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">Stepper Form</h3>
                </div>
            </div>
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700 mb-2">
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>
            </div>
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700">
                    {activeStep === steps.length ? (
                        <div className="flex justify-center w-full mt-5">
                            <div className="p-8 m-4">
                                <Typography variant="h5" className='mt-10 mb-10 pb-10'>Thank you for submitting the form!</Typography>
                                <button
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    onClick={() => window.location.href = '/List'}
                                >
                                    View List
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">{getStepContent(activeStep)}</div>
                            <div className='flex justify-center'>
                                <div className='flex justify-between w-full mt-4'>
                                    <Button
                                        variant="outlined"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                    >
                                        {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

