import { PrivateKey } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { createHederaClient } from "../services/hederaTransactionExecutors";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, AppStore } from "../store";
import { MirrorNodeClient } from "../services/mirrorNodeClient";
import { Container, Select, Space, TextInput } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle,faTimesCircle } from "@fortawesome/free-solid-svg-icons";


export const ClientCreateForm = () => {
  const networkOptions = [{
    label: 'Mainnet',
    value: 'mainnet',
  },
  {
    label: 'Testnet',
    value: 'testnet'
  },
  {
    label: 'Previewnet',
    value: 'previewnet'
  }];

  const selectedNetwork = useSelector((state: AppStore) => state.hederaClient.network);
  const accountId = useSelector((state: AppStore) => state.hederaClient.accountId);
  const privateKey = useSelector((state: AppStore) => state.hederaClient.privateKey);

  const [isClientSetUp, setIsClientSetup] = useState(false);
  const [err, setErr] = useState<any>(null);

  useEffect( () => {
    try {
      const mirrorNodeClient = new MirrorNodeClient(selectedNetwork);
      mirrorNodeClient.getAccountInfo(accountId)
        .then(acc => {
          const publicKey = acc.key.key;
          const generatedPublicKey = PrivateKey.fromString(privateKey).publicKey.toStringRaw();
          if (publicKey === generatedPublicKey) {
            const client = createHederaClient(selectedNetwork, accountId, privateKey)
      
            if (client.operatorAccountId) {
              setIsClientSetup(true);
              setErr(null);
            } else {
              setErr({
                message: "Could not set operatorAccountId"
              });
              setIsClientSetup(false);
            }
          } else {
            console.log('pvk does not match account id');
            setErr({
              message: "Private key does not match account Id."
            });
            setIsClientSetup(false);
          }
        })
        .catch(rejectErr => {
          setErr({
            message: rejectErr.message ? rejectErr.message : `Could not get public key for account id: ${accountId}`
          });
          setIsClientSetup(false);
        })
    } catch (err: any) {
      setErr(err);
      setIsClientSetup(false);
    }
  }, [selectedNetwork, accountId, privateKey]);

  const dispatch = useDispatch();
  
  return (
      <Container style={{width: '100%'}}>
          <h2>Create your Client</h2>
          <Select
            label='Network'
            value={selectedNetwork}
            onChange={value => {
              dispatch(actions.hederaClient.setNetwork(value));
            }}
            data={networkOptions}
          >
          </Select>
          <label htmlFor="accountId">Account Id:</label>
          <TextInput
            type="text"
            id="accountId"
            value={accountId}
            onChange={(e) => {
              dispatch(actions.hederaClient.setAccountId(e.target.value));
            }}
            required
          />
          <label htmlFor="privateKey">Private Key:</label>
          <TextInput
            type="text"
            id="privateKey"
            value={privateKey}
            onChange={(e) => {
              dispatch(actions.hederaClient.setPrivateKey(e.target.value));
            }}
            required
          />

          <Space h="md"/>
          { isClientSetUp ? (
            <>
            <span>Client Connected </span>
            <Space w="xs" />
            <FontAwesomeIcon icon={faCheckCircle} color="green" />
            </>
            ) : (
              <>
              <span>Client Not Connected </span>
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
              </>
          )}
          {err && (
            <pre
              style={{
                whiteSpace: 'break-spaces'
              }}
            >
              {JSON.stringify({
                error: err,
                message: err.message,
              }, undefined, 2)}
            </pre>
          )}
      </Container>

  )
}

