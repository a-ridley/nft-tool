export class MirrorNodeClient {
    url = "https://mainnet-public.mirrornode.hedera.com/";
    constructor(network: string) {
      if (network === "testnet") {
        this.url = "https://testnet.mirrornode.hedera.com/";
      } else if (network === "previewnet") {
        this.url = "https://previewnet.mirrornode.hedera.com/";
      }
    }
  
    async getAccountInfo(accountId: string) {
      const accountInfo = await fetch(`${this.url}api/v1/accounts/` + accountId, { method: "GET" });
      const accountInfoJson: { key: { key: string } } = await accountInfo.json();
      return accountInfoJson;
    }
  }