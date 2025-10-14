import React, { useState } from "react";
import { FormState } from "@/routers/database-create/database-create.types";
import { StepFirst } from "./views/step-first";
import { StepSecond } from "./views/step-second";
import { StepThird } from "./views/step-third";

const initialState: FormState = {
  dbType: null,
  dbName: "",
  mysqlCharset: "utf8mb4",
  mysqlCollation: "utf8mb4_unicode_ci",
  postgresOwner: "postgres",
  postgresEncoding: "UTF8",
};

export default function DatabaseCreatePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.dbType) {
        setError("Please select a database system.");
        return;
      }
      if (!formData.dbName.trim()) {
        setError("Database name cannot be empty.");
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(formData.dbName)) {
        setError("Name can only contain letters, numbers, and underscores.");
        return;
      }
    }

    setError(null);
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const generateSqlCommand = (): string => {
    if (formData.dbType === "mysql") {
      return `CREATE DATABASE \`${formData.dbName}\`\nCHARACTER SET = ${formData.mysqlCharset}\nCOLLATE = ${formData.mysqlCollation};`;
    }
    if (formData.dbType === "postgres") {
      return `CREATE DATABASE "${formData.dbName}"\nOWNER = "${formData.postgresOwner}"\nENCODING = '${formData.postgresEncoding}';`;
    }
    return "No database type selected.";
  };

  const handleCreateDatabase = () => {
    console.log("Submitting form data:", formData);
    console.log("SQL Command:", generateSqlCommand());
    
    alert(
      `Database "${formData.dbName}" creation process initiated! Check the console for details.`
    );

    setFormData(initialState);
    setStep(1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <StepFirst formData={formData} setFormData={setFormData} />;
      case 2:
        return <StepSecond formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <StepThird formData={formData} generatedSql={generateSqlCommand()} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s, index) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    step >= s ? "bg-blue-400" : "bg-gray-300"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    step >= s ? "text-blue-400 font-semibold" : "text-gray-500"
                  }`}
                >
                  {s === 1 ? "Info" : s === 2 ? "Config" : "Review"}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`flex-auto border-t-2 transition-colors duration-500 ${
                    step > s ? "border-blue-400" : "border-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6">{renderStepContent()}</div>

        {error && (
          <div className="mt-4 text-red-400 text-sm text-center">{error}</div>
        )}

        <div className="mt-8 pt-6 flex justify-between">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={step < 3 ? handleNextStep : handleCreateDatabase}
            className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            {step < 3 ? "Next" : "Create Database"}
          </button>
        </div>
      </div>
    </div>
  );
}
