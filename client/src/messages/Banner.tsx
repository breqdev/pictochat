import React from "react";

const Banner = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div
    className="bg-gray-500 text-white border-white border-2 px-2 py-1 rounded-xl"
    ref={ref}
  >
    PICTOCHAT
  </div>
));

export default Banner;
