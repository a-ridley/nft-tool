import { NextPage } from "next"
import { useSelector } from 'react-redux';
import { AppStore } from "../store";
import { addNftsToExistingCollection, createNewNftCollection } from "../services/hederaTokenService";
import { createHederaClient } from "../services/hederaTransactionExecutors";
import { Group, TextInput, Text, Space, Button, Container } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useState } from "react";
import { PrivateKey } from "@hashgraph/sdk";


const MintNftToExisitingCollectionForm: NextPage = () => {
  const selectedNetwork = useSelector((state: AppStore) => state.hederaClient.network);
  const accountId = useSelector((state: AppStore) => state.hederaClient.accountId);
  const privateKey = useSelector((state: AppStore) => state.hederaClient.privateKey);

  const [files, setFiles] = useState<File[] | null>(null);
  const [nftStorageApiKey, setNftStorageApiKey] = useState('');
  const [nftName, setNftName] = useState('');
  const [supplyKeyString, setSupplyKeyString] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftCreator, setNftCreator] = useState('');

  return (
    <>
      <Container>
        <div>
          <h1>Mint NFT to an Existing Collection</h1>
        </div>

        <Dropzone
          onDrop={(filesFromInput) => {
            setFiles(filesFromInput);
          }}
          multiple={true}
          id="csvFile"
        >
          <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            {files ? files.map(file => (
              <Text size="xl" inline>
                {file.name}
              </Text>
            )) : (
              <Text size="xl" inline>
                Drag file(s) here or click to select
              </Text>
            )}
          </Group>
        </Dropzone>

        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setTokenId(elm.target.value);
            }
          }}
          value={tokenId}
          type="text"
          label="Token Id"
          required
        />

        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setSupplyKeyString(elm.target.value);
            }
          }}
          value={supplyKeyString}
          type="text"
          label="Supply Key"
          required
        />

        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setNftStorageApiKey(elm.target.value);
            }
          }}
          value={nftStorageApiKey}
          type="text"
          label="NFT Storage API Key:"
          required
        />

        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setNftName(elm.target.value);
            }
          }}
          value={nftName}
          type="text"
          label="Name:"
          required
        />

        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setNftDescription(elm.target.value);
            }
          }}
          value={nftDescription}
          type="text"
          label="Description:"
          required
        />

        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setNftCreator(elm.target.value);
            }
          }}
          value={nftCreator}
          type="text"
          label="Creator:"
          required
        />
        <Space h="md" />
        <Button type="submit" onClick={async () => {
          if (files === null) {
            return;
          }

          const client = createHederaClient(selectedNetwork, accountId, privateKey);
          const supplyKey = PrivateKey.fromString(supplyKeyString);
          const txnResponse = await addNftsToExistingCollection(
            client,
            tokenId,
            supplyKey,
            nftStorageApiKey,
            {
              name: nftName,
              description: nftDescription,
              creator: nftCreator
            },
            files);
          console.log(txnResponse);
        }}>Mint NFT To Existing Collection</Button>

      </Container>
    </>
  )
}

export default MintNftToExisitingCollectionForm