import { Geist_Mono } from "next/font/google";
import React, { useState } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    defaultValue?: string;
    value?: string;
}

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["400"]
})

const Select: React.FC<SelectProps> = ({
    options,
    placeholder = "Select an option",
    onChange,
    className = "",
    defaultValue = "",
    value = "",
}) => {
    // Manage the selected value
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
        onChange(value); // Trigger parent handler
        // onChange(e.target.value);
    };

    return (
        <select
            className={`h-8 w-full border px-1 text-sm ${geistMono.className} ${value
                ? "text-gray-800"
                : "text-gray-600"
                } ${className}`}
            value={selectedValue}
            onChange={handleChange}
        >
            {/* Placeholder option */}
            <option
                value=""
                disabled
                className={`text-gray-700 ${geistMono.className}`}
            >
                {placeholder}
            </option>
            {/* Map over options */}
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className={`${geistMono.className}`}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;
