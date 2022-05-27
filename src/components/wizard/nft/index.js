import React from "react";
import { navigate } from "@reach/router";
// @mui
import { Grid, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import Image from "../../Image";
import { useWallet } from "../../../providers";
import { numberToHex, chainIdToNetwork } from "../../../utils/formatter";

// ----------------------------------------------------------------------
const Box = styled("div")(({ theme }) => ({
  padding: "100px 0",
}));
const Item = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "50px 20px 10px 20px",
  borderRadius: 20,
  height: "100%",
  marginTop: 50,
  transition: ".3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));
const PageInfo = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(7, 5, 0, 7),
  },
  textAlign: "center",
  h5: {
    color: theme.palette.primary.main,
    fontSize: "17px",
    fontWeight: "700",
    lineHeight: "1.4em",
    letterSpacing: "1px",
    margin: "0 0 10px 0",
  },
  h1: {
    fontSize: "43px",
    fontWeight: "700",
    lineHeight: "1.1em",
    letterSpacing: "0px",
    margin: "0 0 20px 0",
  },
  span: {
    fontSize: "19px",
    fontWeight: "400",
    lineHeight: "1.8em",
    letterSpacing: "0px",
    marginBottom: "30px",
    display: "block",
    width: "50%",
    margin: "0 auto",
  },
}));

const NFT = (props) => {
  const { stepChange } = props;
  const { account } = useWallet();
  const { provider } = account;
  const addNetwork = () => {
    const params = [
      {
        chainId: "0x38",
        chainName: "BSC",
        nativeCurrency: {
          name: "Binance Chain Native Token",
          symbol: "BSC",
          decimals: 18,
        },
        rpcUrls: ["https://bsc-dataseed1.binance.org"],
        blockExplorerUrls: ["https://bscscan.com/"],
      },
    ];

    provider
      .request({ method: "wallet_addEthereumChain", params })
      .then(() => console.log("Success"))
      .catch((error) => console.log("Error", error.message));
  };
  const addTestNetwork = () => {
    const params = [
      {
        chainId: "0x61",
        chainName: "BSC Testnet",
        nativeCurrency: {
          name: "Binance Chain Native Token",
          symbol: "BSC",
          decimals: 18,
        },
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
        blockExplorerUrls: ["https://testnet.bscscan.com/address/"],
      },
    ];

    provider
      .request({ method: "wallet_addEthereumChain", params })
      .then(() => console.log("Success"))
      .catch((error) => console.log("Error", error.message));
  };
  return (
    <>
      <Box>
        <PageInfo>
          <h5>Create</h5>
          <h1>Create New NFT</h1>
          <span>
            Create NFT in the fastest way and start selling immediately
          </span>
        </PageInfo>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Item onClick={() => stepChange("myCollections")}>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Image
                  sx={{ height: 120 }}
                  src="https://toka.b-cdn.net/wp-content/uploads/2022/03/picture.png"
                />
                <div>
                  <h3>Add My Collection</h3>
                  <span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </span>
                </div>
              </Stack>
            </Item>
          </Grid>
          <Grid item xs={12} md={4}>
            <Item onClick={() => stepChange("nftForm")}>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Image
                  sx={{ height: 120 }}
                  src="https://toka.b-cdn.net/wp-content/uploads/2022/03/mining.png"
                />
                <div>
                  <h3>Create a NFT</h3>
                  <span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </span>
                </div>
              </Stack>
            </Item>
          </Grid>
          <Grid item xs={12} md={4}>
            <Item onClick={() => stepChange("importMyCollections")}>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Image
                  sx={{ height: 120 }}
                  src="https://toka.b-cdn.net/wp-content/uploads/2022/03/wallet.png"
                />
                <div>
                  <h3>Import Your Collection</h3>
                  <span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </span>
                </div>
              </Stack>
            </Item>
          </Grid>
        </Grid>
      </Box>
      {/* <button className="btn btn-main" onClick={() => addNetwork()}>
                    Change {chainIdToNetwork(numberToHex(56))} Network
                  </button> */}
    </>
  );
};
export default NFT;
