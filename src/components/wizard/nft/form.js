import React, { useEffect, useState } from "react";
// @mui
import {
  Box,
  Grid,
  Stack,
  Link,
  Alert,
  Tooltip,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
// components
import Image from "../../../components/Image";
import {
  RHFSwitch,
  RHFEditor,
  FormProvider,
  RHFTextField,
} from "../../../components/hook-form";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
//form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ----------------------------------------------------------------------
const Page = styled("div")(({ theme }) => ({
  padding: "100px 0",
}));

const Item = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "50px 20px 10px 20px",
  borderRadius: 20,
  height: "100%",
  marginTop: 50,
  transition: ".3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));
const PageInfo = styled("div")(({ theme }) => ({
  marginBottom: 50,
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
    width: "50%",
    margin: "0 auto",
  },
}));

const NFTForm = (props) => {
  const { contract, steps, setSteps, stepChange, onSubmit } = props;

  // Form
  const defaultValues = {
    name: "",
    description: "",
  };
  const postSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
  });
  const methods = useForm({
    resolver: yupResolver(postSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const [unlock, setUnlock] = useState(false);
  const [selectedFileAsBuffer, setSelectedFileAsBuffer] = useState(undefined);
  const [previewURL, setPreviewURL] = useState();
  const [attributes, setAttributes] = useState([
    {
      trait_type: "Base",
      value: "Starfish",
    },
    {
      trait_type: "Eyes",
      value: "Big",
    },
  ]);

  const controlAttributes = (name, value, key) => {
    setAttributes(
      attributes.map((item, index) => {
        if (key === index) {
          item[name] = value;
        }
        return item;
      })
    );
  };
  const addAttributes = () => {
    setAttributes((prev) => [
      ...prev,
      {
        trait_type: "",
        value: "",
      },
    ]);
  };
  const removeAttributes = (key) => {
    setAttributes(attributes.filter((item, index) => key !== index));
  };

  function fileSelectedHandler(e) {
    const data = e.target.files[0];

    const reader = new window.FileReader();
    const objectUrl = URL.createObjectURL(data);
    setPreviewURL(objectUrl);
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      console.log("Buffer Data:", Buffer(reader.result));
      setSelectedFileAsBuffer(Buffer(reader.result));
    };
    e.preventDefault();
  }
  const formOnSubmit = (data) => {
    data.attributes = attributes;
    data.selectedFileAsBuffer = selectedFileAsBuffer;
    onSubmit(data);
  };

  return (
    <>
      <Page>
        <FormProvider methods={methods} onSubmit={handleSubmit(formOnSubmit)}>
          <PageInfo>
            <h5>Create</h5>
            <h1>Create New NFT</h1>
            <span>
              lorem ipsum dolor sit amet, consectetur adip, lorem ipsum dolor
              sit amet, consectetur adip lorem ipsum dolor sit amet, consectetur
              adip
            </span>
          </PageInfo>
          <Grid container spacing={4}>
            <Grid item xs={12} md={9}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  padding: 3,
                }}
              >
                <Alert severity="info" sx={{ mb: 3 }}>
                  Selected Contract Address :
                  <strong>{contract?.token_address}</strong>
                </Alert>

                <Stack spacing={3}>
                  <div className="d-create-file">
                    <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                    {/* {this.state.files.map(x => 
                        <p key="{index}">PNG, JPG, GIF, WEBP or MP4. Max 200mb.{x.name}</p>
                        )} */}
                    <div className="browse">
                      <input
                        type="button"
                        id="get_file"
                        className="btn-main"
                        value="Browse"
                      />
                      <input
                        id="upload_file"
                        name="upload_file"
                        type="file"
                        onChange={fileSelectedHandler}

                        // onChange={onChangeFiles}
                      />
                    </div>
                  </div>
                  <RHFTextField id="name" name="name" label="NFT Name" />
                  <RHFTextField
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                  />
                  <RHFTextField
                    id="buy_price"
                    name="buy_price"
                    label="Buy Price"
                    placeholder="enter price for one item (ETH)"
                  />
                  <RHFTextField
                    id="item_royalties"
                    name="item_royalties"
                    label="Royalties"
                  />
                </Stack>
              </Box>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  padding: 3,
                  marginTop: 2,
                }}
              >
                <Alert severity="info" sx={{ mb: 3 }}>
                  Selected NFT Attributes
                </Alert>
                {attributes.map((item, key) => (
                  <Stack direction="row" spacing={3} sx={{ marginBottom: 2 }}>
                    <RHFTextField
                      value={item.trait_type}
                      id="trait_type"
                      name="trait_type"
                      onChange={(e) =>
                        controlAttributes(e.target.id, e.target.value, key)
                      }
                      label="Trait Type"
                    />
                    <RHFTextField
                      value={item.value}
                      id="value"
                      name="value"
                      onChange={(e) =>
                        controlAttributes(e.target.id, e.target.value, key)
                      }
                      label="Value"
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => removeAttributes(key)}
                    >
                      <DeleteOutlineIcon />
                    </Button>
                  </Stack>
                ))}
                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  onClick={() => addAttributes()}
                >
                  Add New Attributes
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  padding: 3,
                  marginBottom: 2,
                }}
              >
                <Image
                  src={previewURL || "./img/collections/coll-item-3.jpg"}
                  alt="asd"
                  sx={{ borderRadius: 1, marginBottom: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {watch("name") || "Pinky Ocean"}
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Typography variant="span" gutterBottom>
                    {watch("buy_price") || 0.01}
                  </Typography>
                  <Typography variant="span" gutterBottom>
                    1/{watch("item_royalties") || "20"}
                  </Typography>
                </Stack>
              </Box>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleSubmit(formOnSubmit)}
              >
                Create New NFT
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Page>
      {/* <section className="jumbotron breadcumb no-bg bg-white">
        <div className="mainbreadcumb pb-0">
          <div className="container">
            <div className="row">
              <div className="col-9 m-auto">
                <h1 className="text-center mb-5" style={{ color: "#00d6a3" }}>
                  Create NFT Vizard
                </h1>
                <h5 className="text-dark">Create New Nft</h5>
                <p className="text-dark m-0">
                  lorem ipsum dolor sit amet, consectetur adip, lorem ipsum
                  dolor sit amet, consectetur adip lorem ipsum dolor sit amet,
                  consectetur adip
                </p>
                {contract && (
                  <div className="text-black mt-2 p-2 border bg-gray">
                    <stron>Selected Contract Address :</stron>{" "}
                  </div>
                )}
                <hr />
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};
export default NFTForm;
