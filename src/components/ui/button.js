export function Button({ children, onClick, className }) {
    return (
      <button onClick={onClick} className={`bg-blue-500 text-white p-2 rounded-md ${className}`}>
        {children}
      </button>
    );
  }
  