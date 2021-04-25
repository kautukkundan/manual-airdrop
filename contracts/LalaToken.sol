//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract LalaToken is ERC20, Ownable {
  constructor() ERC20("Lala Tokens", "LALA") {
    _mint(msg.sender, 200000 ether);
  }

  function mint(uint256 _amount) external onlyOwner {
    _mint(owner(), _amount);
  }
}
