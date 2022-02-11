import React from "react";

import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export const Loader = () => {
  //component used to simulate loading times of requests to the backend
  return (
    <Box
      top={0}
      left={0}
      bottom={0}
      right={0}
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
};