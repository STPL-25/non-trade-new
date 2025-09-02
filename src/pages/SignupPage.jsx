import React, { useState,useContext } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpFields } from "../Data/SignUpData";
import stplimage from "../assets/stpllogo.png";
import { CustomInputField } from "@/componentss/AdditionalComponent/CustomInputField";
import { ParentContext } from "@/ParentContext/ParentContext";
export default function SignUp() {
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({});
  const {formData={}, setFormData} = useContext(ParentContext);
  const signUpFields = useSignUpFields(formData);

  const handleInputChange = (field, value) => {
    console.log(`Field: ${field}, Value:`, value); // Better logging

    const fieldDef = signUpFields.find((f) => f.field === field);
    if (fieldDef && fieldDef.type === "select" && typeof value === "string") {
      const selectedOption = fieldDef.options.find((opt) => opt.value == value);
      setFormData((prev) => ({
        ...prev,
        [field]: selectedOption,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  console.log(formData);
  const handleSubmit = (e) => {
    navigate("/");
  };
const handleSendOTP=async () => { 

}
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 p-4">
      <div className="w-full max-w-6xl rounded-lg bg-white shadow-2xl flex overflow-hidden">
        {/* Left side - Welcome Panel */}
        <div className="relative hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800 p-12 text-white md:flex">
          <img src={stplimage} alt="STPL Logo" />
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500 opacity-40" />
          <h2 className="text-base uppercase mb-8 tracking-[0.3em] font-extrabold text-white">
            STPL NON TRADE APPLICATION
          </h2>
        </div>

        {/* Right side - Signup form */}
        <div className="flex w-full md:w-1/2 flex-col justify-center p-12">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>

            <form onSubmit={handleSubmit} className="space-y-2">
              {signUpFields.map((fieldDef) => (
                <CustomInputField
                  key={fieldDef.field}
                  field={fieldDef.field}
                  label={fieldDef.label}
                  required={fieldDef.require !== false}
                  type={fieldDef.type || "text"}
                  placeholder={fieldDef.placeholder}
                  options={fieldDef.options || []}
                  value={formData ? formData[fieldDef.field] || "" : ""}
                  maxLength={fieldDef?.maxLength }
                  onChange={(val) => handleInputChange(fieldDef.field, val)}
                />
              ))}

              {/* Submit Button */}
               <Button 
                type="button"
                onClick={() => handleSendOTP()}
                className="w-full bg-green-800 hover:bg-green-600 py-3 text-white font-medium"
              >
                Send OTP
              </Button>
              <Button 
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 py-3 text-white font-medium"
              >
                Create Account
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link  to="/" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
