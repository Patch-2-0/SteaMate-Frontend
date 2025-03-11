export function Input({ value, onChange, placeholder, className }) {
    return (
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border p-2 rounded-md w-full ${className}`}
      />
    );
  }
  