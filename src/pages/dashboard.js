import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../core/api";
import Axios from "../core/axios";
// @mui
import { Grid, Stack, Container, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import Image from "../components/Image";
import { useWallet } from "../providers/";
import { numberToHex, chainIdToNetwork } from "../utils/formatter";

// ----------------------------------------------------------------------
const Box = styled("div")(({ theme }) => ({
  padding: "50px 0",
  img: {
    maxWidth: "100%",
  },
}));
const Item = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: 20,
  height: "100%",
  //   marginTop: 25,
  //   margin: "50px 0 0 0",
  transition: ".3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
  img: {
    borderRadius: 20,
  },
  h3: {
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "1.4em",
    letterSpacing: "1px",
    margin: "0 0 10px 0",
  },
}));
const PageInfo = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(7, 5, 0, 7),
  },
  marginBottom: 25,
  //   textAlign: "center",
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
  const { account } = useWallet();

  const { address, web3 } = account;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    async function fetchData() {
      let url = `${api.baseUrl}${api.myNfts}?page=${page}`;
      Axios(url, {
        method: "GET",
      })
        .then((response) => {
          setData(data.concat(response.data.results));

          setTotal(response.data.total);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (address) {
      fetchData();
    }
  }, [address, page]);
  const paging = () => {
    setPage(page + 1);
  };
  console.log(total > data.length * page, data.length, page);
  const onImgLoad = ({ target: img }) => {
    const { offsetHeight, offsetWidth } = img;

    let currentHeight = height;
    if (currentHeight < offsetHeight) {
      if (offsetHeight > 350) {
        setHeight(350);
      } else {
        setHeight(offsetHeight);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <PageInfo>
          <h5>Hello</h5>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <h1>Here’s your NFT's</h1>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={() => navigate("/create")}
            >
              Create New NFT
            </Button>
          </Stack>
        </PageInfo>
        {total > 0 && (
          <InfiniteScroll
            dataLength={total}
            next={paging}
            hasMore={total > page * data.length}
            loader={<h4>Loading...</h4>}
            className="row"
          >
            <Grid container spacing={4}>
              {data.map((item) => (
                <Grid item xs={12} md={3}>
                  <Item
                    onClick={() =>
                      navigate(
                        `/${item.chain_id}/${item.contract_address}/${item.token_id}`
                      )
                    }
                  >
                    <Stack direction="column" spacing={2}>
                      <div style={{ height: `${height}px` }}>
                        <img onLoad={onImgLoad} alt="wow" src={item.image} />
                      </div>
                      <div>
                        <h3>{item.title}</h3>
                        <span>{item.listing_price} ETH</span>
                      </div>
                    </Stack>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
        {total == 0 && (
          <Box
            sx={{ padding: 4, textAlign: "center", backgroundColor: "white" }}
          >
            There are no NFT, do you want to create one?
            <br /> <br />
            <Button
              size="large"
              type="submit"
              variant="outlined"
              onClick={() => navigate("/create")}
            >
              Create New NFT
            </Button>
          </Box>
        )}
      </Box>
      {/* <button className="btn btn-main" onClick={() => addNetwork()}>
                    Change {chainIdToNetwork(numberToHex(56))} Network
                  </button> */}
    </Container>
  );
};
export default NFT;
