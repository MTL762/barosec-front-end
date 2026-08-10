import type { FormLangs } from "./CustomFormTypes.types";

const locales = ["ar", "en"];

const styles = {
	languageButton: {
		padding: "5px 10px",
		margin: "0 5px",
		border: "none",
		borderBottom: "2px solid transparent",
		backgroundColor: "transparent",
		cursor: "pointer",
	},
	activeButton: {
		borderBottom: "2.5px solid blue",
	},
};

export default function InputLangSwitcher({
	selectedLang,
	setSelectedLang,
}: {
	selectedLang: FormLangs;
	setSelectedLang: (lang: FormLangs) => void;
}) {
	const handleLangChange = (lang: FormLangs) => {
		setSelectedLang(lang);
	};

	return (
		<div className="col-span-6 mt-2">
			{locales.map((lang) => (
				<button
					type="button"
					key={lang}
					onClick={() => handleLangChange(lang as FormLangs)}
					style={{
						...styles.languageButton,
						...(selectedLang === lang ? styles.activeButton : {}),
					}}
				>
					{lang}
				</button>
			))}
			<hr />
		</div>
	);
}
