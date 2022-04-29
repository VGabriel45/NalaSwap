import { ethers } from "hardhat";
import {Contract, ContractFactory} from "ethers";

async function main() {
  const pancakeRouterAddress: string = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

  const NalaRouter: ContractFactory = await ethers.getContractFactory("NalaRouter");
  const nalaRouter: Contract = await NalaRouter.deploy(pancakeRouterAddress);  

  await nalaRouter.deployed();

  console.log(`NalaRouter deployed at address ${nalaRouter.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
