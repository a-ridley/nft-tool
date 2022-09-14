import { NextPage } from "next"
import { useSelector } from 'react-redux';
import { AppStore } from "../store";
import { createNewNftCollection, createToken, mintToken } from "../services/hederaTokenService";
import { createHederaClient } from "../services/hederaTransactionExecutors";


const MintNftForm: NextPage = () => {
  const selectedNetwork = useSelector((state: AppStore) => state.hederaClient.network);
  const accountId = useSelector((state: AppStore) => state.hederaClient.accountId);
  const privateKey = useSelector((state: AppStore) => state.hederaClient.privateKey);

  return (
    <>
      <div>
        <h1>Mint NFT</h1>
      </div>

      <button type="submit" onClick={async () => {
        const client = createHederaClient(selectedNetwork, accountId, privateKey);
        const txnResponse = await createNewNftCollection(client, "test", "TEST");
        console.log(txnResponse);
      }}>Submit</button>
    </>
  )
}

export default MintNftForm