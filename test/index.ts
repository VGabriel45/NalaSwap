const { ethers } = require("hardhat");
import {Contract, Signer} from "ethers";

describe("NalaRouter testing", function () {

  //constants
  const pancakeRouterAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  const cakeTokenAddress = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82";

  //variables
  let nalaRouter: Contract;
  let owner: Signer;

  beforeEach("deploy contract before each test", async () => {
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    // const NalaRouterContract = await ethers.getContractFactory("NalaRouter");
    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_pancakeRouterAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "pancakeRouter",
        "outputs": [
          {
            "internalType": "contract IPancakeRouter02",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          }
        ],
        "name": "swapBNBForExactTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          }
        ],
        "name": "swapExactBNBForTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          }
        ],
        "name": "swapExactTokensForBNB",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
          }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amountInMax",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          }
        ],
        "name": "swapTokensForExactBNB",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountInMax",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
          }
        ],
        "name": "swapTokensForExactTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      }
    ]
    nalaRouter = new ethers.Contract("0x6574F3dea1EB56b9F2e752cB93b7Cc8739176cd5", abi, owner);
    // await nalaRouter.deployed();
    // console.log(`NalaRouter deployed at address ${nalaRouter.address}`);
  })

  // it('Should SWAP BNB for CAKE tokens', async () => {
  //   const bnb_cake_swap_tx = await nalaRouter.connect(owner).swapExactBNBForTokens(
  //     0,
  //     cakeTokenAddress,
  //     {value: ethers.utils.parseEther("1000")},
  //   )
  //   console.log(bnb_cake_swap_tx);
  // })

  // it('Should SWAP CAKE tokens for BNB', async () => {
  //   const cakeToken = new ethers.Contract(cakeTokenAddress, ["function approve(address _spender, uint256 _value) public returns (bool success)"], owner)
  //   await cakeToken.connect(owner).approve("0x6574F3dea1EB56b9F2e752cB93b7Cc8739176cd5", "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
  //   const cake_bnb_swap_tx = await nalaRouter.connect(owner).swapExactTokensForBNB(
  //     cakeTokenAddress, 
  //     ethers.utils.parseEther("50"),
  //     0,
  //   )
  //   console.log(cake_bnb_swap_tx);
  // })

  it('Should SWAP CAKE tokens for UNI tokens', async () => {
    const cakeToken = new ethers.Contract(cakeTokenAddress, ["function approve(address _spender, uint256 _value) public returns (bool success)"], owner)
    await cakeToken.connect(owner).approve("0x6574F3dea1EB56b9F2e752cB93b7Cc8739176cd5", "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
    const cake_uni_swap_tx = await nalaRouter.connect(owner).swapExactTokensForTokens(
      ethers.utils.parseEther("10000"),
      0,
      [cakeTokenAddress, "0xbf5140a22578168fd562dccf235e5d43a02ce9b1"]
    )
    console.log(cake_uni_swap_tx);
  })

})
