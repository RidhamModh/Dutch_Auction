import { ethers } from "hardhat";

const { expect, assert } = require("chai");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

const _reservePrice = 100;
const _numBlocksAuctionOpen = 50;
const _offerPriceDecrement = 1;

describe("BasicDutchAuction", function () {
  let basicDutchAuction;
  let seller;
  let bidder;

  beforeEach(async function () {
    const BasicDutchAuction = await ethers.getContractFactory("BasicDutchAuction");
    basicDutchAuction = await BasicDutchAuction.deploy(_reservePrice, _numBlocksAuctionOpen, _offerPriceDecrement);
    await basicDutchAuction.deployed();

    [seller, bidder] = await ethers.getSigners();
  });

  it("should allow a bid and transfer wei to the seller when bid is higher than current price", async function () {
    const reservePrice = await basicDutchAuction.reservePrice();
    const bidAmount = reservePrice.add(ethers.utils.parseEther("1"));

    const initialBalanceSeller = await ethers.provider.getBalance(seller.address);

    await expect(basicDutchAuction.connect(bidder).placeBid({ value: bidAmount }))
      .to.not.be.reverted;
  
    expect(await ethers.provider.getBalance(seller.address)).to.equal(initialBalanceSeller.add(bidAmount));
  });



  it("should revert the bid when bid is not higher than current price", async function () {
    const reservePrice = await basicDutchAuction.reservePrice();
    const initialPrice = await basicDutchAuction.initialPrice();
  
    const bidAmount = reservePrice.sub(ethers.utils.parseEther("0.01"));
  
    await expect(basicDutchAuction.connect(bidder).placeBid({ value: bidAmount }))
      .to.be.revertedWith("Bid amount is not higher than current price");
  });
  


  //UPDATED
  it("should revert the bid when the auction is not currently open", async function () {
    await mine(50);
    await expect(basicDutchAuction.connect(bidder).placeBid({ value: 1 }))
      .to.be.revertedWith("Auction is not currently open.");
  });
  
});
