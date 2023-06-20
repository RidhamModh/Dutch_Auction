const { expect, assert } = require("chai");
const { loadFixture, mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("BasicDutchAuction", function () {
  let basicDutchAuction;
  let seller;
  let bidder;

  beforeEach(async function () {
    const BasicDutchAuction = await ethers.getContractFactory("BasicDutchAuction");
    basicDutchAuction = await BasicDutchAuction.deploy();
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
  
  
  
  
  
  

  
  
  // it("should revert the bid when the auction is not currently open", async function () {
  //   const startingBlock = await basicDutchAuction.startingBlock();
  //   const endingBlock = await basicDutchAuction.endingBlock();
  
  //   // Move the current block number to a block after the auction has ended
  //   await ethers.provider.send("evm_mine", [endingBlock.toNumber() + 1]);
  
  //   const reservePrice = await basicDutchAuction.reservePrice();
  //   const bidAmount = reservePrice.add(ethers.utils.parseEther("1"));
  
  //   await expect(basicDutchAuction.connect(bidder).placeBid({ value: bidAmount }))
  //     .to.be.revertedWith("Auction is not currently open.");
  
  //   const refundAmount = await ethers.provider.getBalance(bidder.address);
  //   expect(refundAmount).to.equal(bidAmount, "Bid amount was not refunded correctly");
  // });
  
  //UPDATED
  it("should revert the bid when the auction is not currently open", async function () {
    await mine(50);
    await expect(basicDutchAuction.connect(bidder).placeBid({ value: 1 }))
      .to.be.revertedWith("Auction is not currently open.");
  });
  
});
