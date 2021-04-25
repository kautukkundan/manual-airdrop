//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { LalaToken } from "./LalaToken.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable {
  address public token;

  struct claims {
    uint256 amount;
    bool claimed;
  }

  mapping(address => claims) eligibilityAmount;

  constructor() {
    token = address(new LalaToken());
  }

  function setEligibilty(address _receiver, uint256 _amount)
    external
    onlyOwner
  {
    require(IERC20(token).balanceOf(address(this)) > 0, "insufficient funds");

    eligibilityAmount[_receiver].amount += _amount;
    eligibilityAmount[_receiver].claimed = false;
  }

  function claim() external {
    require(eligibilityAmount[msg.sender].amount > 0, "nothing to claim");
    require(eligibilityAmount[msg.sender].claimed == false, "already claimed");

    uint256 amountToTransfer = eligibilityAmount[msg.sender].amount;

    eligibilityAmount[msg.sender].amount = 0;
    eligibilityAmount[msg.sender].claimed = true;

    IERC20(token).transfer(msg.sender, amountToTransfer);
  }

  function mintLala(uint256 _amount) external onlyOwner {
    LalaToken(token).mint(_amount);
  }
}
