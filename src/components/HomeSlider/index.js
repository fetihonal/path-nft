import React, { useState } from "react";
import { navigate } from "@reach/router";
import { useWallet } from "../../providers";
// @mui
import {
  Grid,
  Button,
  Box,
  Stack,
  Modal,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
// ----------------------------------------------------------------------
const SliderBox = styled("div")(({ theme }) => ({
  padding: theme.spacing(10, 0, 10, 0),

  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(7, 5, 0, 7),
  },
  h1: {
    fontSize: "58px",
    fontWeight: "700",
    lineHeight: "1.1em",
    letterSpacing: "0px",
  },
  span: {
    fontSize: "19px",
    fontWeight: "400",
    lineHeight: "1.8em",
    letterSpacing: "0px",
    marginBottom: "30px",
    display: "block",
  },
}));
const ModalBox = styled("div")(({ theme }) => ({
  top: "50%",
  left: "50%",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  width: 700,
  backgroundColor: "white",
  borderRadius: 20,
  boxShadow: 2,
  padding: 25,
  h3: {
    margin: 0,
    marginBottom: 5,
    color: theme.palette.primary.main,
  },
}));
export default function HomeSlider({ handleLogout }) {
  // web3
  const { connect } = useWallet();

  return (
    <>
      <SliderBox>
        <Grid container spacing={10}>
          <Grid item md={7} xs={12}>
            <h1>Build fast and reliable NFT</h1>
            <span>
              Quickly create NFT's and have them ready for sale across all
              platforms
            </span>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={() => connect()}
            >
              Buy and Get Started
            </Button>
          </Grid>
          <Grid item md={5} xs={0}>
            <Stack
              sx={{
                borderRadius: 4,
                margin: 0,
                padding: 2,
                backgroundColor: "white",
              }}
            >
              <img
                src="https://toka.b-cdn.net/wp-content/uploads/2022/03/column-234.png"
                alt="a"
              />
              <h4>Your NFT Name</h4>
            </Stack>
          </Grid>
        </Grid>
      </SliderBox>
    </>
  );
}
