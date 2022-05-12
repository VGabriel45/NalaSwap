import { ethers } from "hardhat";
import {Contract, ContractFactory} from "ethers";

async function main() {
  const pancakeRouterAddress: string = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

  const NalaRouter: ContractFactory = await ethers.getContractFactory("NalaRouter");
  const nalaRouter: Contract = await NalaRouter.deploy(pancakeRouterAddress);  

  await nalaRouter.deployed();

  console.log(`NalaRouter deployed at address ${nalaRouter.address}`);

  const NalaTokenContract: ContractFactory = await ethers.getContractFactory("NalaToken");
  const nalaToken: Contract = await NalaTokenContract.deploy("Nala Token", "NLA");  

  await nalaToken.deployed();

  console.log(`NalaToken deployed at address ${nalaToken.address}`);

  const stakingToken: string = nalaToken.address;
  const rewardToken: string = nalaToken.address;
  const StakingContract: ContractFactory = await ethers.getContractFactory("Staking");
  const staking: Contract = await StakingContract.deploy(stakingToken, rewardToken);  

  await staking.deployed();

  console.log(`Staking contract deployed at address ${staking.address}`);

  const EyesNFTContract: ContractFactory = await ethers.getContractFactory("Eyes");
  const eyesNft: Contract = await EyesNFTContract.deploy("EYES", "EYE", "ipfs/QmSxkTx7LDNvYYJFFtSVDafd4DD4sAUYD34YydcTML6N7X/");  

  await eyesNft.deployed();

  console.log(`Eyes nft contract deployed at address ${eyesNft.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
