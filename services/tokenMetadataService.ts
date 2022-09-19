import { NFTStorage, File } from "nft.storage";

export interface MetadataUploadInfo {
    name: string,
    creator: string,
    description: string,
}

export const uploadNFTMetadatasToIPFS = async (nftStorageApiKey: string, metadataUploadInfo: MetadataUploadInfo, filesToUpload: File[]) => {
    // Configure NFT Storage client
    const nftClient = new NFTStorage({ token: nftStorageApiKey });

    // MINT NEW BATCH OF NFTs WITH NFT STORAGE
    const metadataUrls: string[] = [];
    for (var i = 0; i < filesToUpload.length; i++) {
        // upload image file to ipfs first
        const file = filesToUpload[i];
        const fileCID = await nftClient.storeBlob(file);

        // create metadata.json to upload to ipfs
        const nftJSON = {
            name: metadataUploadInfo.name,
            creator: metadataUploadInfo.creator,
            description: metadataUploadInfo.description,
            image: `ipfs://${fileCID}`,
            type: file.type,
            format: "opensea",
        };
        const nftJSONString = JSON.stringify(nftJSON);
        const metadataCid = await nftClient.storeBlob(new File([nftJSONString], 'metadata.json', {
            type: 'application/json'
        }));
        metadataUrls.push(`ipfs://${metadataCid}`);
    }
    return metadataUrls;
}