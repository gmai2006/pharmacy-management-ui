export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by Name or Rx#"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-1/3 p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
    />
  );
}