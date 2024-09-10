import { cn } from "@/lib/utils";
import type { PropsWithClassName } from "@/types/app";

const DiamondIcon = ({ className }: PropsWithClassName) => (
  <svg
    className={cn("-translate-y-[8%]", className)}
    width="20"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_7784_10487)">
      <path
        d="M20.4583 2.29168L18.4167 1.95832L18.0833 0L17.7917 2L15.875 2.29168L17.7917 2.58332L18.0833 4.58332L18.4167 2.625L20.4583 2.29168Z"
        fill="#FFD15C"
      />
      <path
        d="M3.95863 0L3.87531 0.79168L3.04199 0.91668L3.83363 1.04168L3.95863 1.83332L4.12531 1.04168L4.91699 0.91668L4.08363 0.79168L3.95863 0Z"
        fill="#FFD15C"
      />
      <path
        d="M2.83363 2.54168L2.62531 1.125L2.41699 2.54168L1.04199 2.75L2.41699 3L2.62531 4.41668L2.83363 3L4.29199 2.75L2.83363 2.54168Z"
        fill="#CDD6E0"
      />
      <path
        d="M13.6247 8.41686L11.083 3.5835H10.0414L7.20801 8.41686H13.6247Z"
        fill="#84DBFF"
      />
      <path
        d="M16.8747 3.5835H11.083L13.6247 8.41686L16.8747 3.5835Z"
        fill="#54C0EB"
      />
      <path
        d="M20.375 8.41686L16.9167 3.5835H16.875L13.625 8.41686H20.375Z"
        fill="#84DBFF"
      />
      <path
        d="M10.458 19.9998L13.6247 8.4165H7.20801L10.458 19.9998Z"
        fill="#F2F2F2"
      />
      <path
        d="M10.042 3.5835H4.04199L7.20863 8.41686L10.042 3.5835Z"
        fill="#54C0EB"
      />
      <path
        d="M4.04199 3.5835H4.00031L0.541992 8.41686H7.20863L4.04199 3.5835Z"
        fill="#84DBFF"
      />
      <path
        d="M20.3753 8.4165L10.4586 19.9998L0.541992 8.4165H7.20863L10.4586 19.9998L13.6253 8.4165H20.3753Z"
        fill="#54C0EB"
      />
      <path
        d="M13.6257 7.125L13.459 8.20832L12.334 8.375L13.459 8.54168L13.6257 9.70832L13.7923 8.54168L14.9173 8.375L13.7923 8.20832L13.6257 7.125Z"
        fill="white"
      />
      <path
        d="M5.45863 4.7085L5.29199 5.79186L4.16699 5.9585L5.25031 6.12518L5.45863 7.29186L5.62531 6.16686L6.75031 5.9585L5.62531 5.79186L5.45863 4.7085Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_7784_10487">
        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default DiamondIcon;
