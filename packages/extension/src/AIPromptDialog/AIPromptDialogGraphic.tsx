import React, { useEffect, useState } from "react";

export interface AIPromptDialogGraphicProps {
  className?: string;
}

const messages = [
  "Write me a blog post about...",
  "Write a buying guide for...",
  "Write an article about...",
  "Create a list of..."
];

const frames: string[] = [];
messages.forEach(message => {
  new Array(message.length).fill("").forEach((_, length) => {
    frames.push(message.slice(0, length));
  });
  new Array(10).fill("").forEach(() => {
    frames.push(message);
  });
});

function getText(frame: number): string {
  return frames[frame % frames.length];
}

const AIPromptDialogGraphic: React.SFC<AIPromptDialogGraphicProps> = (
  props: AIPromptDialogGraphicProps
) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let nextFrame = frame;
    const animateFrame = () => {
      nextFrame++;
      setFrame(nextFrame);
    };
    const interval = setInterval(animateFrame, 50);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="777"
      height="428"
      fill="none"
      version="1.1"
      viewBox="0 0 777 428"
      {...props}
    >
      <mask
        id="mask0_1924_96628"
        style={{ maskType: "alpha" }}
        width="777"
        height="428"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <rect width="777" height="428" fill="#fff" rx="20" />
      </mask>
      <g mask="url(#mask0_1924_96628)">
        <path
          fill="url(#paint0_linear_1924_96628)"
          d="M809.39 284.915a30.001 30.001 0 0014.971-25.964V156.712a30 30 0 00-14.969-25.962L721.216 79.7a30 30 0 00-30.061 0l-88.185 51.05A30 30 0 00588 156.713v102.238a30 30 0 0014.972 25.964l88.185 51.042a30.002 30.002 0 0030.057-.001l88.176-51.041z"
        />
        <g style={{ mixBlendMode: "screen" }}>
          <path
            fill="#FFA980"
            d="M683.518 246.474A25 25 0 00696 224.833v-70.665c0-8.923-4.757-17.17-12.481-21.639L622.523 97.24a25 25 0 00-25.038 0l-61.003 35.289A25 25 0 00524 154.169v70.664a25.003 25.003 0 0012.483 21.641l61.003 35.284a25.001 25.001 0 0025.035-.001l60.997-35.283z"
          />
        </g>
        <path
          stroke="url(#paint1_linear_1924_96628)"
          strokeWidth="0.5"
          d="M614.185 214.168L530.185 306.168"
          opacity="0.5"
        />
        <path
          stroke="url(#paint2_linear_1924_96628)"
          strokeWidth="0.5"
          d="M530.122 306.781L746.122 427.781"
          opacity="0.5"
        />
        <path
          stroke="url(#paint3_linear_1924_96628)"
          strokeWidth="0.5"
          d="M530 306.749L618 306.749"
          opacity="0.5"
        />
        <path
          stroke="url(#paint4_linear_1924_96628)"
          strokeWidth="0.5"
          d="M582.137 272.208L530.137 306.208"
          opacity="0.5"
        />
        <path
          stroke="url(#paint5_linear_1924_96628)"
          strokeWidth="0.5"
          d="M530.187 306.833L637.187 427.833"
          opacity="0.5"
        />
        <path
          stroke="url(#paint6_linear_1924_96628)"
          strokeWidth="0.5"
          d="M571.279 112.668L681.885 169.994"
          opacity="0.5"
        />
        <path
          stroke="url(#paint7_linear_1924_96628)"
          strokeWidth="0.5"
          d="M682.494 169.896L743.466 -70.061"
          opacity="0.5"
        />
        <path
          stroke="url(#paint8_linear_1924_96628)"
          strokeWidth="0.5"
          d="M682.494 170.022L659.718 85.02"
          opacity="0.5"
        />
        <path
          stroke="url(#paint9_linear_1924_96628)"
          strokeWidth="0.5"
          d="M635.637 128.601L681.937 170.03"
          opacity="0.5"
        />
        <path
          stroke="url(#paint10_linear_1924_96628)"
          strokeWidth="0.5"
          d="M682.528 169.819L771.711 35.148"
          opacity="0.5"
        />
        <g opacity="0.95">
          <g style={{ mixBlendMode: "screen" }}>
            <rect
              width="264"
              height="42"
              x="524.5"
              y="167.499"
              fill="#EFF7FB"
              rx="3.5"
            />
            <rect
              width="264"
              height="42"
              x="524.5"
              y="167.499"
              stroke="url(#paint11_linear_1924_96628)"
              rx="3.5"
            />
          </g>
          <path
            fill="#216083"
            d="M548.126 181.336c.248-.639 1.152-.639 1.399 0l.305.789a8.003 8.003 0 004.574 4.573l.788.305c.639.248.639 1.152 0 1.399l-.788.306a8 8 0 00-4.574 4.573l-.305.789c-.247.639-1.151.639-1.399 0l-.305-.789a7.998 7.998 0 00-4.573-4.573l-.789-.306c-.639-.247-.639-1.151 0-1.399l.789-.305a8.001 8.001 0 004.573-4.573l.305-.789z"
          />
          <path
            fill="#216083"
            d="M537.914 179.204a.5.5 0 01.933 0l.277.717c.305.787.928 1.41 1.715 1.715l.717.277a.5.5 0 010 .933l-.717.277a3.004 3.004 0 00-1.715 1.715l-.277.717a.5.5 0 01-.933 0l-.277-.717a3.004 3.004 0 00-1.715-1.715l-.717-.277a.5.5 0 010-.933l.717-.277a3.004 3.004 0 001.715-1.715l.277-.717z"
          />
          <path
            fill="#216083"
            d="M540.051 191.313a.5.5 0 01.933 0l.277.717a2.999 2.999 0 001.715 1.715l.717.278a.5.5 0 010 .933l-.717.277a3.002 3.002 0 00-1.715 1.715l-.277.717a.5.5 0 01-.933 0l-.277-.717a3.002 3.002 0 00-1.715-1.715l-.717-.277a.5.5 0 010-.933l.717-.278a2.999 2.999 0 001.715-1.715l.277-.717z"
          />
          <text
            xmlSpace="preserve"
            style={{}}
            x="576.763"
            y="193.268"
            fill="#216083"
            fillOpacity="1"
            fontFamily="Arial"
            fontSize="12"
            fontStretch="normal"
            fontStyle="normal"
            fontVariant="normal"
            fontWeight="bold"
          >
            <tspan
              x="576.763"
              y="193.268"
              style={{ fontFamily: 'roboto, "sans-serif"' }}
              fill="#216083"
              fillOpacity="1"
              fontFamily="roboto"
              fontSize="12"
              fontStretch="normal"
              fontStyle="normal"
              fontVariant="normal"
              fontWeight="normal"
            >
              {getText(frame)}
            </tspan>
          </text>
        </g>
        <path
          fill="url(#paint12_linear_1924_96628)"
          d="M560.515 331.335A15 15 0 00568 318.353v-26.705a15 15 0 00-7.484-12.981l-22.999-13.316a15 15 0 00-15.031-.001l-23.002 13.317A15 15 0 00492 291.648v26.705c0 5.353 2.853 10.3 7.485 12.982l23.002 13.314a15 15 0 0015.03 0l22.998-13.314z"
          opacity="0.45"
        />
        <path
          fill="url(#paint13_linear_1924_96628)"
          d="M555.013 230.2A17.999 17.999 0 00564 214.619V165.38a18 18 0 00-8.986-15.58l-42.498-24.587a17.997 17.997 0 00-18.027-.001L451.986 149.8A18.002 18.002 0 00443 165.381v49.238a17.998 17.998 0 008.988 15.581l42.502 24.584a18 18 0 0018.025 0l42.498-24.584z"
          opacity="0.25"
        />
        <g fill="#EFF7FB" opacity="0.75">
          <rect width="123" height="4" x="625" y="240" rx="2" />
          <rect width="123" height="4" x="625" y="248" rx="2" />
          <rect width="123" height="4" x="625" y="256" rx="2" />
          <rect width="123" height="4" x="625" y="264" rx="2" />
          <rect width="76" height="4" x="625" y="272" rx="2" />
        </g>
        <g fill="#EFF7FB" opacity="0.45">
          <rect width="123" height="4" x="625" y="116" rx="2" />
          <rect width="123" height="4" x="625" y="124" rx="2" />
          <rect width="123" height="4" x="625" y="132" rx="2" />
          <rect width="123" height="4" x="625" y="140" rx="2" />
          <rect width="76" height="4" x="625" y="148" rx="2" />
        </g>
        <g fill="#B4C5F2" opacity="0.75">
          <rect width="123" height="4" x="625" y="287" rx="2" />
          <rect width="123" height="4" x="625" y="295" rx="2" />
          <rect width="123" height="4" x="625" y="303" rx="2" />
          <rect width="123" height="4" x="625" y="311" rx="2" />
          <rect width="76" height="4" x="625" y="319" rx="2" />
        </g>
        <g fill="#B4C5F2" opacity="0.8">
          <path d="M655.072 45.965c.494-1.278 2.303-1.278 2.797 0l1.683 4.346a11.999 11.999 0 006.859 6.86l4.347 1.682c1.278.495 1.278 2.304 0 2.798l-4.347 1.682a11.998 11.998 0 00-6.859 6.86l-1.683 4.347c-.494 1.278-2.303 1.278-2.797 0l-1.683-4.347a11.997 11.997 0 00-6.86-6.86l-4.346-1.682c-1.278-.494-1.278-2.303 0-2.798l4.346-1.682a11.997 11.997 0 006.86-6.86l1.683-4.346z" />
          <path d="M638.072 68.421c.248-.639 1.152-.639 1.399 0l1.021 2.637a5.999 5.999 0 003.43 3.43l2.637 1.02c.639.248.639 1.152 0 1.4l-2.637 1.02a5.999 5.999 0 00-3.43 3.43l-1.021 2.637c-.247.64-1.151.64-1.399 0l-1.02-2.637a6.002 6.002 0 00-3.43-3.43l-2.637-1.02c-.639-.248-.639-1.152 0-1.4l2.637-1.02a6.001 6.001 0 003.43-3.43l1.02-2.637z" />
          <path d="M632.895 40.807c.247-.639 1.151-.639 1.398 0l1.021 2.637a6.002 6.002 0 003.43 3.43l2.637 1.02c.639.248.639 1.152 0 1.4l-2.637 1.02a6.001 6.001 0 00-3.43 3.43l-1.021 2.637c-.247.639-1.151.639-1.398 0l-1.021-2.637a6.001 6.001 0 00-3.43-3.43l-2.637-1.02c-.639-.248-.639-1.152 0-1.4l2.637-1.02a6.002 6.002 0 003.43-3.43l1.021-2.637z" />
        </g>
      </g>
      <defs id="defs176">
        <linearGradient
          id="paint0_linear_1924_96628"
          x1="541.41"
          x2="759.841"
          y1="207.827"
          y2="185.701"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop104" stopColor="#F88B8B" />
          <stop id="stop106" offset="0.483" stopColor="#D7A7BD" />
          <stop id="stop108" offset="1" stopColor="#B4C5F2" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1924_96628"
          x1="532.44"
          x2="612.22"
          y1="301.843"
          y2="214.466"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop111" stopColor="#B4C5F2" />
          <stop id="stop113" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1924_96628"
          x1="737.338"
          x2="532.19"
          y1="424.293"
          y2="309.372"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop116" stopColor="#B4C5F2" />
          <stop id="stop118" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1924_96628"
          x1="614.67"
          x2="531.091"
          y1="307.999"
          y2="307.999"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop121" stopColor="#B4C5F2" />
          <stop id="stop123" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1924_96628"
          x1="531.42"
          x2="580.808"
          y1="303.875"
          y2="271.584"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop126" stopColor="#B4C5F2" />
          <stop id="stop128" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_1924_96628"
          x1="632.202"
          x2="530.578"
          y1="424.083"
          y2="309.162"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop131" stopColor="#B4C5F2" />
          <stop id="stop133" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_1924_96628"
          x1="677.124"
          x2="572.076"
          y1="168.935"
          y2="114.488"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop136" stopColor="#B4C5F2" />
          <stop id="stop138" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_1924_96628"
          x1="742.37"
          x2="684.461"
          y1="-60.673"
          y2="167.228"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop141" stopColor="#B4C5F2" />
          <stop id="stop143" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_1924_96628"
          x1="661.788"
          x2="683.419"
          y1="87.913"
          y2="168.644"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop146" stopColor="#B4C5F2" />
          <stop id="stop148" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_1924_96628"
          x1="679.351"
          x2="635.377"
          y1="169.393"
          y2="130.047"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop151" stopColor="#B4C5F2" />
          <stop id="stop153" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_1924_96628"
          x1="769.378"
          x2="684.676"
          y1="40.934"
          y2="168.839"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop156" stopColor="#B4C5F2" />
          <stop id="stop158" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_1924_96628"
          x1="778.972"
          x2="527.286"
          y1="209.999"
          y2="209.999"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop161" stopColor="#fff" />
          <stop id="stop163" offset="1" stopColor="#F88B8B" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_1924_96628"
          x1="494.876"
          x2="567.057"
          y1="260.999"
          y2="260.999"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop166" stopColor="#F88B8B" />
          <stop id="stop168" offset="1" stopColor="#B4C5F2" />
        </linearGradient>
        <linearGradient
          id="paint13_linear_1924_96628"
          x1="447.579"
          x2="562.499"
          y1="119.998"
          y2="119.998"
          gradientUnits="userSpaceOnUse"
        >
          <stop id="stop171" stopColor="#B4C5F2" />
          <stop id="stop173" offset="1" stopColor="#F88B8B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AIPromptDialogGraphic;
