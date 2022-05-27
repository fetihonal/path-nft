import React, { useState } from "react";
import { navigate } from "@reach/router";
import { useWallet } from "../../providers";
// @mui
import {
  Grid,
  Button,
  Box,
  Stack,
  Modal,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
// ----------------------------------------------------------------------

const ModalBox = styled("div")(({ theme }) => ({
  top: "50%",
  left: "50%",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  width: 700,
  backgroundColor: "white",
  borderRadius: 20,
  boxShadow: 2,
  padding: 25,
  h3: {
    margin: 0,
    marginBottom: 5,
    color: theme.palette.primary.main,
  },
}));
export default function CheckOut({ open, onClose, verifyAccount }) {
  // web3
  const { connect } = useWallet();

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox>
          <h3 style={{ margin: 0 }}>Secure Checkout</h3>
          <span
            style={{
              marginBottom: "20px",
              paddingBottom: 20,
              display: "block",
              borderBottom: "1px solid #ddd",
            }}
          >
            Your data is protected, everything will be private.
          </span>

          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Stack spacing={3}>
                <h3 style={{ margin: 0 }}>Billing</h3>
                <TextField fullWidth name="buy_price" label="Company Name" />
                {/* <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={age}
                    label="Country"
                    // onChange={handleChange}
                  >
                    <MenuItem value={10}>Turkey</MenuItem>
                  </Select>
                </FormControl> */}
                <h3 style={{ marginTop: 20 }}>Payment</h3>
                <TextField fullWidth name="buy_price" label="Cardholder Name" />
                <TextField fullWidth name="buy_price" label="Card Number" />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <TextField
                    fullWidth
                    name="buy_price"
                    label="Expiry Date (MM/YYYY)"
                  />
                  <TextField fullWidth name="buy_price" label="CVV2" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box
                sx={{
                  backgroundColor: "#f4f9ff",
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <h3 style={{ margin: 0 }}>Summary</h3>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  sx={{ padding: "10px 0", borderBottom: "1px dashed #ccc" }}
                >
                  Coupon code discount <strong>0 $</strong>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  sx={{ padding: "10px 0", borderBottom: "1px dashed #ccc" }}
                >
                  Total billed now <strong>29 $</strong>
                </Stack>
                <small>
                  As long as this subscription is active, you will be charged
                  $29 per year.
                </small>
                <hr />
                <LoadingButton
                  fullWidth
                  loading={loading}
                  size="large"
                  variant="contained"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      verifyAccount();
                    }, 4000);
                  }}
                >
                  Place Order
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </ModalBox>
      </Modal>
    </>
  );
}
