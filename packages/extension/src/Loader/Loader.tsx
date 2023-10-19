import React from "react";

export const Loader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="8"
      viewBox="0 0 26 8"
      fill="#808080"
    >
      <circle cx="4" cy="4" r="0">
        <animate
          attributeName="r"
          from="4"
          to="4"
          begin="0s"
          dur="1.4s"
          values="0;4;0;0"
          calcMode="spline"
          keySplines="0.5 0 0.5 1; 0 0 1 1; 0.5 0 0.5 1"
          repeatCount="indefinite"
          keyTimes="0;0.4;0.8;1"
        />
      </circle>
      <circle cx="13" cy="4" r="0">
        <animate
          attributeName="r"
          from="4"
          to="4"
          begin="0.16s"
          dur="1.4s"
          values="0;4;0;0"
          calcMode="spline"
          keySplines="0.5 0 0.5 1; 0 0 1 1; 0.5 0 0.5 1"
          repeatCount="indefinite"
          keyTimes="0;0.4;0.8;1"
        />
      </circle>
      <circle cx="22" cy="4" r="0">
        <animate
          attributeName="r"
          from="4"
          to="4"
          begin="0.32s"
          dur="1.4s"
          values="0;4;0;0"
          calcMode="spline"
          keySplines="0.5 0 0.5 1; 0 0 1 1; 0.5 0 0.5 1"
          repeatCount="indefinite"
          keyTimes="0;0.4;0.8;1"
        />
      </circle>
    </svg>
  );
};
