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
        const file = filesToUpload[i];
        const fileType = file.type;
        const nftJSON = {
            name: metadataUploadInfo.name,
            creator: metadataUploadInfo.creator,
            description: metadataUploadInfo.description,
            image: file,
            type: fileType,
            format: "none",
        };
        const metadata = await nftClient.store(nftJSON);
        metadataUrls.push(metadata.url);
    }
    return metadataUrls;
}