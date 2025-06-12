import { useState, useCallback, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  Page,
  Card,
  Text,
  Button,
  IndexTable,
  LegacyStack,
  BlockStack,
  Box,
  TextField,
  LegacyCard,
  Icon,
  DropZone,
  Thumbnail,
  Bleed,
  InlineStack,
  Link,
  useIndexResourceState,
  Badge,
} from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import AddNewCustomer from "./componet/AddNewCustomer";

function App() {
  const [isForm, setIsForm] = useState(false);
  const [customer, setCustomer] = useState(
    JSON.parse(localStorage.getItem("customer")) ||
      [
        // {
        //   id: 1,
        //   mobile_number: "987789",
        //   pin: "24242",
        //   age: "43",
        //   email: "jen@gamil.com",
        //   name: "jenish",
        //   // files:
        // },
        // {
        //   id: 2,
        //   mobile_number: "434389",
        //   pin: "42902",
        //   age: "31",
        //   email: "den@gamil.com",
        //   name: "denish",
        // },
      ]
  );

  const [currFilds, setCurrFilds] = useState(
    JSON.parse(localStorage.getItem("currFilds")) || {
      id: customer?.length + 1,
      mobile_number: "",
      pin: "",
      age: "",
      email: "",
      name: "",
      files: "",
    }
  );

  const [isUpdate, setIsUpdate] = useState(false);

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customer);

  const handleDeleteClick = (id) => {
    setCustomer((pre) => pre.filter((currCustomer) => id != currCustomer.id));
  };
  const handleEditClick = (id) => {
    var tempData = customer.filter((currCustomer) => currCustomer.id === id);

    setIsForm((pre) => !pre);
    setCurrFilds(tempData[0]);
    setIsUpdate(true);
  };
  const rowMarkup = customer?.map(
    ({ mobile_number, pin, age, email, name, id, files }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          {" "}
          {files.map((file, index) => (
            <Thumbnail key={index} size="large" alt={file.name} source={file} />
          ))}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Link removeUnderline={true} monochrome dataPrimaryLink>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {name}
            </Text>
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>{age}</IndexTable.Cell>
        <IndexTable.Cell>{email}</IndexTable.Cell>
        <IndexTable.Cell>{mobile_number}</IndexTable.Cell>
        <IndexTable.Cell>{pin}</IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack align="start" gap="600" wrap={false}>
            <Box onClick={() => handleDeleteClick(id)}>
              <Icon source={DeleteIcon} tone="textWarning" />
            </Box>
            <Box onClick={() => handleEditClick(id)}>
              <Icon source={EditIcon} tone="textWarning" />
            </Box>
          </InlineStack>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  // setlocalstorage
  useEffect(() => {
    localStorage.setItem("customer", JSON.stringify(customer));
  }, [customer]);

  return (
    <Box padding="300">
      {isForm ? (
        <BlockStack align="center" inlineAlign="center">
          <Card>
            <AddNewCustomer
              setIsForm={setIsForm}
              customer={customer}
              setCustomer={setCustomer}
              currFilds={currFilds}
              setCurrFilds={setCurrFilds}
              setIsUpdate={setIsUpdate}
              isUpdate={isUpdate}
            />
          </Card>
        </BlockStack>
      ) : (
        <>
          <LegacyCard>
            <IndexTable
              resourceName={resourceName}
              selectable={false}
              itemCount={customer.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Photo" },
                { title: "Name" },
                { title: "Age" },
                { title: "Email" },
                { title: "Mobile No." },
                { title: "Pin" },
                { title: "Action", align: "end" },
              ]}
            >
              {rowMarkup}
            </IndexTable>
          </LegacyCard>
          <BlockStack>
            <Button onClick={() => setIsForm((pre) => !pre)}>
              Add New Data
            </Button>
          </BlockStack>
        </>
      )}
    </Box>
  );
}

export default App;
