import { ethers } from "hardhat";
import {Contract, ContractFactory} from "ethers";

async function main() {
  const NalaTokenContract: ContractFactory = await ethers.getContractFactory("NalaToken");
  const nalaToken: Contract = await NalaTokenContract.deploy("Nala Token", "NLA");  

  await nalaToken.deployed();

  console.log(`NalaToken deployed at address ${nalaToken.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
