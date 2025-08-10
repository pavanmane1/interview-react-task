import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSkill, removeSkill, setValidationErrors } from "../../features/user/userSlice";


export default function SkillsDetails() {
  const dispatch = useDispatch();
  const {
    userData: { skillsDetails },
    validationErrors: { skillsDetails: errors = {} },
  } = useSelector((state) => state.user);

  const [newSkill, setNewSkill] = useState("");
  const [localError, setLocalError] = useState(""); // ✅ local validation

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      setLocalError("Enter skill"); // show error
      return;
    }

    dispatch(addSkill(newSkill.trim()));
    setNewSkill("");
    setLocalError(""); // clear error

    // Clear Redux validation error if any
    if (errors.skills) {
      dispatch(
        setValidationErrors({
          skillsDetails: { ...errors, skills: "" },
        })
      );
    }
  };

  const handleRemoveSkill = (index) => {
    dispatch(removeSkill(index));
  };

  return (
    <>
      <div className="flex w-full p-2">
        <div className="w-full">
          <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">
            Skills Details
          </h1>
          <form>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-700 text-left"
                htmlFor="skills"
              >
                Skills
              </label>

              {/* Existing Skills */}
              {skillsDetails?.skills?.map((skill, index) => (
                <div key={index} className="flex space-x-6 mb-4">
                  <input
                    type="text"
                    value={skill}
                    readOnly
                    className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded appearance-none focus:outline-none focus:shadow-outline"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* New Skill Input */}
              <div className="flex space-x-6 mb-1">
                <input
                  type="text"
                  placeholder="Add Skills"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Show local validation error */}
              {localError && (
                <p className="text-red-500 text-xs italic mb-2">{localError}</p>
              )}

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddSkill}
                className="text-white bg-blue-700 text-left flex hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                Add Skills
              </button>

              {/* Redux validation error */}
              {errors.skills && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.skills}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}