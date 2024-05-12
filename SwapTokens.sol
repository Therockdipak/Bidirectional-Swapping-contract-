// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenSwap is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public rate = 100;  // 1A = 100B
    uint256 public purchaseCount;
    uint256 public purchaseThreshold = 10000;
    uint256 public rateIncreasePercentage = 10;
    uint256 public initialBPrice = 0.01 ether; // Initial price of B token

    event TokensSwapped(address indexed buyer, uint256 amountA, uint256 amountB);
    event tokenSwapped(address indexed buyer, uint256 amountB, uint256 amountA);

    constructor(IERC20 _tokenA, IERC20 _tokenB) Ownable(msg.sender) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function swapAToB(uint256 _amountA) external nonReentrant {
        uint256 amountB = _amountA * rate;
        require(tokenA.balanceOf(msg.sender) >= _amountA, "Insufficient TokenA balance");
        require(tokenB.balanceOf(address(this)) >= amountB, "Not enough tokens in contract");

        tokenA.safeTransferFrom(msg.sender, address(this), _amountA);
        tokenB.safeTransfer(msg.sender, amountB);

        emit TokensSwapped(msg.sender, _amountA, amountB);

        updateRates(amountB);
    }

    function swapBToA(uint256 _amountB) external nonReentrant {
        uint256 amountA = _amountB / rate;
        require(tokenB.balanceOf(msg.sender) >= _amountB, "Insufficient TokenB balance");
        require(tokenA.balanceOf(address(this)) >= amountA, "Not enough tokens in contract");

        tokenB.safeTransferFrom(msg.sender, address(this), _amountB);
        tokenA.safeTransfer(msg.sender, amountA);

        emit tokenSwapped(msg.sender, _amountB, amountA);

        updateRates(_amountB);
    }

    function updateRates(uint256 _amount) internal {
        purchaseCount += _amount;
        if (purchaseCount >= purchaseThreshold) {
            rate = rate + (rate * rateIncreasePercentage / 100);
            purchaseCount = 0;
            initialBPrice = initialBPrice + (initialBPrice * rateIncreasePercentage / 100);
        }
    }

    function withdrawTokenA(uint256 _amount) external onlyOwner {
        tokenA.safeTransfer(msg.sender, _amount);
    }

    function withdrawTokenB(uint256 _amount) external onlyOwner {
        tokenB.safeTransfer(msg.sender, _amount);
    }

    function setPurchaseThreshold(uint256 _threshold) external onlyOwner {
        purchaseThreshold = _threshold;
    }

    function setRateIncreasePercentage(uint256 _percentage) external onlyOwner {
        rateIncreasePercentage = _percentage;
    }
}
