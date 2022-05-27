import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
//web3
import { useWallet } from "../../providers/index";
import { ethers } from "ethers";
// @mui
import { styled } from "@mui/material/styles";
import {
  Box,
  Stack,
  Container,
  Grid,
  Toolbar,
  Avatar,
  Chip,
  Button,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// hooks
import useOffSetTop from "../../hooks/useOffSetTop";
import useResponsive from "../../hooks/useResponsive";

// config
import { HEADER } from "../../config";

// components
import AccountPopover from "./AccountPopover";

// ----------------------------------------------------------------------
const HeaderStyle = styled("header")(({ theme }) => ({
  padding: theme.spacing(1, 0, 1, 0),
  borderBottom: "1px solid rgba(0,0,0,.04)",

  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(7, 5, 0, 7),
  },
  ".MuiToolbar-root": {
    padding: theme.spacing(0),
  },
}));

const HeaderBottom = styled("header")(({ theme }) => ({
  padding: theme.spacing(5, 0, 0, 0),
  borderBottom: "1px solid rgba(0,0,0,.04)",
  background: "white",
  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(7, 5, 0, 7),
  },
  h1: {
    padding: theme.spacing(0),
    margin: 0,
  },
}));

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export default function DashboardHeader({ verticalLayout = false }) {
  const { account, connect, disconnect, trimAddress } = useWallet();
  const { provider, address, signer, web3Provider } = account;
  const isDesktop = useResponsive("up", "lg");
  const [isLogin, setIsLogin] = useState(false);
  React.useEffect(() => {
    async function fetchData() {
      // web3Provider.getBalance(address).then((balance) => {
      //   // convert a currency unit from wei to ether
      //   const balanceInEth = ethers.utils.formatEther(balance);
      //   setBalance(balanceInEth);
      // });
    }

    if (address) {
      fetchData();
    }
    if (web3Provider) {
      setIsLogin(true);
    }
    if (!web3Provider) {
      setIsLogin(false);
    }
  }, [account]);
  const handleLogout = async () => {
    alert("sd");
    disconnect();
  };
  return (
    <>
      <HeaderStyle>
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: "100% !important",
              px: { lg: 5 },
            }}
          >
            {isDesktop && (
              <img
                onClick={() => navigate("/")}
                height="50"
                src="https://path.com.tr/user/themes/path/images/path-logo-grup-acik-zemin.svg"
              />
            )}
            <Box sx={{ flexGrow: 1 }} />
            {isLogin ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 0.5, sm: 1.5 }}
              >
                <span onClick={() => navigate("/dashboard")}>Dashboard</span>
                <span onClick={() => navigate("/create")}>Create</span>
                <Chip
                  avatar={<Avatar>W</Avatar>}
                  label={trimAddress(address)}
                />
                <AccountPopover handleLogout={handleLogout} />
              </Stack>
            ) : (
              <Button
                size="large"
                type="submit"
                variant="outlined"
                onClick={() => connect()}
              >
                <AddIcon />
                Connect Wallet
              </Button>
            )}
          </Toolbar>
        </Container>
      </HeaderStyle>
      {/* <HeaderBottom>
        <Container maxWidth="xl">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={{ xs: 3, sm: 3 }}
                >
                  <img
                    height="200"
                    src="https://nuftikit.demothemesflat.com/wp-content/uploads/2022/04/img-discover-4.png"
                  />
                  <div>
                    <h1>Selam,</h1>
                    <span>Hadi NFT Yaratalım</span>
                  </div>
                </Stack>
              </Grid>
              <Grid div xs={3} style={{ textAlign: "right" }}>
                <Stack
                  direction="row"
                  justifyContent="end"
                  alignItems="center"
                  style={{ height: "100%" }}
                >
                  <Button size="large" type="submit" variant="contained">
                    <AddIcon />
                    Yeni NFT Oluştur
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </HeaderBottom> */}
    </>
  );
}
