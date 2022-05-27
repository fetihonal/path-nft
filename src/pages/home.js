import React, { useEffect } from "react";
import Header from "../components/Header";
import HomeSlider from "../components/HomeSlider";
import HomeInfoBox from "../components/HomeInfoStepBox";
import { Container, Grid } from "@mui/material";
const Home = () => {
  return (
    <>
      <Container maxWidth="lg">
        <HomeSlider />
        <HomeInfoBox />
      </Container>
    </>
  );
};
export default Home;
