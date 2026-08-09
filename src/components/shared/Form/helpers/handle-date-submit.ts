export function handleDate(date: Date | string, edit?: boolean) {
	if (!date) return "";

	// If it's already in YYYY-MM-DD format and edit mode
	if (typeof date === "string" && date.includes("-") && edit) {
		return date;
	}

	// Convert string to Date if needed
	const dateObj = typeof date === "string" ? new Date(date) : date;

	// Validate if date is valid
	if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
		// eslint-disable-next-line no-console
		console.error("Invalid date:", date);
		return "";
	}

	// Get date components and pad with zeros if needed
	const day = dateObj.getDate().toString().padStart(2, "0");
	const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
	const year = dateObj.getFullYear();

	return `${year}-${month}-${day}`;
}
