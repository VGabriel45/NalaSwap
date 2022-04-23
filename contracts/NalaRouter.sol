pragma solidity >=0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

interface IPancakeRouter01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IPancakeRouter02 is IPancakeRouter01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract NalaRouter {

    IPancakeRouter02 public pancakeRouter;

    constructor (address _pancakeRouterAddress) {
        pancakeRouter = IPancakeRouter02(_pancakeRouterAddress);
    }

    event Transfer(address from, address to, uint value);

    function swapExactBNBForTokens(uint256 amountOutMin, address tokenOut) external payable { 
        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = tokenOut;
        IERC20(pancakeRouter.WETH()).approve(address(pancakeRouter), msg.value); 
        pancakeRouter.swapExactETHForTokens{value: msg.value}(amountOutMin, path, msg.sender, block.timestamp + 60*10);
        emit Transfer(msg.sender, address(this), amountOutMin);
    }

    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path) external { 
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
        IERC20(path[0]).approve(address(pancakeRouter), amountIn);
        console.log(IERC20(path[0]).balanceOf(address(this)));
        pancakeRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, msg.sender, block.timestamp + 60*10);
        console.log(IERC20(path[0]).balanceOf(address(this)));
        emit Transfer(msg.sender, address(this), amountOutMin);
    }

    function swapTokensForExactTokens(uint amountInMax, uint amountOut, address[] calldata path) external { 
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountInMax);
        IERC20(path[0]).approve(address(pancakeRouter), amountInMax);
        pancakeRouter.swapTokensForExactTokens(amountOut, amountInMax, path, msg.sender, block.timestamp + 60*10);
        IERC20(path[0]).transfer(msg.sender, IERC20(path[0]).balanceOf(address(this)));
        console.log(IERC20(path[0]).balanceOf(address(this)));
        emit Transfer(msg.sender, address(this), amountInMax);
    }

    function swapExactTokensForBNB(address token, uint amountIn, uint amountOutMin) external {
        IERC20(token).transferFrom(msg.sender, address(this), amountIn);
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = pancakeRouter.WETH();
        IERC20(token).approve(address(pancakeRouter), amountIn);
        pancakeRouter.swapExactTokensForETH(amountIn, amountOutMin, path, msg.sender, block.timestamp + 60*10);
        emit Transfer(msg.sender, address(this), amountIn);
    }

    function swapTokensForExactBNB(address token, uint amountInMax, uint amountOut) external {
        IERC20(token).transferFrom(msg.sender, address(this), amountInMax);
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = pancakeRouter.WETH();
        IERC20(token).approve(address(pancakeRouter), amountInMax);
        pancakeRouter.swapTokensForExactETH(amountOut, amountInMax, path, msg.sender, block.timestamp + 60*10);
        IERC20(path[0]).transfer(msg.sender, IERC20(path[0]).balanceOf(address(this)));
        emit Transfer(msg.sender, address(this), amountInMax);
    }

    function swapBNBForExactTokens(uint amountOut, address tokenOut) external payable {
        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = tokenOut;
        IERC20(pancakeRouter.WETH()).approve(address(pancakeRouter), msg.value);
        pancakeRouter.swapETHForExactTokens{value: msg.value}(amountOut, path, msg.sender, block.timestamp + 60*10);
        payable(msg.sender).transfer(address(this).balance);
        emit Transfer(msg.sender, address(this), msg.value);
    }

    receive() external payable {}

}   