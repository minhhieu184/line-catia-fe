import type { SVGProps } from "react";

export const ErrorBadgeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="5.5" fill="#F73131" stroke="#12274E" />
  </svg>
);
