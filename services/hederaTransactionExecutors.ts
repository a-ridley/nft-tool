import { TransferTransaction, Hbar, Client, TokenId, AccountId, TransactionReceipt, PrivateKey } from "@hashgraph/sdk";
import { MirrorNodeClient } from "./mirrorNodeClient";

export const sendHbar = async (client: Client, accounts: (string | AccountId)[], hbar2Send: number) => {
  console.log(accounts[0]);
  let hbarSendRx = [];
  for (var i = 0; i < accounts.length; i++) {
    try {
      if (client.operatorAccountId != null) {
        let hbarSendTx = new TransferTransaction()
          .addHbarTransfer(client.operatorAccountId, -hbar2Send)
          .addHbarTransfer(accounts[i], hbar2Send)
          .freezeWith(client);
        let hbarSendSubmit = await hbarSendTx.execute(client);
        hbarSendRx[i] = await hbarSendSubmit.getReceipt(client);
        console.log(`- Sent hbar to account ${accounts[i]}: ${hbarSendRx[i].status}`);
      }
      else {
        console.log('hedera client operator not set');
      }
    } catch (err) {
      console.log(`- ERROR: Couldn't send hbar to ${accounts[i]}`);
      console.error(err);
    }
  }

  return hbarSendRx;
}

export const createHederaClient = (network: string, treasuryAccountId: string, privateKey: string) => {
  const parts = treasuryAccountId.split('.').map(part => Number.parseInt(part));
  if (parts.length !== 3) {
    throw new Error("Account Id must contain 3 parts. Realm.Shard.AccountNum");
  }

  let hederaClient = Client.forMainnet();
  if (network.toLowerCase() === 'testnet') {
    hederaClient = Client.forTestnet();
  } else if (network.toLowerCase() === 'previewnet') {
    hederaClient = Client.forPreviewnet();
  }

  hederaClient.setOperator(
    treasuryAccountId,
    privateKey,
  );

  return hederaClient;
}

// TODO: Read serial numbers from wallet so you don't have to manually update serial number
export const sendNFT = async (client: Client, accounts: (string | AccountId)[], tokenId: string | TokenId) => {
	const tokenSendRx: TransactionReceipt[] = [];
  const SERIAL_NUM = 1;
	let nftSerial: number = SERIAL_NUM; // the serial# you want to start at
	for (let i = 0; i < accounts.length; i++) {
		try {
      if (client.operatorAccountId != null) { 
        const tokenSendTx = new TransferTransaction()
          .addNftTransfer(tokenId, nftSerial, client.operatorAccountId, accounts[i])
          .freezeWith(client);
        const tokenSendSubmit = await tokenSendTx.execute(client);
        tokenSendRx.push(await tokenSendSubmit.getReceipt(client))
        console.log(`- Sent NFT ${nftSerial} to account ${accounts[i]}: ${tokenSendRx[i].status}`);
      }
      else {
        console.log('hedera client operator not set');
      }
		} catch {
			console.log(`- ERROR: Couldn't send nft to ${accounts[i]}`);
		}
    nftSerial++;
	}
	return tokenSendRx;
}