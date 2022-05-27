import React, { useState } from "react";
import Axios from "../core/axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import api from "../core/api";
import auth from "../core/auth/index";
import Web3 from "web3";

const refreshAuthLogic = async (failedRequest) => {
  delete Axios.defaults.headers.common["Authorization"];
  let url = `${api.baseUrl}${api.refreshToken}`;
  const refreshToken = await Axios({
    method: "POST",
    url: url,
    data: {
      fingerprint: "nextrabbittest",
      refreshToken: auth.getToken("refreshToken"),
    },
  }).then((response) => {
    localStorage.setItem("jwtToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    failedRequest.response.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
    setAuthorizationToken(response.data.accessToken);

    return Promise.resolve();
  });

  // const singMessage = await window.cn.account.signer.signMessage(
  //   refreshToken.data.nonce,
  //   window.cn.account.address
  // );
};
createAuthRefreshInterceptor(Axios, refreshAuthLogic, {
  statusCodes: [401, 403],
});
export const setAuthorizationToken = (token) => {
  if (token) {
    Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete Axios.defaults.headers.common["Authorization"];
  }
};
