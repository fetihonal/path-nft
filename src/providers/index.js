import React, { useEffect, useState, useCallback } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import detectEthereumProvider from "@metamask/detect-provider";
import Axios from "../core/axios";
import api from "../core/api";
import auth from "../core/auth/index";
import { navigate } from "@reach/router";
import CheckOutModal from "../components/CheckOut";
import { setAuthorizationToken } from "../utils/setAuthorizationToken";
const WalletContext = React.createContext();

const accountDetails = {
  provider: null,
  address: null,
  signer: null,
  web3Provider: null,
  network: null,
};
const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    // display: {
    //   logo: "data:image/gif;base64,INSERT_BASE64_STRING",
    //   name: "Mobile",
    //   description: "Scan qrcode with your mobile wallet",
    // },

    options: {
      rpc: {
        56: "https://bsc-dataseed.binance.org/",
        97: "https://data-seed-prebsc-1-s1.binance.org:8545",
        137: "https://polygon-rpc.com",
        80001: "https://rpc-mumbai.maticvigil.com",
      },
      infuraId: "INFURA_ID",
      network: "binance",
    },
  },
};

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "binance", // optional
    cacheProvider: true,
    providerOptions, // required
  });
}
function Web3Provider({ children }) {
  const [account, setAccountDetails] = React.useState(accountDetails);
  const [verify, setVerify] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const loadWeb3 = useCallback(async function (r) {
    if (!window.ethereum) {
      alert("Sağlayıcı Bulunamadı");
    } else {
      const provider = await web3Modal.connect("walletconnect");

      const web3Provider = new providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const address = await (await signer.getAddress()).toLocaleLowerCase();
      const network = await web3Provider.getNetwork();
      const web3 = new Web3(provider);

      return { verify, provider, web3Provider, web3, signer, address, network };
    }
  }, []);

  const verifyAccount = useCallback(async function (address) {
    let verify = true;
    await Axios({
      method: "GET",
      url: `${api.baseUrl}${api.users}/${address}`,
    })
      .then((res) => console.log(res))
      .catch((err) => {
        verify = false;
        setVerify(false);
        setVerifyModalOpen(true);
      });
    return verify;
  }, []);

  const connect = useCallback(async function (refresh = false, vf = false) {
    try {
      if (!window.ethereum) {
        alert("Sağlayıcı Bulunamadı");
      } else {
        const accountDetails = await loadWeb3();

        const verify =
          vf ||
          (await verifyAccount(accountDetails.address).catch((e) =>
            console.log(e)
          ));
        if (!verify) {
          return false;
        }
        setVerifyModalOpen(false);
        const token = auth.getToken();
        console.log("token", token, refresh);
        if (token === null || refresh) {
          let url = `${api.baseUrl}${api.users}`;

          await Axios({
            method: "POST",
            url: url,

            data: {
              address: accountDetails.address,
              verify: true,
            },
          })
            .then(function (response) {
              console.log("response", response);
              accountDetails.signer
                .signMessage(
                  "Please sign this message to connect to NextPlanet. We'll use your signature to verify your ownership of this account.\n Nonce: " +
                    response.data.nonce,
                  accountDetails.address
                )
                .then((e) => {
                  Axios({
                    method: "POST",
                    url: `${api.baseUrl}${api.login}`,

                    data: {
                      address: accountDetails.address,
                      nonce: response.data.nonce,
                      fingerprint: "nextrabbittest",
                    },
                  }).then((r) => {
                    localStorage.setItem("jwtToken", r.data.accessToken);
                    localStorage.setItem("refreshToken", r.data.refreshToken);
                    localStorage.setItem("userInfo", response.data.id);
                    setAuthorizationToken(r.data.accessToken);
                    setAccountDetails(accountDetails);
                  });
                });
            })
            .catch(function (error) {});
        } else {
          await setAccountDetails(accountDetails);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  const disconnect = useCallback(
    async function (reload = true) {
      await web3Modal.clearCachedProvider();
      if (
        account.provider?.disconnect &&
        typeof account.provider.disconnect === "function"
      ) {
        await account.provider.disconnect();
      }
      //reset the state here
      const accountDetails = {
        provider: null,
        web3Provider: null,
        web3: null,
        signer: null,
        address: null,
        network: null,
      };
      localStorage.removeItem("jwtToken");
      setAccountDetails(accountDetails);
      setAuthorizationToken(null);
      if (reload) navigate("/");
    },
    [account.provider]
  );
  const trimAddress = (address) => {
    if (address) {
      const firstpart = address.slice(0, 4);
      const midpart = "....";
      const endpart = address.slice(address.length - 4, address.length);
      return `${firstpart}${midpart}${endpart}`;
    }
  };
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);
  useEffect(() => {
    if (
      account.address === null &&
      auth.getToken() &&
      web3Modal.cachedProvider === null
    ) {
      disconnect();
    }
  }, [account.address]);

  useEffect(() => {
    if (account.provider?.on) {
      const handleAccountsChanged = async (accounts) => {
        // eslint-disable-next-line no-console
        await disconnect(false);
        await connect(true);
        // window.location.href = "/";
      };

      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        console.log("disconnect", error);
        // disconnect();
      };

      account.provider.on("accountsChanged", handleAccountsChanged);
      account.provider.on("chainChanged", handleChainChanged);
      account.provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (account.provider.removeListener) {
          account.provider.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          account.provider.removeListener("chainChanged", handleChainChanged);
          account.provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [account.provider, account.disconnect]);

  const value = {
    account,
    setAccountDetails,
    connect,
    disconnect,
    trimAddress,
  };
  window.cn = value;

  return (
    <WalletContext.Provider value={value}>
      {children}
      {verifyModalOpen && (
        <CheckOutModal
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          verifyAccount={() => connect(false, true)}
        />
      )}
    </WalletContext.Provider>
  );
}

function useWallet() {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a Web3Provider");
  }
  return context;
}

export { Web3Provider, useWallet, WalletContext };
