export default function ErrorMessage({ error }: { error: string }) {
	return <p className="text-red-500  font-semibold text-md">{error}</p>;
}
