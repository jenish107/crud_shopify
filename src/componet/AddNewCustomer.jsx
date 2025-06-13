import {
  Page,
  Card,
  Text,
  Button,
  IndexTable,
  LegacyStack,
  TextField,
  InlineStack,
  LegacyCard,
  DropZone,
  FormLayout,
  BlockStack,
  Image,
  Thumbnail,
  Box,
  useIndexResourceState,
  Badge,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export default function AddNewCustomer({
  customer,
  setCustomer,
  currFilds,
  setIsUpdate,
  isUpdate,
  setCurrFilds,
  setIsForm,
}) {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleFieldChange = () => {
    const { value, name } = event.target;

    setCurrFilds((pre) => ({ ...pre, [name]: value }));
  };

  // img input

  const handleDrop = useCallback(
    async (_droppedFiles, acceptedFiles, rejectedFiles) => {
      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
        
          reader.readAsDataURL(file); // Base64
        });
      };

      const base64Files = await Promise.all(
        acceptedFiles.map((file) => convertToBase64(file))
      );

      setCurrFilds((pre) => ({ ...pre, files: base64Files }));
      setRejectedFiles(rejectedFiles);
    },
    []
  );

  const fileUpload = !currFilds.files.length && <DropZone.FileUpload />;
  const uploadedFiles = currFilds.files.length > 0 && (
    <>
      {currFilds.files.map((file, index) => (
        <InlineStack align="center">
          <Image
            height="150px"
            source={file}
            alt="a sheet with purple and orange stripes"
          />
        </InlineStack>
      ))}
    </>
  );

  const errorMessage = hasError && (
    <Banner title="The following images couldn’t be uploaded:" tone="critical">
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  // end img input

  const clearForm = () => {
    setCurrFilds({
      id: customer?.length + 1,
      mobile_number: "",
      pin: "",
      age: "",
      email: "",
      name: "",
      files: "",
    });
  };

  const addNewCustomer = () => {
    setIsForm((pre) => !pre);

    setCustomer((pre) => [...pre, currFilds]);
    clearForm();
  };

  const handleUpdateOnclick = (id) => {
    setCustomer((prev) =>
      prev.map((cust) => (cust.id === id ? { ...currFilds } : cust))
    );
    setIsForm((pre) => !pre);
    setIsUpdate(false);
    clearForm();
  };

  useEffect(() => {
    localStorage.setItem("currFilds", JSON.stringify(currFilds));
  }, [currFilds]);

  return (
    <>
      <FormLayout>
        <Box paddingInline="300" minWidth="400px">
          <BlockStack gap="300">
            <LegacyStack vertical>
              <InlineStack wrap={false} align="center">
                {errorMessage}
                <div style={{ width: 160, height: 150 }}>
                  <DropZone accept="image/*" type="image" onDrop={handleDrop}>
                    {uploadedFiles}
                    {fileUpload}
                  </DropZone>
                </div>
              </InlineStack>
            </LegacyStack>
            <TextField
              name="name"
              label="First name"
              value={currFilds.name}
              onChange={() => handleFieldChange()}
              placeholder="first name"
              autoComplete="off"
            />
            <TextField
              name="mobile_number"
              label="Mobile number"
              type="number"
              value={currFilds.mobile_number}
              onChange={() => handleFieldChange()}
              autoComplete="off"
            />
            <TextField
              name="pin"
              label="Pin"
              type="number"
              value={currFilds.pin}
              onChange={() => handleFieldChange()}
              autoComplete="off"
            />
            <TextField
              name="age"
              label="Age"
              type="number"
              value={currFilds.age}
              onChange={() => handleFieldChange()}
              autoComplete="off"
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="Email"
              value={currFilds.email}
              onChange={() => handleFieldChange()}
              autoComplete="email"
            />

            <BlockStack inlineAlign="end">
              {isUpdate ? (
                <Button
                  variant="primary"
                  onClick={() => handleUpdateOnclick(currFilds.id)}
                >
                  Update
                </Button>
              ) : (
                <Button
                  textAlign="end"
                  size="medium"
                  variant="primary"
                  onClick={addNewCustomer}
                >
                  Add customer
                </Button>
              )}
            </BlockStack>
          </BlockStack>
        </Box>
      </FormLayout>
    </>
  );
}
