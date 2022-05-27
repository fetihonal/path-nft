import { useState } from "react";
import { Link as RouterLink } from "@reach/router";
// @mui
import { Grid, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import Image from "../Image";

// ----------------------------------------------------------------------
const InfoBox = styled("div")(({ theme }) => ({
  padding: theme.spacing(5),
  backgroundColor: "white",
  borderRadius: "20px",
  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(7, 5, 0, 7),
  },
  h3: {
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "1.3em",
    letterSpacing: "0.2px",
    margin: "0px 5px 5px 0px",
  },
  span: {
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "1.8em",
    letterSpacing: "0px",
  },
}));

export default function HomeInfoBox({ handleLogout }) {
  return (
    <InfoBox>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack
            direction={{ xs: "row", sm: "row" }}
            alignItems="center"
            spacing={2}
          >
            <Image
              sx={{ width: 210 }}
              src="https://toka.b-cdn.net/wp-content/uploads/2022/02/lock-crypto.png"
            />
            <div>
              <h3>Register</h3>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </span>
            </div>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack
            direction={{ xs: "row", sm: "row" }}
            alignItems="center"
            spacing={2}
          >
            <Image
              sx={{ width: 210 }}
              src="https://toka.b-cdn.net/wp-content/uploads/2022/02/wallet-crypto-icon.png"
            />
            <div>
              <h3>Connect your walet</h3>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </span>
            </div>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack
            direction={{ xs: "row", sm: "row" }}
            alignItems="center"
            spacing={2}
          >
            <Image
              sx={{ width: 210 }}
              src="https://toka.b-cdn.net/wp-content/uploads/2022/03/mining.png"
            />
            <div>
              <h3>Start trading</h3>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </span>
            </div>
          </Stack>
        </Grid>
      </Grid>
    </InfoBox>
  );
}
