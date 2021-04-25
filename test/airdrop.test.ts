import { network, ethers } from "hardhat";
import { expect } from "chai";

import { expectRevert } from "@openzeppelin/test-helpers";

describe("Airdrop", function () {
  let airdrop: any;
  let tokenContract: any;

  let owner;
  let u1;
  let u2;
  let others;

  let ERC20abi = [
    "function balanceOf(address) view returns (uint)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  before("should create a impersonate account", async function () {
    [owner, u1, u2, ...others] = await ethers.getSigners();
  });

  it("Should deploy airdrop and check balance", async function () {
    let Airdrop = await ethers.getContractFactory("Airdrop");
    airdrop = await Airdrop.deploy();

    await airdrop.deployed();

    let tokenAddress = await airdrop.token();

    tokenContract = new ethers.Contract(tokenAddress, ERC20abi, owner);

    expect(await tokenContract.balanceOf(airdrop.address)).to.equal(
      ethers.BigNumber.from(ethers.utils.parseEther("200000"))
    );
  });

  it("Should add an address for eligibility", async function () {
    await airdrop.setEligibilty(
      await u1.address,
      ethers.utils.parseEther("100")
    );
  });

  it("Should claim tokens from contract", async function () {
    await airdrop.connect(u1).claim();

    expect(await tokenContract.balanceOf(await u1.address)).to.equal(
      ethers.BigNumber.from(ethers.utils.parseEther("100"))
    );

    expect(await tokenContract.balanceOf(airdrop.address)).to.equal(
      ethers.BigNumber.from(ethers.utils.parseEther("199900"))
    );
  });

  it("should fail on claim again", async function () {
    await expectRevert.unspecified(airdrop.connect(u1).claim());
  });

  it("Should fail to claim from u2", async function () {
    await expectRevert.unspecified(airdrop.connect(u2).claim());
  });

  it("Should add an address for eligibility", async function () {
    await airdrop.setEligibilty(
      await u2.address,
      ethers.utils.parseEther("75")
    );
  });

  it("Should claim tokens from contract for u2", async function () {
    await airdrop.connect(u2).claim();

    expect(await tokenContract.balanceOf(await u2.address)).to.equal(
      ethers.BigNumber.from(ethers.utils.parseEther("75"))
    );

    expect(await tokenContract.balanceOf(airdrop.address)).to.equal(
      ethers.BigNumber.from(ethers.utils.parseEther("199825"))
    );
  });

  it("Should mint more tokens", async function () {
    await airdrop.mintLala(ethers.utils.parseEther("175"));

    expect(await tokenContract.balanceOf(airdrop.address)).to.equal(
      ethers.BigNumber.from(ethers.utils.parseEther("200000"))
    );
  });
});
