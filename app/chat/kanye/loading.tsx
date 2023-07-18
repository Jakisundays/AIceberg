"use client";

import Box from "@/components/Box";

const Loading = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      {/* <BounceLoader color="#22c55e" size={40} /> */}
      <span className="loading loading-infinity loading-lg"></span>
    </Box>
  );
};

export default Loading;
