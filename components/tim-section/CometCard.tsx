import React from "react";

type CometCardProps = {
  className?: string;
  children: React.ReactNode;
};

// forwardRef diperlukan agar GSAP di TimSection bisa memegang ref
// langsung ke DOM node untuk animasi scale, x, opacity, dll.
export const CometCard = React.forwardRef<HTMLDivElement, CometCardProps>(
  ({ className = "", children }, ref) => {
    return (
      <div ref={ref} className={"comet-card " + className}>
        <div className="comet-card__inner">{children}</div>
      </div>
    );
  },
);
CometCard.displayName = "CometCard";