import { cn } from "@/lib/utils";
import type { PropsWithClassName } from "@/types/app";

export const Loading = ({ className }: PropsWithClassName) => (
  <svg
    className={cn("w-6 h-6", className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    width="200"
    height="200"
    style={{ shapeRendering: "auto", display: "block" }}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g>
      <g transform="translate(78,50)">
        <g transform="rotate(0)">
          <circle fillOpacity="1" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="-0.875s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="-0.875s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g transform="translate(69.79898987322333,69.79898987322332)">
        <g transform="rotate(45)">
          <circle fillOpacity="0.875" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="-0.75s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="-0.75s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g transform="translate(50,78)">
        <g transform="rotate(90)">
          <circle fillOpacity="0.75" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="-0.625s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="-0.625s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g transform="translate(30.201010126776673,69.79898987322333)">
        <g transform="rotate(135)">
          <circle fillOpacity="0.625" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="-0.5s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="-0.5s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g transform="translate(22,50)">
        <g transform="rotate(180)">
          <circle fillOpacity="0.5" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="-0.375s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="-0.375s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g transform="translate(30.201010126776666,30.201010126776673)">
        <g transform="rotate(225)">
          <circle fillOpacity="0.375" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="-0.25s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="-0.25s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g transform="translate(49.99999999999999,22)">
        <g transform="rotate(270)">
          <circle fillOpacity="0.25" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="-0.125s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="-0.125s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g transform="translate(69.79898987322332,30.201010126776666)">
        <g transform="rotate(315)">
          <circle fillOpacity="0.125" fill="#10c6ed" r="6" cy="0" cx="0">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.18 1.18;1 1"
              begin="0s"
              type="scale"
              attributeName="transform"
            />
            <animate
              begin="0s"
              values="1;0"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              attributeName="fillOpacity"
            />
          </circle>
        </g>
      </g>
      <g />
    </g>
  </svg>
);
