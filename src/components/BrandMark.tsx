export default function BrandMark({ size = 20 }: { size?: number }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Leaf */}
      <path
        d="M14.4 3.6c-2.5 1-4.3 3.1-4.9 5.8 2.7.6 4.9-.2 6.4-2.1.8-1 .9-2.4.3-3.7-.6-.8-1.3-1-1.8 0Z"
        fill="#7F9882"
        opacity="0.95"
      />
      <path
        d="M14.2 6.1c-1.2 1.1-2.2 2.6-2.5 4.2"
        stroke="#657D68"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Tomato body */}
      <path
        d="M12 4.9c-2.1-2.3-7.6-.9-7.6 3.5 0 3.4 3 3.7 3 6.3 0 3 2.2 5.4 4.6 5.4 2.5 0 4.6-2.4 4.6-5.4 0-2.6 3-2.9 3-6.3 0-4.4-5.5-5.8-7.6-3.5Z"
        fill="#B46A5E"
        opacity="0.98"
      />
      <path
        d="M7.7 10.2c.7 0 1.3.4 1.6.9"
        stroke="#8D5850"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M9.2 6.9c1.2-.7 2.5-.7 3.7 0"
        stroke="#FFD3CE"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

