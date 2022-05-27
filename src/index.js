import React, { Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactDOM from "react-dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { setAuthorizationToken } from "./utils/setAuthorizationToken";
import { HelmetProvider } from "react-helmet-async";
import "./assets/style.scss";
import App from "./components/app";

import { Web3Provider } from "./providers";

//
import typography from "./theme/typography";
import breakpoints from "./theme/breakpoints";
import shadows, { customShadows } from "./theme/shadows";

const mainTheme = createTheme({
  palette: {
    primary: {
      main: "#00ab55",
    },
  },
  typography,
  breakpoints,
  shape: { borderRadius: 8 },
  shadows: shadows.light,
  customShadows: customShadows.light,
});

// lang
i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ar"],
    fallbackLng: "ar",
    debug: false,
    // Options for language detector
    detection: {
      order: ["path", "cookie", "htmlTag"],
      caches: ["cookie"],
    },
    // react: { useSuspense: false },
    backend: {
      loadPath: "/assets/locales/{{lng}}/translation.json",
    },
  });
const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Loading..</h3>
  </div>
);
const jwtToken = localStorage.getItem("jwtToken");
if (jwtToken) {
  setAuthorizationToken(jwtToken);
}
ReactDOM.render(
  <Suspense fallback={loadingMarkup}>
    <ThemeProvider theme={mainTheme}>
      <Web3Provider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Web3Provider>
    </ThemeProvider>
  </Suspense>,
  document.getElementById("root")
);
