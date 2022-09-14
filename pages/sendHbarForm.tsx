import { NextPage } from "next"
import { useState } from "react";
import { ClientCreateForm } from "../components/clientCreateForm";
import { useSelector } from 'react-redux';
import { AppStore } from "../store";
import { createHederaClient, sendHbar } from "../services/hederaTransactionExecutors";
import { readAccountIds } from "../services/csvReader";
import { Button, Container, Group, Space, TextInput, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

const SendHbarForm: NextPage = () => {
  const selectedNetwork = useSelector((state: AppStore) => state.hederaClient.network);
  const accountId = useSelector((state: AppStore) => state.hederaClient.accountId);
  const privateKey = useSelector((state: AppStore) => state.hederaClient.privateKey);

  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState(0);
  return (
    <>
      <Container>
        <div>
          <h1>Send Hbar</h1>
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
        <label htmlFor="name">Amount:</label>
        <TextInput
          onChange={(elm) => {
            if (elm.target.value) {
              setAmount(Number(elm.target.value));
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
              await onSubmit(selectedNetwork, accountId, privateKey, amount, file)
            } else {
              console.error('file is null');
            }
          }}>
          Submit
        </Button>
      </Container>
    </>
  )
}

const onSubmit = async (network: string, accountId: string, privateKey: string, amount: number, file: File) => {
  const client = createHederaClient(network, accountId, privateKey);
  const accounts = await readAccountIds(file);
  await sendHbar(client, accounts, amount);
}

export default SendHbarForm