import * as React from 'react';
import nftAbi from "../ABIS/EyesNFT.json";
import { BigNumber, Contract, ethers, utils } from 'ethers';
import {useEffect, useState, Fragment} from "react";
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

export default function StakePage () {

    const [errorMessage, setErrorMessage] = useState("");
    const [ownedNfts, setOwnedNfts] = useState([]);

    const nftAddress = "0x78155E681c54Da4c25B6228753EcbfF5d8C2Def8";

    useEffect(() => {
        const displayAndSet = async () => {setOwnedNfts(await displayOwnedNfts())};
        displayAndSet();
    }, [])

    const getOwnedNFTS = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let nftArr = [];
            if (signer) {
              const nftContract = new ethers.Contract(nftAddress, nftAbi, signer);
              const ownedNftsCount = parseInt(await nftContract.balanceOf(signer.getAddress()));
              for (let index = 0; index < ownedNftsCount; index++) {
                    let nftId = await nftContract.tokenOfOwnerByIndex(signer.getAddress(), index);
                    nftArr.push(nftId);                  
              }
              return nftArr;
            }
        }
    }

     const displayOwnedNfts = async () => {
        let ids = await getOwnedNFTS();
        let nftMetadataArr = [];
        for (let index = 0; index < ids.length; index++) {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/QmSxkTx7LDNvYYJFFtSVDafd4DD4sAUYD34YydcTML6N7X/${ids[index]}.json`)
            const responseJson = await response.json();
            nftMetadataArr.push(responseJson);
        }
        return nftMetadataArr;
    }

    const mintNft = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            if (signer) {
              const nftContract = new ethers.Contract(nftAddress, nftAbi, signer);
              try {
                const tx = await nftContract.connect(signer).mint(
                    signer.getAddress(),
                    1,
                    {value: ethers.utils.parseEther("1"), from: signer.getAddress()}
                )
                tx.wait();
                console.log(tx);
                } catch (error) {
                    console.log("Transaction error");
                }
            } else {
                setErrorMessage("Cannot stake 0 tokens");
            }
        }
        
    }

    const buttons = [
        <Button key="Mint" onClick={() => mintNft()}>Mint</Button>,
    ];

    return (
        <>
            <ButtonGroup size="large" aria-label="large button group">
                {buttons}
            </ButtonGroup>
            My Nfts
            <div style={{display: "flex", flexDirection:"row", justifyContent: "space-between"}}>
                {ownedNfts.map(nft => 
                    <div>
                        <p>{nft.name}</p>
                        <img style={{width: "100px", borderRadius: "10px"}} src={`https://gateway.pinata.cloud/ipfs/QmcEfnhCfPn5SFA9PQ6YRELsTrDRSkapYiHwEAifuWtNQp/${nft.edition}.png`}/>
                    </div>
                )}
            </div>
        </>
    )
}