import { TokenCreateTransaction, Hbar, TokenType, TokenMintTransaction, TokenId, Client, PrivateKey, AccountId } from '@hashgraph/sdk';
import { createAccount } from './hederaAccountService';
import { File } from "nft.storage";
import { MetadataUploadInfo, uploadNFTMetadatasToIPFS } from './tokenMetadataService';

export const createNonFungibleToken = async (
  client: Client,
  treasureyAccId: string | AccountId,
  supplyKey: PrivateKey,
  treasuryAccPvKey: PrivateKey,
  tokenName: string,
  tokenSymbol: string,
) => {
  // create a transaction with token type fungible
  const createTokenTxn = new TokenCreateTransaction()
    .setTokenName(tokenName)
    .setTokenSymbol(tokenSymbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setInitialSupply(0)
    .setTreasuryAccountId(treasureyAccId)
    .setSupplyKey(supplyKey)
    .setMaxTransactionFee(new Hbar(30))
    .freezeWith(client);

  const createTokenTxnSigned = await createTokenTxn.sign(treasuryAccPvKey);
  // submit txn to hedera network
  const txnResponse = await createTokenTxnSigned.execute(client);
  // request receipt of txn
  const txnRx = await txnResponse.getReceipt(client);
  const txnStatus = txnRx.status.toString();
  const tokenId = txnRx.tokenId;

  console.log(
    `Token Type Creation was a ${txnStatus} and was created with token id: ${tokenId}`
  );

  return tokenId;
};

export const mintToken = async (client: Client, tokenId: string | TokenId, metadatas: Uint8Array[], supplyKey: PrivateKey) => {
  // NOTE: May need to increase token supply

  const mintTokenTxn = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata(metadatas)
    .freezeWith(client);

  const mintTokenTxnSigned = await mintTokenTxn.sign(supplyKey);

  // submit txn to hedera network
  const txnResponse = await mintTokenTxnSigned.execute(client);

  const mintTokenRx = await txnResponse.getReceipt(client);
  const mintTokenStatus = mintTokenRx.status.toString();

  console.log(`Token mint was a ${mintTokenStatus}`);
};

export const addNftsToExistingCollection = async (
  client: Client,
  tokenId: TokenId | string,
  supplyKey: PrivateKey,
  nftStorageApiKey: string,
  metadataUploadInfo: MetadataUploadInfo,
  files: File[],
) => {
  const metadataUrls = await uploadNFTMetadatasToIPFS(nftStorageApiKey, metadataUploadInfo, files);
  const metadatas: Uint8Array[] = metadataUrls.map(url => Buffer.from(url));

  // mint token
  await mintToken(client, tokenId, metadatas, supplyKey);
}


export const createNewNftCollection = async (
  client: Client,
  tokenName: string,
  tokenSymbol: string,
  nftStorageApiKey: string,
  metadataUploadInfo: MetadataUploadInfo,
  files: File[],
): Promise<{
  tokenId: string,
  treasuryAccountId: string,
  treasuryAccountPrivateKey: string,
  supplyKey: string,
}> => {
  // create treasury account
  const [treasuryAccountId, treasuryAccPvKey] = await createAccount(client, 10);
  // generate supply key
  const supplyKey = PrivateKey.generateED25519();
  console.log(`SAVE THIS: Supply Key: ${supplyKey}`;

  // create token type 
  if (treasuryAccountId === null) {
    throw new Error("treasuryAccountId is null");
  }

  console.log(`SAVE THESE: Treasury Account Id: ${treasuryAccountId} Treasury Account Private Key: ${treasuryAccPvKey}`);

  const tokenId = await createNonFungibleToken(client, treasuryAccountId, supplyKey, treasuryAccPvKey, tokenName, tokenSymbol);
  if (tokenId === null) {
    throw new Error("Somehow tokenId is null");
  }
  // make array containing metadata for minting
  // NOTE: Make sure the files are ordered from lowest to highest serial number
  const metadataUrls = await uploadNFTMetadatasToIPFS(nftStorageApiKey, metadataUploadInfo, files);
  const metadatas: Uint8Array[] = metadataUrls.map(url => Buffer.from(url));

  // mint token
  await mintToken(client, tokenId, metadatas, supplyKey);
  return {
    tokenId: tokenId.toString(),
    supplyKey: supplyKey.toStringRaw(),
    treasuryAccountId: treasuryAccountId.toString(),
    treasuryAccountPrivateKey: treasuryAccPvKey.toStringRaw(),
  };
}

