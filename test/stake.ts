const { ethers } = require("hardhat");
const { expect } = require("chai");
const NalaTokenAbi = require("./ABIS/nalaTokenABI.json");
import {Contract, Signer, BigNumber} from "ethers";
import { formatUnits } from '@ethersproject/units';

const mineNBlocks = async (n: number) => {
    for (let index = 0; index < n; index++) {
        await ethers.provider.send('evm_mine');
    }
}

describe("NalaRouter testing", function () {

    //variables
    let stakingContract: Contract;
    let nalaToken: Contract;
    let owner: Signer;
    let alice: Signer;
    let bob: Signer;

    beforeEach("deploy contract before each test", async () => {
        const accounts = await ethers.getSigners();
        owner = accounts[0];
        alice = accounts[0];
        bob = accounts[0];

        // nalaToken = new ethers.Contract(nalaTokenAddress, NalaTokenAbi, owner);
        // console.log(`NalaToken address: ${nalaToken.address}`);

        const NalaTokenContract = await ethers.getContractFactory("NalaToken", owner);
        nalaToken = await NalaTokenContract.deploy("NalaToken", "NLA");
        await nalaToken.deployed();
        console.log(`NalaToken contract deployed with address: ${nalaToken.address}`);

        const StakerContract = await ethers.getContractFactory("Staking", owner);
        stakingContract = await StakerContract.deploy(nalaToken.address, nalaToken.address);
        await stakingContract.deployed();
        console.log("Staking contract deployed");

        nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        const tx = await nalaToken.connect(owner).transfer(stakingContract.address, ethers.utils.parseEther("500000"));
        console.log(tx);
        console.log(`Staking contract balance: ${await nalaToken.balanceOf(stakingContract.address)}`);
    })

    // it('Should return balance of owner', async () => {
    //     const balance = await nalaToken.balanceOf(owner.getAddress());
    //     console.log(balance);
    // });

    // it('Should return false if address is not stakeholder', async () => {
    //     const response = await stakingContract.isStakeholder(owner.getAddress());
    //     console.log(response[0]);
    // });
    
    // it('Should stake tokens without reverting', async () => {
    //     await nalaToken.approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    //     const tx = await stakingContract.stakeTokens(ethers.utils.parseEther("100"));
    //     console.log(tx);
    //     const isStakeholder = await stakingContract.isStakeholder(owner.getAddress());
    //     const stakerBalance = await stakingContract.stakerBalance(owner.getAddress());
    //     console.log(isStakeholder[0]);
    //     console.log(stakerBalance);
    // });

    // it('Should withdaw tokens without reverting and get rewards by time passed', async () => {

    //     console.log(`Balance before staking: ${await nalaToken.balanceOf(owner.getAddress())}`);
    //     await nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    //     const tx1 = await stakingContract.connect(owner).stakeTokens(ethers.utils.parseEther("100"));
    //     const isStakeholder1 = await stakingContract.isStakeholder(owner.getAddress());
    //     const stakerBalance1 = await stakingContract.stakerBalance(owner.getAddress());

    //     for (let index = 0; index < 500; index++) {
    //         await ethers.provider.send('evm_mine');
    //     }

    //     const tx2 = await stakingContract.connect(owner).withdrawTokens(ethers.utils.parseEther("100"));
    //     console.log(tx2);
    //     const isStakeholder2 = await stakingContract.isStakeholder(owner.getAddress());
    //     const stakerBalance2 = await stakingContract.stakerBalance(owner.getAddress());
    //     console.log(isStakeholder2[0]);
    //     console.log(stakerBalance2);
    // });

    // it('Should withdaw tokens without reverting and get rewards by time passed', async () => {

    //     console.log(`Balance before staking: ${await nalaToken.balanceOf(owner.getAddress())}`);
    //     await nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    //     await stakingContract.connect(owner).stakeTokens(ethers.utils.parseEther("100"));
    //     console.log(`Balance 1: ${await stakingContract.stakerBalance(owner.getAddress())}`);

    //     await nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    //     await stakingContract.connect(owner).stakeTokens(ethers.utils.parseEther("100"));
    //     console.log(`Balance 2: ${await stakingContract.stakerBalance(owner.getAddress())}`);

    //     await nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    //     await stakingContract.connect(owner).stakeTokens(ethers.utils.parseEther("100"));
    //     console.log(`Balance 3: ${await stakingContract.stakerBalance(owner.getAddress())}`);

    //     console.log(`Current stakes: ${await stakingContract.userCurrentStakes(owner.getAddress())}`);

    //     for (let index = 0; index < 500; index++) {
    //         await ethers.provider.send('evm_mine');
    //     }

    //     const withdrawAll_Tx = await stakingContract.connect(owner).withdrawAllTokens();
    //     console.log(withdrawAll_Tx);
    //     const stakerBalance2 = await stakingContract.stakerBalance(owner.getAddress());
    //     console.log(stakerBalance2);
    // });

    // it('Should revert if user tries to stake 0 or less tokens', async () => {
    //     await nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    //     const tx = await stakingContract.connect(owner).stakeTokens(ethers.utils.parseEther("0"));
    // });

    it('Should get rewards per day for a staker', async () => {
        console.log(`Balance before staking: ${await nalaToken.balanceOf(owner.getAddress())}`);
        await nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        await stakingContract.connect(owner).stakeTokens(ethers.utils.parseEther("5000"));
        console.log(`Balance 1: ${formatUnits(BigNumber.from(await stakingContract.stakerBalance(owner.getAddress())))}`);

        for (let index = 0; index < 3000; index++) {
            await ethers.provider.send('evm_mine');
        }

        const rewards = await stakingContract.connect(owner).getRewardsPerDay(owner.getAddress());
        console.log(`Rewards per day ${formatUnits(BigNumber.from(rewards.toString()), 18)}`);

        const balance = await stakingContract.connect(owner).getBalanceWithRewards(owner.getAddress());
        console.log(`Balance with rewards after 3 days ${formatUnits(BigNumber.from(balance.toString()), 18)}`);
        
    });

    it('Should get staked amount + rewards balance', async () => {
        console.log(`Balance before staking: ${await nalaToken.balanceOf(owner.getAddress())}`);
        await nalaToken.connect(owner).approve(stakingContract.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        await stakingContract.connect(owner).stakeTokens(ethers.utils.parseEther("5000"));
        console.log(`Balance 1: ${await stakingContract.stakerBalance(owner.getAddress())}`);

        for (let index = 0; index < 3000; index++) {
            await ethers.provider.send('evm_mine');
        }

        const balance = await stakingContract.connect(owner).getBalanceWithRewards(owner.getAddress());
        console.log(`Balance with rewards after 3 days ${formatUnits(BigNumber.from(balance.toString()), 18)}`);
        
    });
})
