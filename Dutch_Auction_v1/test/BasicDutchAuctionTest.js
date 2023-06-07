const { expect, assert } = require("chai");

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

  it("should refund the bid when the bid is less than the reserve price", async function () {
    const reservePrice = await basicDutchAuction.reservePrice();
    const bidAmount = reservePrice.sub(ethers.utils.parseEther("1"));
  
    await expect(basicDutchAuction.connect(bidder).placeBid({ value: bidAmount }))
      .to.be.revertedWith("Bid amount is less than the minimum amount seller is willing to accept");
  
    const refundAmount = await ethers.provider.getBalance(bidder.address);
    expect(refundAmount).to.equal(bidAmount, "Bid amount was not refunded correctly");
  });
  

  it("should refund the previous highest bidder and transfer wei to the new highest bidder", async function () {
    const reservePrice = await basicDutchAuction.reservePrice();
    const bidAmount1 = reservePrice.add(ethers.utils.parseEther("1"));
    const bidAmount2 = bidAmount1.add(ethers.utils.parseEther("2"));

    await basicDutchAuction.connect(bidder).placeBid({ value: bidAmount1 });

    const initialBalanceBidder = await ethers.provider.getBalance(bidder.address);

    await expect(basicDutchAuction.connect(bidder).placeBid({ value: bidAmount2 }))
      .to.emit(basicDutchAuction, "BidPlaced")
      .withArgs(bidder.address, bidAmount2)
      .to.emit(basicDutchAuction, "BidRefunded")
      .withArgs(bidder.address, bidAmount1);

    expect(await ethers.provider.getBalance(seller.address)).to.equal(bidAmount2);
    expect(await ethers.provider.getBalance(bidder.address)).to.equal(initialBalanceBidder.add(bidAmount1));
  });
});
