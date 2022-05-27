import React, { useEffect, useState } from "react";
import { navigate } from "@reach/router";
// @mui
import {
  Container,
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Fab,
  Chip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import { Spinner, Badge } from "react-bootstrap/";
import { create } from "ipfs-http-client";
import api from "../core/api";
import Axios from "../core/axios";

import { useWallet } from "../providers";
import { ethers } from "ethers";
import { pinJSONToIPFS } from "../core/nft/pinata.js";
import { roundNumber, mulBy, splitSign } from "../utils/formatter";

import {
  NFT,
  NFTForm,
  MyCollections,
  ImportMyCollections,
} from "../components/wizard/index";

const CONTRACT_ABI = require("../core/nft/NextPlanet_ERC721.json");
const client = create("https://ipfs.infura.io:5001/api/v0");
const { soliditySha3 } = require("web3-utils");

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
    marginBottom: 20,
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

function CreateContractModal(props) {
  return (
    <Modal
      {...props}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalBox>
        <Stack spacing={3}>
          <h3>Contract Detail</h3>
          <TextField
            fullWidth
            name="email"
            label="Contract Name"
            onChange={(e) =>
              props.setContractInfo((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            name="symbol"
            label="Contract Symbol"
            onChange={(e) =>
              props.setContractInfo((prev) => ({
                ...prev,
                symbol: e.target.value,
              }))
            }
          />
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={props.createContract}
          >
            Create Contract
          </Button>
        </Stack>
      </ModalBox>
      {/* <Modal.Footer>
        <button className="btn-main btn" onClick={props.createContract}>
          Create Contract
        </button>
        <button className="btn-main btn" onClick={props.onHide}>
          Cancel
        </button>
      </Modal.Footer> */}
    </Modal>
  );
}

function StatusModal(props) {
  const { steps } = props;
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
        {steps.deployContract.active && (
          <StepItem>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <>
                {steps.deployContract.loading ? (
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
                <h4>Deploy contract</h4>
                <p>Deploy code for the new collection smart contract</p>
              </div>
              <div>
                <span>
                  {steps.deployContract.error ? (
                    <Chip
                      label="Try Again"
                      color="error"
                      variant="outlined"
                      size="small"
                      onClick={() => props.createContract()}
                    />
                  ) : steps.deployContract.done ? (
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
              </div>
            </Stack>
          </StepItem>
        )}
        {steps.deployContractApproval.active && (
          <StepItem>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <>
                {steps.deployContractApproval.loading ? (
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
                <h4>Approval</h4>
                <p>Checking balance and approving</p>
              </div>

              <span>
                {steps.deployContractApproval.error ? (
                  <Chip
                    label="Try Again"
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => props.createContractApprovedForAll()}
                  />
                ) : steps.deployContractApproval.done ? (
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
        {steps.nftMint.active && (
          <StepItem>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <>
                {steps.nftMint.loading ? (
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
                <h4>Mint NFT</h4>

                <p>Checking Signature and Mint NFT</p>
              </div>
              <span>
                {steps.nftMint.error ? (
                  <Chip
                    label="Try Again"
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => props.uploadFilesAndMintToken()}
                  />
                ) : steps.nftMint.done ? (
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
const Createpage = () => {
  const { account } = useWallet();
  const { address, signer, web3 } = account;

  const [wizardStep, setWizardStep] = useState("nft");

  const [myCollections, setMyCollections] = useState([]);
  const [contract, setContract] = useState();
  const [createdContract, setCreatedContract] = useState(null);
  const [contractInfo, setContractInfo] = useState({ name: "", symbol: "" });
  const [approvalForAll, setApprovalForAll] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [statusModalShow, setStatusModalShow] = React.useState(false);

  const [steps, setSteps] = useState({
    deployContract: {
      active: false,
      loading: false,
      done: false,
      error: false,
    },
    deployContractApproval: {
      active: false,
      loading: false,
      done: false,
      error: false,
    },
    nftMint: {
      active: false,
      loading: false,
      done: false,
      error: false,
    },
  });

  const createContract = async () => {
    try {
      const name = contractInfo.name;
      const symbol = contractInfo.symbol;

      const tokenURIPrefix = "";
      setSteps({
        ...steps,
        deployContract: {
          active: true,
          loading: true,
          done: false,
          error: false,
        },
      });
      setModalShow(false);
      setStatusModalShow(true);
      console.log("name", name, "symbol", symbol, "contractInfo", contractInfo);
      const baseContract = await getContract(
        `ERC721&${account.network?.chainId}`
      );

      const NP721 = new ethers.ContractFactory(
        baseContract.abi,
        baseContract.bytcode,
        signer
      );
      const NP721Contract = await NP721.deploy(name, symbol, tokenURIPrefix);

      await NP721Contract.deployed();

      console.log("NP721Contract", NP721Contract);
      NP721Contract.nname = name;
      NP721Contract.nsymbol = symbol;
      NP721Contract.tokenURIPrefix = tokenURIPrefix;
      setContract(NP721Contract);
    } catch (error) {
      console.log(error);
      setSteps({
        ...steps,
        deployContract: {
          active: true,
          loading: false,
          done: false,
          error: true,
        },
      });
    }
  };
  useEffect(() => {
    async function fetchData() {
      setSteps({
        ...steps,
        deployContract: {
          active: true,
          loading: false,
          done: true,
          error: false,
        },
        deployContractApproval: {
          active: true,
          loading: true,
          done: false,
          error: false,
        },
      });
      createContractApprovedForAll();
    }
    if (contract?.address) {
      fetchData();
    }
  }, [contract]);

  const createContractApprovedForAll = async () => {
    try {
      const baseContract = await getContract(
        `TransferProxy&${account.network?.chainId}`
      );
      const isApproved = await contract
        .isApprovedForAll(address, baseContract.contract_address)
        .then((e) => console.log(e));

      if (!isApproved) {
        const receipt = await contract
          .setApprovalForAll(baseContract.contract_address, true)
          .then((e) => setApprovalForAll(true));
      }
    } catch (error) {
      setSteps({
        ...steps,
        deployContract: {
          active: true,
          loading: false,
          done: true,
          error: false,
        },
        deployContractApproval: {
          active: true,
          loading: false,
          done: false,
          error: true,
        },
      });
    }
  };
  useEffect(() => {
    async function fetchData() {
      setSteps({
        ...steps,
        deployContractApproval: {
          active: true,
          loading: false,
          done: true,
          error: false,
        },
        nftMint: {
          active: true,
          loading: true,
          done: false,
          error: false,
        },
      });
      uploadFilesAndMintToken();
    }
    if (approvalForAll) {
      fetchData();
    }
  }, [approvalForAll]);
  console.log("createdContract", createdContract);
  const uploadFilesAndMintToken = async (data = formData) => {
    try {
      let selectedContract = "";
      let selectedContractAddress = "";

      if (createdContract) {
        selectedContract = await new ethers.Contract(
          createdContract.token_address,
          CONTRACT_ABI.abi,
          signer
        );

        selectedContractAddress = createdContract.token_address;
      } else {
        selectedContract = contract;
        selectedContractAddress = contract.address;
      }
      const created = await client.add(data.selectedFileAsBuffer);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;

      const metadata = data;
      metadata.image = url;
      // metadata.attributes = attributes;

      const pinataResponse = await pinJSONToIPFS(metadata);
      if (!pinataResponse.success) {
        return {
          success: false,
          status: "Something went wrong while uploading your tokenURI.",
        };
      }
      const tokenURI = pinataResponse.pinataUrl;

      const hash1 = await soliditySha3(
        selectedContractAddress,
        pinataResponse.IpfsHash
      );

      const personalSignature = await web3.eth.personal.sign(hash1, address);

      const ecRecover = await web3.eth.personal.ecRecover(
        hash1,
        personalSignature
      );

      const splitSigner = await splitSign(personalSignature, web3);
      const tokenCounter = await selectedContract
        .tokenCounter()
        .then((count) => count);
      console.log(tokenCounter);
      await selectedContract
        .createCollectible(pinataResponse.IpfsHash, 5, splitSigner)
        .then((response) => {
          console.log("test response", response);
          if (!createdContract) {
            let url = `${api.baseUrl}${api.collections}`;

            Axios({
              method: "POST",
              url: url,

              data: {
                symbol: contract.nsymbol,
                name: contract.nname,
                token_uri_prefix: contract.tokenURIPrefix,
                owner_address: address,
                contract_address: contract?.address,
                chain_id: Number(account.network?.chainId),
              },
            });
          }

          let url = `${api.baseUrl}${api.nftCreate}`;
          metadata.title = metadata.name;
          metadata.symbol = selectedContract.symbol;
          metadata.name = selectedContract.name;
          metadata.contract_type = "ERC721";
          metadata.token_uri = tokenURI;
          metadata.token_id = tokenCounter.toString();
          metadata.chain_id = account.network?.chainId;
          metadata.buy_price = Number(metadata.buy_price);
          metadata.contract_address = selectedContract.address;
          metadata.owner_address = address;
          // metadata.author_id = auth.getUserInfo();
          delete metadata.selectedFileAsBuffer;
          Axios({
            method: "POST",
            url: url,
            data: metadata,
          })
            .then((apiResponse) => {
              setSteps({
                ...steps,
                deployContractApproval: {
                  active: createdContract ? false : true,
                  loading: false,
                  done: createdContract ? false : true,
                  error: false,
                },
                nftMint: {
                  active: true,
                  loading: false,
                  done: true,
                  error: false,
                },
              });
              navigate(
                `nft/${apiResponse.data.chain_id}/${apiResponse.data.contract_address}/${apiResponse.data.token_id}`
              );
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => console.log("err", err));
    } catch (error) {
      setSteps({
        ...steps,
        deployContractApproval: {
          active: true,
          loading: false,
          done: true,
          error: false,
        },
        nftMint: {
          active: true,
          loading: false,
          done: true,
          error: true,
        },
      });
    }
  };
  const [formData, setFormData] = useState({});
  const onSubmit = (formData) => {
    console.log("FormData", formData);
    setFormData(formData);
    if (contract || createdContract) {
      if (createdContract) {
        setSteps({
          ...steps,
          nftMint: {
            active: true,
            loading: true,
            done: false,
            error: false,
          },
        });
      }
      setStatusModalShow(true);
      uploadFilesAndMintToken(formData);
    } else {
      setModalShow(true);
    }
  };

  return (
    <Container maxWidth="lg">
      <>
        {wizardStep === "nft" && <NFT stepChange={setWizardStep} />}
        {wizardStep === "nftForm" && (
          <NFTForm
            stepChange={setWizardStep}
            onSubmit={onSubmit}
            contract={createdContract}
          />
        )}
        {wizardStep === "myCollections" && (
          <MyCollections
            setCreatedContract={setCreatedContract}
            stepChange={setWizardStep}
          />
        )}
        {wizardStep === "importMyCollections" && (
          <ImportMyCollections
            setCreatedContract={setCreatedContract}
            stepChange={setWizardStep}
          />
        )}

        <CreateContractModal
          open={modalShow}
          onClose={() => setModalShow(false)}
          setContractInfo={setContractInfo}
          createContract={() => createContract()}
        />
        <StatusModal
          open={statusModalShow}
          steps={steps}
          createContract={() => createContract()}
          createContractApprovedForAll={() => createContractApprovedForAll()}
          uploadFilesAndMintToken={() => uploadFilesAndMintToken()}
          onClose={() => setStatusModalShow(false)}
        />
      </>
    </Container>
  );
};
export default Createpage;
