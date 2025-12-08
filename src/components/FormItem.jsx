export function FormItem({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-brown_text">{label}</label>
      {children}
    </div>
  );
}