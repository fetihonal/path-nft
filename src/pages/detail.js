import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import api from "../core/api";
import Axios from "../core/axios";
// @mui
import {
  Grid,
  Stack,
  Container,
  Button,
  Modal,
  TextField,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import LoadingButton from "@mui/lab/LoadingButton";
import Image from "../components/Image";
import { ethers } from "ethers";
import { useWallet } from "../providers";
import {
  multipliedBy,
  percentageOf,
  plusNum,
  isGreaterThanOrEqualTo,
  roundNumber,
  mulBy,
  numToString,
  divBy,
  toNum,
  splitSign,
  chainIdToNetwork,
  numberToHex,
} from "../utils/formatter";

const TransferProxyAddress = "0x557b587E19D962057Aa2398B6c5673dd878444AA";
// ----------------------------------------------------------------------
const Box = styled("div")(({ theme }) => ({
  padding: "50px 0",
  img: {
    maxWidth: "100%",
  },
}));
const ImageBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  maxHeight: "500px",
  backgroundColor: "white",
  padding: 20,
  borderRadius: 20,
  img: {
    maxWidth: "100%",
    height: "auto",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: 20,
  },
}));

const DetailBox = styled("div")(({ theme }) => ({
  h2: {
    fontSize: "36px",
    fontWeight: "700",
    lineHeight: "1.4em",
    letterSpacing: "1px",
    margin: "0 0 10px 0",
  },
}));
const Title = styled("div")(({ theme }) => ({
  padding: "20px 0 0 0",
  h4: {
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "1.4em",
    letterSpacing: "1px",
    margin: "0 0 10px 0",
  },
}));
const Properties = styled("div")(({ theme }) => ({}));

const PropertiesItem = styled("div")(({ theme }) => ({
  padding: "10px 20px",
  borderRadius: 10,

  marginBottom: 10,
  backgroundColor: "white",
  strong: {
    display: "block",
    color: theme.palette.primary.main,
  },
  span: {
    display: "block",
  },
  small: {
    display: "block",
  },
}));

const ModalBox = styled("div")(({ theme }) => ({
  top: "50%",
  left: "50%",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  borderRadius: 20,
  boxShadow: 2,
  padding: 25,
  h3: {
    margin: 0,
    marginBottom: 5,
  },
}));
const StepItem = styled("div")(({ theme }) => ({
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 20,
  margin: "10px 0",
  h4: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 0,
  },
  p: {
    margin: "2px 0px",
    fontSize: 13,
  },
}));
function StatusModal(props) {
  const { steps } = props;
  console.log(props);
  return (
    <Modal
      {...props}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Follow steps
      </Modal.Title>
    </Modal.Header> */}
      <ModalBox>
        <h3> Follow steps</h3>
        {steps.deposit.active && (
          <StepItem>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <div>
                {steps.deposit.loading ? (
                  <CircularProgress
                    size={25}
                    sx={{
                      color: green,
                    }}
                  />
                ) : (
                  <CheckIcon
                    sx={{ height: 25 }}
                    sx={{
                      color: green,
                    }}
                  />
                )}
              </div>
              <div className="info">
                <h4>Deposit</h4>

                <p>lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
              <span>
                {steps.deposit.error ? (
                  <Chip
                    label="Try Again"
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => props.deposit()}
                  />
                ) : steps.deposit.done ? (
                  <Chip
                    label="Done"
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Chip
                    label=" In Progress"
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                )}
              </span>
            </Stack>
          </StepItem>
        )}
        {steps.approveERC20.active && (
          <StepItem>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <>
                {steps.approveERC20.loading ? (
                  <CircularProgress
                    size={25}
                    sx={{
                      color: green,
                    }}
                  />
                ) : (
                  <CheckIcon
                    sx={{ height: 25 }}
                    sx={{
                      color: green,
                    }}
                  />
                )}
              </>
              <div className="info">
                <h4>approveERC20</h4>

                <p>lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
              <span>
                {steps.approveERC20.error ? (
                  <Chip
                    label="Try Again"
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => props.deposit()}
                  />
                ) : steps.approveERC20.done ? (
                  <Chip
                    label="Done"
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Chip
                    label=" In Progress"
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                )}
              </span>
            </Stack>
          </StepItem>
        )}
        {steps.buy.active && (
          <StepItem>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <>
                {steps.buy.loading ? (
                  <CircularProgress
                    size={25}
                    sx={{
                      color: green,
                    }}
                  />
                ) : (
                  <CheckIcon
                    sx={{ height: 25 }}
                    sx={{
                      color: green,
                    }}
                  />
                )}
              </>
              <div className="info">
                <h4>buy</h4>

                <p>lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
              <span>
                {steps.buy.error ? (
                  <Chip
                    label="Try Again"
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => props.buy()}
                  />
                ) : steps.buy.done ? (
                  <Chip
                    label="Done"
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Chip
                    label=" In Progress"
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                )}
              </span>
            </Stack>
          </StepItem>
        )}
      </ModalBox>
    </Modal>
  );
}
const getContract = async (type) => {
  let url = `${api.baseUrl}${api.contractabi}/${type}`;
  return await Axios({
    method: "GET",
    url: url,
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
const NFT = ({ chain, contactAddress, nftId }) => {
  // web3
  const { account, trimAddress } = useWallet();
  const { address, provider, signer, web3Provider, web3 } = account;

  // detil tabs
  const [openMenu, setOpenMenu] = React.useState("details");
  const [openCheckout, setOpenCheckout] = React.useState(false);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [openCheckoutbid, setOpenCheckoutbid] = React.useState(false);
  const [statusModalShow, setStatusModalShow] = React.useState(false);

  const [steps, setSteps] = useState({
    deposit: {
      active: false,
      loading: false,
      done: false,
      error: false,
    },
    approveERC20: {
      active: false,
      loading: false,
      done: false,
      error: false,
    },
    buy: {
      active: false,
      loading: false,
      done: false,
      error: false,
    },
  });

  // Nft data
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [signSeller, setSignSeller] = useState();
  const [buyPrice, setBuyPrice] = useState();
  //contract

  const [erc20, setErc20] = useState();
  const [erc721, setErc721] = useState();
  const [trade, setTrade] = useState();

  useEffect(() => {
    async function fetchData() {
      let url = `${api.baseUrl}${api.nftDetail}${chain}/${contactAddress}/${nftId}`;
      Axios.get(url, {
        params: {},
      })
        .then(async function (response) {
          setData(response.data);
          setSignSeller(response.data.sign_seller);
          setBuyPrice(response.data.buy_price);
        })
        .catch(function (error) {});
    }
    console.log(data.id !== null, account.address);
    fetchData();
    setLoad(true);
  }, []);
  useEffect(() => {
    async function fetchData() {
      const erc20Data = await getContract(`WBNB&${account.network?.chainId}`);
      const erc721Data = await getContract(
        `ERC721&${account.network?.chainId}`
      );
      const tradeData = await getContract(`TRADE&${account.network?.chainId}`);
      setErc20(erc20Data);
      setErc721(erc721Data);
      setTrade(tradeData);
    }

    if (address) {
      fetchData();
    }
  }, [data, address]);
  const contractApprovedForAll = async () => {
    setCheckoutLoading(true);
    try {
      const contract = new ethers.Contract(
        data.contract_address,
        erc721.abi,
        signer
      );
      const isApproved = await contract
        .isApprovedForAll(address, TransferProxyAddress)
        .then((e) => e);
      console.log("isApproved", isApproved);
      if (!isApproved) {
        const receipt = await contract.setApprovalForAll(
          TransferProxyAddress,
          true
        );
      }
      await signSellOrder(
        buyPrice,
        18,
        erc20.contract_address,
        1,
        data.contract_address
      );
      setCheckoutLoading(false);
    } catch (error) {}
  };
  const sendOrderTrans = (receipt) => {
    let url = `${api.baseUrl}${api.nftBuy}`;
    Axios(url, {
      method: "POST",
      data: {
        contract_address: data.contract_address,
        token_id: data.token_id.toString(),
        chain_id: account.network?.chainId,
      },
    })
      .then((response) => {
        toast.success("NFT Buy Success", { position: "bottom-right" });
        navigate("/account");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateNFT = (body) => {
    let url = `${api.baseUrl}${api.nftUpdate}${data.id}`;
    Axios(url, {
      method: "PATCH",
      data: body,
    })
      .then(async (response) => {
        await setSignSeller(data.sign_seller);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateShowCase = (showcase) => {
    let url = `${api.baseUrl}${api.nftListing}${data.id}`;
    Axios(url, {
      method: "POST",
      data: { showcase: showcase },
    })
      .then((response) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(erc20);
  const calculateBuy = (qty) => {
    const price = data.buy_price;
    // const qty = qty || 0;
    const payAmt = multipliedBy(price, qty);
    const serviceFee = percentageOf(10, payAmt);
    const totalAmt = plusNum(payAmt, serviceFee);
    return numToString(totalAmt);
  };
  const tokenBalance = async (contractAddress) => {
    const abi = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        payable: false,
        type: "function",
      },
    ];
    const contract = new ethers.Contract(contractAddress, abi, signer);

    let balance = await contract.balanceOf(address).then((e) => e);
    let test = await contract.balanceOf(address);
    test = roundNumber(divBy(test.toString(), 10 ** 18), 4);
    balance = roundNumber(divBy(balance.toString(), 10 ** 18), 4);
    console.log(test, balance);
    return balance;
  };

  const signSellOrder = async (
    amount,
    decimals,
    paymentAssetAddress,
    tokenId,
    assetAddress
  ) => {
    try {
      amount = roundNumber(mulBy(amount, 10 ** decimals), 0);
      console.log(amount, decimals);
      var messageHash = web3.utils.soliditySha3(
        assetAddress,
        tokenId,
        paymentAssetAddress,
        amount
      );

      const fixedPriceSignature = await web3.eth.personal.sign(
        messageHash,
        address
      );
      if (fixedPriceSignature) {
        await updateNFT({
          sign_seller: fixedPriceSignature,
          buy_price: parseFloat(buyPrice),
        });
      }
      return fixedPriceSignature;
    } catch (err) {}
  };
  const convertCoinToToken = async (
    amount,
    sendBackTo = "Bid",
    decimals = 18
  ) => {
    amount = roundNumber(mulBy(amount, 10 ** decimals), 0);
    const contract = await new web3.eth.Contract(
      erc20.abi,
      erc20.contract_address
    );
    var account = window.ethereum.selectedAddress;
    console.log(contract);
    var receipt = await contract.methods.deposit().send({
      from: account,
      value: amount,
      gas: 316883,
      gasPrice: String(""),
    });
    setSteps({
      ...steps,
      deposit: {
        active: true,
        loading: false,
        done: true,
        error: false,
      },
    });
    buyNFT();
    // buyNFT();
  };
  const approveERC20 = async (
    contractAddress,
    contractType,
    amount,
    decimals = 18,
    sendBackTo = "Bid"
  ) => {
    amount = roundNumber(mulBy(amount, 10 ** decimals), 0);

    const contract = await new web3.eth.Contract(erc20.abi, contractAddress);
    var receipt = await contract.methods
      .approve(TransferProxyAddress, amount)
      .send({ from: address });
    console.log(receipt);
    setSteps({
      ...steps,
      approveERC20: {
        active: true,
        loading: false,
        done: true,
        error: false,
      },
      buy: {
        active: true,
        loading: true,
        done: false,
        error: false,
      },
    });
    buyAsset().catch(() =>
      setSteps({
        ...steps,
        approveERC20: {
          active: true,
          loading: false,
          done: true,
          error: false,
        },
        buy: {
          active: true,
          loading: false,
          done: false,
          error: true,
        },
      })
    );

    return false;
  };
  // buyingAssetType = 1 # 721
  // buyingAssetType = 0 # 1155
  const buyNFT = async () => {
    setStatusModalShow(true);
    try {
      const totalAmt = calculateBuy(1);
      const curErc20Balance = await tokenBalance(erc20.contract_address);
      let balance = await web3Provider.getBalance(address);

      balance = roundNumber(web3.utils.fromWei(balance.toString(), "ether"), 4);

      if (isGreaterThanOrEqualTo(curErc20Balance, totalAmt)) {
        setSteps({
          ...steps,
          approveERC20: {
            active: true,
            loading: true,
            done: false,
            error: false,
          },
        });
        approveERC20(
          erc20.contract_address,
          "erc20",
          totalAmt,
          18,
          "Buy"
        ).catch(() =>
          setSteps({
            ...steps,
            approveERC20: {
              active: true,
              loading: false,
              done: false,
              error: true,
            },
          })
        );
      } else if (isGreaterThanOrEqualTo(balance, totalAmt)) {
        setSteps({
          ...steps,
          deposit: {
            active: true,
            loading: true,
            done: false,
            error: false,
          },
        });
        convertCoinToToken(totalAmt - curErc20Balance, "Buy").catch((e) =>
          setSteps({
            ...steps,
            deposit: {
              active: true,
              loading: false,
              done: false,
              error: true,
            },
          })
        );
      } else {
        toast.error("Not enough balance", { position: "bottom-right" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const buyAsset = async (
    unitPrice = toNum(data.buy_price),
    paymentAmt,
    decimals = 18
  ) => {
    setSteps({
      ...steps,
      approveERC20: {
        active: true,
        loading: false,
        done: true,
        error: false,
      },
      buy: {
        active: true,
        loading: true,
        done: false,
        error: false,
      },
    });
    paymentAmt = calculateBuy(1);
    paymentAmt = roundNumber(mulBy(paymentAmt, 10 ** decimals), 0);
    unitPrice = roundNumber(mulBy(unitPrice, 10 ** decimals), 0);

    const orderStruct = [
      data.owner_address,
      address,
      erc20.contract_address,
      data.contract_address,
      toNum(1),
      unitPrice,
      paymentAmt,
      1,
      toNum(1),
    ];

    const contract = await new web3.eth.Contract(
      trade.abi,
      trade.contract_address
    );
    const receipt = await contract.methods
      .buyAsset(orderStruct, splitSign(signSeller, web3))
      .send({ from: address, gas: 316883, gasPrice: String("") });
    await sendOrderTrans(receipt);
    // await updateShowCase(false);
    setSteps({
      ...steps,
      approveERC20: {
        active: true,
        loading: false,
        done: true,
        error: false,
      },
      buy: {
        active: true,
        loading: false,
        done: true,
        error: false,
      },
    });
  };

  if (!load && data.length > !0) {
    return false;
  }
  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 1,
            padding: 2,
            marginTop: 4,
          }}
        >
          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              <ImageBox>
                <img src={data.image} />
              </ImageBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailBox>
                <h2>{data.title}</h2>
                <p>{data.description}</p>
                <Title>
                  <h4>Owner</h4>
                </Title>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 40, height: 40 }}
                  />
                  <span>
                    {data.UserModel?.username
                      ? data.UserModel?.username
                      : trimAddress(data?.owner_address)}
                  </span>
                </Stack>
                <Title>
                  <h4>Properties</h4>
                </Title>
                <Properties
                  sx={{ flexWrap: "wrap", display: "flex", gap: 2 }}
                  spacing={2}
                >
                  {data?.attributes?.map((item) => (
                    <PropertiesItem>
                      <strong>{item.trait_type}</strong>
                      <span>{item.value}</span>
                      <small>85% have this trait</small>
                    </PropertiesItem>
                  ))}
                </Properties>
                {data.chain_id == account.network?.chainId && (
                  <Stack spacing={2} sx={{ maxWidth: 200 }}>
                    {data.owner_address?.toLowerCase() ==
                      address?.toLowerCase() && (
                      <Button
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={() => setOpenCheckout(true)}
                      >
                        Set Sale Price And Listing
                      </Button>
                    )}

                    {signSeller && data.owner_address == address ? (
                      data.showcase ? (
                        <Button
                          size="large"
                          type="submit"
                          variant="outlined"
                          color="warning"
                          onClick={() => updateShowCase(false)}
                        >
                          Listing Passive
                        </Button>
                      ) : (
                        <Button
                          size="large"
                          type="submit"
                          variant="outlined"
                          onClick={() => updateShowCase(true)}
                        >
                          Listing Active
                        </Button>
                      )
                    ) : (
                      ""
                    )}
                    {signSeller &&
                      data.owner_address?.toLowerCase() !==
                        address?.toLowerCase() && (
                        <Button
                          size="large"
                          type="submit"
                          variant="contained"
                          onClick={() => buyNFT()}
                        >
                          Buy For {data.buy_price} BSC
                        </Button>
                      )}
                  </Stack>
                )}
              </DetailBox>
            </Grid>
          </Grid>
        </Box>
        <StatusModal
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={statusModalShow}
          steps={steps}
          onClose={() => setStatusModalShow(false)}
          deposit={() => buyNFT()}
          buy={() => buyAsset()}
        />
        <Modal
          open={openCheckout}
          onClose={() => setOpenCheckout(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalBox>
            <Stack spacing={3}>
              <h3>Edit Price</h3>
              <TextField
                fullWidth
                name="buy_price"
                label="Buy Price"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
              />

              <LoadingButton
                fullWidth
                loading={checkoutLoading}
                size="large"
                variant="contained"
                onClick={() => contractApprovedForAll()}
              >
                Edit Buy Price
              </LoadingButton>
            </Stack>
          </ModalBox>
        </Modal>
      </Container>
    </>
  );
};
export default NFT;
