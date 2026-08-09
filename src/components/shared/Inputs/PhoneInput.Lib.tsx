import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Dark mode styles and custom Syria flag
const darkModeStyles = `
.dark .react-tel-input .form-control {
   background-color: #1f2937;
   color: #e5e7eb;
   border-color: #4b5563;
}

.dark .react-tel-input .selected-flag {
   background-color: #374151;
}

.dark .react-tel-input .selected-flag:hover {
   background-color: #4b5563;
}

.dark .react-tel-input .country-list {
   background-color: #1f2937;
   border-color: #4b5563;
}

.dark .react-tel-input .country-list .country {
   color: #e5e7eb;
}

.dark .react-tel-input .country-list .country:hover {
   background-color: #374151;
}

.dark .react-tel-input .country-list .country.highlight {
   background-color: #4b5563;
}

.dark .react-tel-input .flag-dropdown.open {
   background-color: #1f2937;
   border-color: #4b5563;
}

.dark .react-tel-input .search-box {
   background-color: #1f2937;
   color: #e5e7eb;
   border-color: #4b5563;
}

/* Custom Syria flag override */
.react-tel-input .flag.sy {
   background-image: url('/SY.svg') !important;
   background-size: contain !important;
   
   box-shadow: 0 0 1px #0003;
   border-radius: 2px;
}
`;

const CustomPhoneInput = ({
	name,
	placeholder = "",
	disabled,
	value,
	onChange,
}: {
	value?: string;
	name: string;
	placeholder?: string;
	disabled?: boolean;
	onChange: (value: string) => void;
}) => {
	const [phoneValue, setPhoneValue] = useState(value || "");
	const [country, setCountry] = useState(""); // يسمح للمستخدم بتحديد أي كود دولة
	const { theme } = useTheme();

	const handleChange = (inputValue: string) => {
		setPhoneValue(inputValue);

		// التعرف على كود البلد إذا كان الرقم صحيحًا
		const phoneNumber = parsePhoneNumberFromString(inputValue);
		if (phoneNumber && phoneNumber.country) {
			setCountry(phoneNumber.country.toLowerCase());
		}

		onChange(inputValue);
	};

	// Inject dark mode styles
	useEffect(() => {
		if (!document.getElementById("phone-input-dark-mode-styles")) {
			const styleElement = document.createElement("style");
			styleElement.id = "phone-input-dark-mode-styles";
			styleElement.innerHTML = darkModeStyles;
			document.head.appendChild(styleElement);

			return () => {
				const styleTag = document.getElementById(
					"phone-input-dark-mode-styles",
				);
				if (styleTag) {
					document.head.removeChild(styleTag);
				}
			};
		}
	}, []);

	return (
		<div className=" !w-full">
			<div
				dir="ltr"
				className={`border-none w-full focus-visible:!border-none focus:border-none  border-gray-300 dark:border-gray-700 rounded-md`}
			>
				<PhoneInput
					autoFormat
					enableAreaCodeStretch
					containerClass="w-full"
					inputClass={`w-full border dark:bg-gray-800 dark:text-gray-200 ${
						theme === "dark" ? "dark:border-gray-700" : "border-gray-300"
					}`}
					buttonClass="rounded-md !bg-transparent mr-[2rem]"
					searchClass="mr-2"
					dropdownClass="w-full !overflow-x-hidden"
					enableSearch
					disableSearchIcon
					value={phoneValue}
					country={country || undefined} // يظل الكود الذي يدخله المستخدم حتى يتم التعرف على دولة
					onChange={handleChange}
					inputProps={{
						name: name,
						required: true,
						placeholder: placeholder,
						disabled: disabled,
					}}
					countryCodeEditable
					preferredCountries={["sa", "ae", "us", "gb", "eg"]}
					excludeCountries={["il"]}
				/>
			</div>
		</div>
	);
};

export default CustomPhoneInput;
