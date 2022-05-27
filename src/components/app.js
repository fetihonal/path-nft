import React from "react";
import { Router, Location, Redirect } from "@reach/router";
import { history } from "../history";
import Header from "../components/Header";
import Home from "../pages/home";
import Login from "../pages/auth/login";
import Create from "../pages/create";
import Dashboard from "../pages/dashboard";
import Detail from "../pages/detail";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CssBaseline } from "@mui/material";
export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location]);
  return children;
};

const PosedRouter = ({ children }) => (
  <>
    <Header />
    <Location>
      {({ location }) => (
        <Router location={location} history={history}>
          {children}
        </Router>
      )}
    </Location>
  </>
);
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuth = true;

  return isAuth ? (
    <>
      <Component {...rest} />{" "}
    </>
  ) : (
    <Redirect from="" to="/" noThrow />
  );
};

const app = () => (
  <div className="wraper">
    <ToastContainer />
    <CssBaseline />

    <PosedRouter>
      <ScrollTop path="/">
        <Home exact path="/">
          {/* <Redirect to="/home" /> */}
        </Home>
        <Login path="/login"></Login>
        <Detail path="/:chain/:contactAddress/:nftId" />
        <ProtectedRoute component={Create} path="/create" />
        <ProtectedRoute component={Dashboard} path="/dashboard" />
      </ScrollTop>
    </PosedRouter>
  </div>
);
export default app;
