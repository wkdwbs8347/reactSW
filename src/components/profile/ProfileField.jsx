export default function ProfileField({ label, value, editable, onEdit }) {
  return (
    <div className="flex justify-between items-center border-b border-base-100 py-4 text-neutral">

      <div>
        <p className="font-semibold">{label}</p>
        <p>{value}</p>
      </div>

      {editable && (
        <button 
          className="text-sm text-primary font-semibold hover:underline"
          onClick={onEdit}
        >
          수정
        </button>
      )}
    </div>
  )
}