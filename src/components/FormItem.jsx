export default function FormItem({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>
      {children}
    </div>
  );
}