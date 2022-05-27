import React, { useEffect } from "react";
import { Link } from "@reach/router";
// @mui
import { Grid, Stack, Skeleton, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../../core/api";
import Axios from "../../../core/axios";
import { useWallet } from "../../../providers";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------
const Box = styled("div")(({ theme }) => ({
  padding: "100px 0",
}));
const ImportBox = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: 20,
  textAlign: "center",
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
    width: "60%",
    margin: "0 auto 50px auto",
  },
}));
const Msg = ({ closeToast, toastProps }) => (
  <div>
    <div>Your NFT's have been transferred to the account.</div>
    <Link to="/dashboard">View My Dashboard</Link>
  </div>
);
const MyCollections = (props) => {
  const { setCreatedContract, stepChange } = props;
  const { account } = useWallet();
  const { web3 } = account;
  const [load, setLoad] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("collection");
  const [myCollections, setMyCollections] = React.useState([]);
  const [myNft, setMyNft] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [checkedList, setCheckedList] = React.useState([]);

  const getMyCollections = async () => {
    setLoad(true);
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
        setLoad(false);
        return newArr;
      })
      .catch((err) => {
        toast.error(err.response.data.message, { position: "bottom-right" });
      });
  };
  const checkedListHandler = async (id) => {
    const listIn = checkedList.indexOf(id);
    if (listIn === -1) {
      setCheckedList([...checkedList, id]);
    } else {
      setCheckedList(checkedList.filter((item) => item !== id));
    }
  };
  const importMyNFTList = async (id) => {
    let url = `${api.baseUrl}${api.usercontractNft}`;
    return await Axios({
      method: "POST",
      url: url,
      data: {
        contract_list: [id],
        chain_code: web3.utils.toHex(account?.network?.chainId),
      },
    })
      .then((response) => {
        toast.success(<Msg />, { position: "bottom-right" });
      })
      .catch((err) => {
        // console.log(err.response);
        toast.error(err.response.data.message, { position: "bottom-right" });
      });
  };
  return (
    <>
      <Box>
        <PageInfo>
          <h5>Create</h5>
          <h1>Import Your Collection</h1>
          <span>
            Import your existing listings from OpenSea to NextPlanet in just one
            click!
          </span>
        </PageInfo>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          // sx={{ width: 300 }}
        >
          {activeTab === "collection" && !load && myCollections.length == 0 && (
            <ImportBox>
              <LoadingButton
                fullWidth
                loading={load}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={() => getMyCollections()}
              >
                Import Now Listing
              </LoadingButton>

              <h5 className="p-3 text-black">or</h5>
              <div>
                <TextField
                  fullWidth
                  name="email"
                  label="enter the collection contract address"
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <LoadingButton
                  loading={load}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                  onClick={() => importMyNFTList(inputValue)}
                  sx={{ marginTop: 2 }}
                >
                  Import Now Listing
                </LoadingButton>
              </div>
            </ImportBox>
          )}
          {!load ? (
            activeTab === "collection" &&
            myCollections?.map((item) => (
              <Grid item xs={12} md={6}>
                <Item onClick={() => importMyNFTList(item.token_address)}>
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
          {!load &&
            activeTab === "collection" &&
            load &&
            myCollections.length == 0 && (
              <div className="border p-5 text-center mt-3">
                Collection not found, now create collection. <hr />
                <Link to="/create" className="btn-main mt-3 d-inline-block">
                  Create New Collection
                </Link>
              </div>
            )}
        </Grid>
      </Box>
    </>
  );
};
export default MyCollections;
