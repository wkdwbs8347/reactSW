export const LivelyCuteHouse = ({ size = "h-10 w-10" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`cursor-pointer ${size} inline-block`}
    viewBox="0 0 64 64"
  >
    {/* 지붕 - primary */}
    <path
      d="M32 12 Q12 32 12 36 H52 Q52 32 32 12 Z"
      className="fill-primary transition-colors duration-300 hover:fill-accent transform origin-bottom hover:-rotate-3 hover:scale-105"
    />

    {/* 집 본체 - secondary */}
    <rect
      x="20"
      y="36"
      width="24"
      height="16"
      rx="3"
      className="fill-secondary transition-colors duration-300 hover:fill-primary transform origin-bottom hover:rotate-2"
    />

    {/* 창문 왼쪽 */}
    <circle
      cx="28"
      cy="44"
      r="2"
      className="fill-base-100 transition-colors duration-300 hover:fill-accent"
    />

    {/* 창문 오른쪽 */}
    <circle
      cx="36"
      cy="44"
      r="2"
      className="fill-base-100 transition-colors duration-300 hover:fill-primary"
    />
  </svg>
);