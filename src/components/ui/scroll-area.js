export function ScrollArea({ children, className }) {
    return (
      <div className={`overflow-auto h-[300px] p-2 ${className}`}>
        {children}
      </div>
    );
  }
  