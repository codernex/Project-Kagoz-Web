import { cn } from "@/lib/utils";

interface IProps {
  className?: string;
  width?: string;
  height?: string;
}
export default function Clock({ className, width, height }: IProps) {
  return (
    <svg
      className={cn("", className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_171_2191)">
        <path
          d="M7 14.5C10.865 14.5 14 11.365 14 7.5C14 3.63499 10.865 0.5 7 0.5C3.13499 0.5 0 3.63499 0 7.5C0 11.365 3.13499 14.5 7 14.5ZM6.49998 3.50001C6.49998 3.225 6.72499 2.99999 7 2.99999C7.27501 2.99999 7.50001 3.225 7.50001 3.50001V7.26L9.81251 9.11001C10.0275 9.28251 10.0625 9.59749 9.89 9.8125C9.79249 9.93499 9.64751 9.99999 9.49999 9.99999C9.38999 9.99999 9.27998 9.96497 9.18751 9.88999L6.68752 7.89001C6.57002 7.79499 6.50003 7.65251 6.50003 7.5V3.50001H6.49998Z"
          fill="#3890F7"
        />
      </g>
      <defs>
        <clipPath id="clip0_171_2191">
          <rect
            width={width}
            height={height}
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
