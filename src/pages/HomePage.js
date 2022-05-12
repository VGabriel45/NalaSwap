import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import {useEffect, useState, Fragment} from "react";
import { BigNumber, Contract, ethers, utils } from 'ethers';
import NalaRouterAbi from "../ABIS/NalaRouter.json"
import {tokens} from "../utils/availableTokens";
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from '@mui/material/Tooltip';
import { formatUnits } from '@ethersproject/units';
import CircularProgress from '@mui/material/CircularProgress';

export default function HomePage () {

    const [tokenIn, setTokenIn] = useState(tokens[0]);
    const [tokenOut, setTokenOut] = useState(tokens[1]);

    const [amountIn, setAmountIn] = useState(0);
    const [amountOut, setAmountOut] = useState(0);

    const [tokenInBalance, setTokenInBalance] = useState(0);
    const [tokenOutBalance, setTokenOutBalance] = useState(0);

    const [loadingTransaction, setLoadingTransaction] = useState(false);

    const contractAddress = "0xd9d972d687Bc511D833fe2550C456fEC1a857D2C";

    useEffect(() => {
        const getBalances = async () => {
            setTokenInBalance(await getTokenBalance(tokenIn.address));
            setTokenOutBalance(await getTokenBalance(tokenOut.address));
        }
       getBalances();
    },[]);

    const swapExactTokensForBNB = async (tokenIn, amountIn, signer, nalaRouter) => {
        setLoadingTransaction(true);
        try {
            const tokenInContract = new ethers.Contract(tokenIn.address, ["function approve(address _spender, uint256 _value) public returns (bool success)"], signer)
            await tokenInContract.connect(signer).approve(contractAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            const tx = await nalaRouter.connect(signer).swapExactTokensForBNB(
                tokenIn.address, 
                ethers.utils.parseEther(amountIn.toString()),
                0,
            )
            tx.wait();
            setLoadingTransaction(false);
        } catch (error) {
            console.log("Transaction error");
            setLoadingTransaction(false);
        }
    }

    const swapExactBNBForTokens = async (tokenOut, amountIn, signer, nalaRouter) => {
        setLoadingTransaction(true);
        try {
            const tx = await nalaRouter
                .connect(signer)
                .swapExactBNBForTokens(
                    0, 
                    tokenOut.address, 
                    { value: ethers.utils.parseEther(amountIn)}
                );
            tx.wait();
            setLoadingTransaction(false);
        } catch (error) {
            console.log("Transaction error");
            setLoadingTransaction(false);
        }
        
    }

    const swapExactTokensForTokens = async (tokenIn, tokenOut, amountIn, signer, nalaRouter) => {
        setLoadingTransaction(true);
        try {
            const tokenInContract = new ethers.Contract(tokenIn.address, ["function approve(address _spender, uint256 _value) public returns (bool success)"], signer)
            await tokenInContract.connect(signer).approve(contractAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            const tx = await nalaRouter.connect(signer).swapExactTokensForTokens(
                ethers.utils.parseEther(amountIn.toString()),
                0,
                [tokenIn.address, tokenOut.address]
            )
            tx.wait();
            setLoadingTransaction(false);
        } catch (error) {
            console.log("Transaction error");
            setLoadingTransaction(false);
        }
    }

    const swapTokens = async (tokenIn, tokenOut, amountIn, amountOut) => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            console.log(signer);
            if (signer) {
              const contract = new ethers.Contract(contractAddress, NalaRouterAbi, signer)
              if(tokenIn.label === "BNB") {
                swapExactBNBForTokens(tokenOut, amountIn, signer, contract);
              } else if (tokenOut.label === "BNB") {
                swapExactTokensForBNB(tokenIn, amountIn, signer, contract);
              } else {
                swapExactTokensForTokens(tokenIn, tokenOut, amountIn, signer, contract);
              }
            }
        }
    }

    const switchTokenOrder = () => {
        setTokenIn(tokenOut);
        setTokenOut(tokenIn);
    }

    const getTokenBalance = async (tokenAddress) => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            if (signer) {
                const tokenInContract = new ethers.Contract(tokenAddress, ["function balanceOf(address) public view returns (uint256)"], signer);
                const balance = await tokenInContract.balanceOf(signer.getAddress());
                return formatUnits(BigNumber.from(balance.toString(), 18));
            }
        }
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch'},
                }}
                noValidate
                autoComplete="off"
                style={{borderRadius:"10px", border:"2px solid #502199", marginBottom:"5%"}}
                >
                <Autocomplete
                    disablePortal
                    id="selectBox1"
                    options={tokens.filter(token => token.address !== tokenOut.address)}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label={`Balance: ${tokenInBalance}`} /> }
                    style={{border:"1px solid #502199", borderRadius: "10px"}}
                    value={tokenIn.label ? tokenIn.label : "BNB"}
                    onChange={(event, newValue) => {
                        if(newValue.address !== tokenOut.address) {
                            setTokenIn(newValue);
                            setTokenInBalance(getTokenBalance(newValue.address));
                            console.log(tokenInBalance);
                        } 
                    }}
                />
                <TextField 
                    id="amountIn" 
                    type="number" 
                    placeholder="0.0" 
                    variant="outlined" 
                    value={amountIn}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={tokenIn.image ? tokenIn.image : "https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png"} style={{width:"25px"}}/>
                          </InputAdornment>
                        ),
                      }}
                    onChange={async (e) => {
                        if (typeof window.ethereum !== 'undefined') {
                            const provider = new ethers.providers.Web3Provider(window.ethereum)
                            const signer = provider.getSigner();
                            if (signer) {
                                const tokenInContract = new ethers.Contract("0x10ED43C718714eb63d5aA57B78B54704E256024E", ["function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"], signer);
                                setAmountIn(e.target.value);
                                    const tokenOutAmount = await tokenInContract
                                        .getAmountsOut(
                                            ethers.utils.parseEther(amountIn.toString()), 
                                            [tokenIn.address, tokenOut.address]
                                        )
                                    setAmountOut(formatUnits(BigNumber.from(tokenOutAmount[1].toString(), 18)))
                            }
                        }
                    }}
                />
                <div>
                <Tooltip title="Switch token order"> 
                    <Button onClick={() => switchTokenOrder()} variant="text"><RefreshIcon sx={{ color:"#FFEF00"}}/></Button>
                </Tooltip>
                </div>
                <Autocomplete
                    disablePortal
                    id="selectBox2"
                    options={tokens.filter(token => token.address !== tokenIn.address)}
                    sx={{ width: "80%" }}
                    renderInput={(params) => <TextField {...params} label={`Balance: ${tokenOutBalance}`} />}
                    style={{border:"1px solid #502199", borderRadius: "10px"}}
                    value={tokenOut.label ? tokenOut.label : "BANANA"}
                    onChange={(event, newValue) => {
                        if(newValue.address !== tokenIn.address) {
                            setTokenOut(newValue);
                            setTokenOutBalance(getTokenBalance(newValue.address));
                            console.log(tokenOutBalance);
                        } 
                    }}
                />
                <TextField 
                    id="amountOut" 
                    type="number" 
                    placeholder="0.0" 
                    variant="outlined" 
                    value={amountOut}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={tokenOut.image ? tokenOut.image : "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95/logo.png"} style={{width:"25px"}}/>
                          </InputAdornment>
                        ),
                      }}
                    onChange={(event, newValue) => {
                        setAmountOut(e.target.value);
                    }}
                />
            </Box>
            <Button 
                onClick={() => swapTokens(tokenIn, tokenOut, amountIn, amountOut)} 
                variant="contained" 
                style={{background: "black", width: "100%", color: "#e3d476"}}
            >
                {loadingTransaction ? <CircularProgress sx={{color:"yellow"}}/> : "Swap tokens"}
            </Button>
        </>
        
    )

}