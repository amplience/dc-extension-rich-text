import React from "react";

type ToolbarIconProps = {
  readOnly?: boolean;
  style?: React.CSSProperties;
  variant?: "workforce" | "ai-assistant";
};

export const ToolbarIcon = (props: ToolbarIconProps) => {
  const { readOnly, style, variant = "ai-assistant" } = props;
  return variant === "workforce" ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      style={{ flex: "0 0 auto", ...style }}
      fill="none"
      viewBox="0 0 400 400"
    >
      <path
        d="M381.662 116.232C393.431 141.713 400 170.089 400 200C400 310.457 310.457 400 200 400C136.541 400 79.9878 370.443 43.3486 324.348C58.3951 284.599 108.148 226.011 123.43 219.058C176.772 194.789 214.376 267.59 267.086 245.576C311.385 227.074 357.39 151.331 381.662 116.232Z"
        fill="url(#paint0_linear_4899_131)"
      />
      <path
        d="M200 0C264.131 0 321.209 30.1857 357.809 77.1221C340.826 116.624 294.35 170.935 279.672 177.614C226.33 201.884 188.725 129.082 136.016 151.096C89.953 170.334 42.0443 251.463 18.6436 284.433C6.68083 258.781 0 230.171 0 200C0 89.5431 89.5431 0 200 0Z"
        fill="url(#paint1_linear_4899_131)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4899_131"
          x1="101.768"
          y1="379.368"
          x2="337.413"
          y2="-14.5436"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0472256" stop-color="#7C81FF" />
          <stop offset="0.485343" stop-color="#9747FF" />
          <stop offset="1" stop-color="#F8855D" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4899_131"
          x1="101.768"
          y1="379.368"
          x2="337.413"
          y2="-14.5436"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0472256" stop-color="#7C81FF" />
          <stop offset="0.485343" stop-color="#9747FF" />
          <stop offset="1" stop-color="#F8855D" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      style={{ flex: "0 0 auto", ...style }}
      fill={readOnly ? "#D9D9D9" : "#F88B8B"}
      viewBox="5.34 5.34 21.33 21.33"
    >
      <path d="M19.022 7.887a.578.578 0 0 1 1.098 0l.97 2.644c.479 1.303 1.455 2.333 2.69 2.837l2.51 1.024c.5.205.5.952 0 1.157l-2.51 1.024c-1.235.504-2.212 1.534-2.69 2.836l-.97 2.645a.578.578 0 0 1-1.098 0l-.97-2.645c-.479-1.302-1.455-2.332-2.69-2.836l-2.509-1.024c-.501-.205-.501-.952 0-1.157l2.508-1.024c1.236-.504 2.212-1.534 2.69-2.837l.971-2.644ZM11.252 18.767a.289.289 0 0 1 .549 0l.567 1.544a2.42 2.42 0 0 0 1.345 1.419l1.465.597c.25.103.25.477 0 .579l-1.465.598a2.42 2.42 0 0 0-1.345 1.418l-.567 1.545a.289.289 0 0 1-.549 0l-.567-1.545a2.42 2.42 0 0 0-1.345-1.418l-1.465-.598c-.25-.102-.25-.476 0-.579l1.465-.597a2.42 2.42 0 0 0 1.345-1.419l.567-1.544ZM8.9 5.533a.289.289 0 0 1 .548 0l.567 1.545a2.42 2.42 0 0 0 1.345 1.418l1.465.598c.251.102.251.476 0 .579l-1.464.597a2.42 2.42 0 0 0-1.346 1.419l-.567 1.544a.289.289 0 0 1-.548 0l-.567-1.544a2.42 2.42 0 0 0-1.345-1.419l-1.465-.597c-.25-.103-.25-.477 0-.579l1.465-.598a2.42 2.42 0 0 0 1.345-1.418L8.9 5.533Z" />
    </svg>
  );
};
