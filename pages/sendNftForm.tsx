import { TokenId } from "@hashgraph/sdk";
import { NextPage } from "next"
import { useState } from "react";
import { useSelector } from 'react-redux';
import { AppStore } from "../store";
import { ClientCreateForm } from "../components/clientCreateForm";
import { createHederaClient, sendNFT } from "../services/hederaTransactionExecutors";
import { readAccountIds } from "../services/csvReader";
import { Container, Group, Text, TextInput, Space, Button } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

const SendNftForm: NextPage = () => {
  const selectedNetwork = useSelector((state: AppStore) => state.hederaClient.network);
  const accountId = useSelector((state: AppStore) => state.hederaClient.accountId);
  const privateKey = useSelector((state: AppStore) => state.hederaClient.privateKey);

  const [file, setFile] = useState<File | null>(null);
  const [tokenId, setTokenId] = useState<string>('');

  return (
    <>
      <Container>
        <div>
          <h1>Send NFT</h1>
        </div>
        <Dropzone
          onDrop={(files) => {
            setFile(files[0]);
          }}
          id="csvFile"
          accept={{ 'text/csv': ['.csv'] }}
        >
          <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            <Text size="xl" inline>
              { file ? file.name : 'Drag csv file here or click to select file' }
            </Text>
          </Group>
        </Dropzone>
        <label htmlFor="name">Token Id:</label>
        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setTokenId(elm.target.value);
            }
          }}
          type="text"
          id="name"
          name="name"
          required
        />
        <Space h="md" />
        <Button
          type="submit"
          onClick={async () => {
            if (file != null) {
              await onSubmit(selectedNetwork, accountId, privateKey, tokenId, file)
            } else {
              console.error('file is null');
            }
          }}>
          Submit
        </Button>

        <h3>Note: Make sure the wallet has all the serial numbers of the NFTs that you are sending in the account and the code is updated.</h3>
      </Container>
    </>
  )
}

const onSubmit = async (network: string, accountId: string, privateKey: string, tokenId: string, file: File) => {
  const client = createHederaClient(network, accountId, privateKey);
  const accounts = await readAccountIds(file);
  await sendNFT(client, accounts, tokenId);
}


export default SendNftForm