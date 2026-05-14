export default function ScrollContainer({ children, className = "" }) {
  return (
    <div className={`
      custom-scrollbar 
      overflow-y-auto 
      scrollbar-gutter-stable
      ${className}
    `}>
      {children}
    </div>
  );
}