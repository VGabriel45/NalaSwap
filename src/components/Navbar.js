import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

import logo from "../logo.svg";

import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

const pages = ['Swap', 'Stake', 'About'];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [errorMessage, setErrorMessage] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", accountsChanged);
            window.ethereum.on("chainChanged", chainChanged);
        }
    },[]);

    const connectHandler = async () => {
        if (window.ethereum) {
          try {
            const res = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            await accountsChanged(res[0]);
          } catch (err) {
            console.error(err);
            setErrorMessage("There was a problem connecting to MetaMask");
          }
        } else {
          setErrorMessage("Install MetaMask");
        }
    };
    
    const accountsChanged = async (newAccount) => {
        setAccount(newAccount);
        try {
            const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [newAccount.toString(), "latest"],
            });
            setBalance(ethers.utils.formatEther(balance));
        } catch (err) {
            console.error(err);
            setErrorMessage("There was a problem connecting to MetaMask");
        }
    };

    const chainChanged = () => {
        setErrorMessage(null);
        setAccount(null);
        setBalance(null);
    };

  const handlePageChange = () => {
    setAnchorElNav(null);
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                >
                    <img style={{width: "50px", height:"50px", margin:"0px", padding:"0px"}} src={logo} className="App-logo" alt="logo" />
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={()=> navigate(page.toLowerCase())}
                            sx={{ my: 1, color: 'yellow', display: 'block' }}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
                <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                    <Tooltip title="Connect to metamask">
                    <IconButton onClick={connectHandler} sx={{ p: 0 }}>
                        <img style={{width: "50px", height:"50px", margin:"0px", padding:"0px"}} src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"} className="App-logo" alt="logo" />
                    </IconButton>
                    </Tooltip>
                    {account !== null ? 
                        <Typography
                        variant="small"
                        noWrap
                        component="div"
                        sx={{ my: 2, ml: 1, display: 'block' }}
                        >
                            {`${account.substr(0,5)}...${account.substr(account.length - 5, account.length)}`}
                        </Typography>
                    : ""}
                </Box>
                </Toolbar>
            </Container>
            </AppBar>
        </ThemeProvider>
    </Stack>
  );
};
export default ResponsiveAppBar;
