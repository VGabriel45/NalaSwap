import { ethers } from "hardhat";
import {Contract, ContractFactory} from "ethers";

async function main() {
  const stakingToken: string = "0x74B69B5301112e7c97fE45353293fB73f1B0a225";
  const rewardToken: string = "0x74B69B5301112e7c97fE45353293fB73f1B0a225";
  const StakingContract: ContractFactory = await ethers.getContractFactory("Staking");
  const staking: Contract = await StakingContract.deploy(stakingToken, rewardToken);  

  await staking.deployed();

  console.log(`Staking contract deployed at address ${staking.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
