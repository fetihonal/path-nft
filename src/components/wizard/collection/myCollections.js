import React, { useEffect } from "react";
// @mui
import { Grid, Skeleton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import api from "../../../core/api";
import Axios from "../../../core/axios";
import { useWallet } from "../../../providers";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------
const Box = styled("div")(({ theme }) => ({
  padding: "100px 0",
}));
const NoFound = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: 20,
  textAlign: "center",
  h5: {
    color: theme.palette.error.main,
    fontSize: "27px",
    fontWeight: "700",
    lineHeight: "1.4em",
    letterSpacing: "1px",
    margin: "0 0 10px 0",
  },
}));

const Item = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: 20,
  height: "100%",
  marginTop: 10,
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
    margin: "0 auto 50px auto",
  },
}));

const MyCollections = (props) => {
  const { setCreatedContract, stepChange } = props;
  const { account } = useWallet();
  const { provider, web3 } = account;
  const [load, setLoad] = React.useState(false);
  const [myCollections, setMyCollections] = React.useState([]);
  const [active, setActive] = React.useState();

  useEffect(() => {
    async function fetchData() {
      let url = `${api.baseUrl}${api.usercontract}/${web3.utils.toHex(
        account?.network?.chainId
      )}`;
      return await Axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          const newArr = [];
          Object.keys(response.data).map((i) => {
            newArr.push({
              contract_address: i,
              nftCount: response.data[i].length,
              token_address: response.data[i][0].token_address,
              value: response.data[i][0].token_address,
              name: response.data[i][0].name,
              symbol: response.data[i][0].symbol,
              label: response.data[i][0].name + response.data[i][0].symbol,
            });
          });

          setMyCollections(newArr);
          setLoad(true);
          return response.data.result;
        })
        .catch((err) => {
          setLoad(true);
          toast.error(err.message, { position: "bottom-right" });
        });
    }
    if (account?.address) {
      fetchData();
    }
  }, [account]);

  return (
    <>
      <Box>
        <PageInfo>
          <h5>Create</h5>
          <h1>Select Your Collection</h1>
          <span>
            lorem ipsum dolor sit amet, consectetur adip, lorem ipsum dolor sit
            amet, consectetur adip lorem ipsum dolor sit amet, consectetur adip
          </span>
          {load && myCollections.length == 0 && (
            <NoFound>
              <h5>Collection not found, now create collection.</h5>
              <Button
                onClick={() => stepChange("nft")}
                size="large"
                type="submit"
                variant="contained"
              >
                Create New Collection
              </Button>
            </NoFound>
          )}
        </PageInfo>
        <Grid container spacing={4}>
          {load ? (
            myCollections?.map((item) => (
              <Grid item xs={12} md={6}>
                <Item
                  // className={`opt-create w-100 p-4 text-start ${
                  //   active === item.token_address ? "active" : ""
                  // }`}
                  onClick={() => {
                    setCreatedContract(item);
                    setActive(item.token_address);
                    stepChange("nftForm");
                  }}
                >
                  <strong>{`${item.name} - ${item.symbol}`}</strong>
                  <p>
                    <small>
                      lorem ipsum dolor sit amet, consectetur adip, lorem ipsum
                      dolor sit amet, consectetur adip lorem ipsum dolor sit
                      amet, consectetur adip
                    </small>
                  </p>
                </Item>
              </Grid>
            ))
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Skeleton height={118} animation="wave" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={118} animation="wave" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={118} animation="wave" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={118} animation="wave" />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};
export default MyCollections;
