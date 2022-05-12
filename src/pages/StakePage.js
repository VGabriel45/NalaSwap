import * as React from 'react';
import stakingContractABI from "../ABIS/StakingABI.json";
import nftAbi from "../ABIS/EyesNFT.json";
import { BigNumber, Contract, ethers, utils } from 'ethers';
import { formatUnits, parseEther } from '@ethersproject/units';
import {useEffect, useState, Fragment} from "react";
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function StakePage () {

    const [balance, setBalance] = useState(0);
    const [balanceWithRewards, setBalanceWithRewards] = useState(0);
    const [amount, setAmount] = useState(0);
    const [rewardsPerDay, setRewardsPerDay] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [ownedNfts, setOwnedNfts] = useState([]);

    const contractAddress = "0xb1603AE4B2aE6cecf2F7A57a3084bc43aC34cFF5";
    const nlaTokenAddress = "0x58c7CA8effEDDEdD5178bc76509dEC0f278Dd0eE";
    const nftAddress = "0x78155E681c54Da4c25B6228753EcbfF5d8C2Def8";

    useEffect(() => {
        getUserStakedAmount();
        getRewardsPerDay();
        getUserBalanceWithRewards();
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

    const stakeTokens = async (amount) => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            if (signer && parseInt(amount) > 0) {
              const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, signer);
              const nlaToken = new ethers.Contract(nlaTokenAddress, ["function approve(address _spender, uint256 _value) public returns (bool success)"], signer);
              nlaToken.connect(signer).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
              try {
                const tx = await stakingContract.connect(signer).stakeTokens(
                    ethers.utils.parseEther(amount.toString())
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

    const withdrawTokens = async (amount) => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            if (signer && parseInt(amount) > 0) {
              const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, signer);
              const nlaToken = new ethers.Contract(nlaTokenAddress, ["function approve(address _spender, uint256 _value) public returns (bool success)"], signer);
              nlaToken.connect(signer).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
              try {
                const tx = await stakingContract.connect(signer).withdrawTokens(
                    ethers.utils.parseEther(amount.toString())
                )
                tx.wait();
                } catch (error) {
                    console.log("Transaction error");
                }
            } else {
                setErrorMessage("Cannot stake 0 tokens");
            }
        }
        
    }

    const getUserStakedAmount = async () => {

        let balance;

        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            if (signer) {
              const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, signer);
              try {
                balance = await stakingContract.stakerBalance(signer.getAddress());
                } catch (error) {
                    console.log("Transaction error");
                }
            }
        }

        // console.log(formatUnits(BigNumber.from(balance.toString(), 18)));
        setBalance(formatUnits(BigNumber.from(balance.toString(), 18)));
    }

    const getUserBalanceWithRewards = async () => {

        let balance;

        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            if (signer) {
              const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, signer);
              try {
                balance = await stakingContract.getBalanceWithRewards(signer.getAddress());
                } catch (error) {
                    console.log("Transaction error");
                }
            }
        }

        // console.log(formatUnits(BigNumber.from(balance.toString(), 18)));
        setBalanceWithRewards(formatUnits(BigNumber.from(balance.toString(), 18)));
    }

    const getRewardsPerDay = async () => {
        let rewards;

        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            if (signer) {
              const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, signer);
              try {
                rewards = await stakingContract.getRewardsPerDay(signer.getAddress());
                } catch (error) {
                    console.log("Transaction error");
                }
            }
        }

        setRewardsPerDay(formatUnits(BigNumber.from(rewards.toString(), 18)));
    }

    const buttons = [
        <Button key="Deposit" onClick={() => stakeTokens(amount)}>Deposit</Button>,
        <Button key="Withdraw" onClick={() => withdrawTokens(amount)}>Withdraw</Button>,
        <Button key="Withdraw" onClick={() => mintNft()}>Mint</Button>,
    ];

    return (
        <>
            <small>Stake your NLA tokens</small>
             <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > *': {
                      m: 1,
                    },
                  }}
                noValidate
                autoComplete="off"
                style={{borderRadius:"10px", border:"2px solid #502199", marginBottom:"5%", paddingBottom: "10px"}}
                >
                <div >
                    <p style={{fontSize: "25px"}}>Total staked: {balance}</p>
                    <p style={{fontSize: "25px"}}>Current balance: {balanceWithRewards}</p>
                    <p style={{fontSize: "25px"}}>Rewards per day: {rewardsPerDay}</p>
                    <p style={{fontSize: "25px"}}>APR% {balance}</p>
                </div>
                <ButtonGroup size="large" aria-label="large button group">
                    {buttons}
                </ButtonGroup>
                <TextField id="outlined-basic" label="Amount..." variant="outlined" size="small" type="number" onChange={(e) => setAmount(e.target.value)}/>
                <small style={{color: "red"}}>{errorMessage}</small>
                <button onClick={() => mintNft()}>Mint nft</button>
            </Box>
            <div style={{dispaly: "flex", flexDirection: "row"}}>
                    My Nfts
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