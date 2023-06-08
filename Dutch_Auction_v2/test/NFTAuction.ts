import { ethers } from 'hardhat';
import { expect } from 'chai';
// import erc721ABI from '../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json';

describe("NFTDutchAuction", () => {
  let auction;
  let erc721;

  beforeEach(async () => {
    const NFTDutchAuction = await ethers.getContractFactory("NFTDutchAuction");
    auction = await NFTDutchAuction.deploy();
    await auction.deployed();

    const erc721Address = // Set the address of your ERC721 contract here
    erc721 = new ethers.Contract(erc721Address, erc721ABI, ethers.provider.getSigner());
  });

  it("should start the auction", async () => {
    await auction.startAuction();

    const auctionEndTime = await auction.auctionEndTime();
    expect(auctionEndTime).to.not.equal(0);
  });

  it("should place a higher bid", async () => {
    await auction.startAuction();

    const initialHighestBid = await auction.highestBid();

    await auction.placeBid({ value: initialHighestBid + 1 });

    const newHighestBid = await auction.highestBid();
    expect(newHighestBid).to.equal(initialHighestBid + 1);
  });

  it("should end the auction and transfer the NFT to the highest bidder", async () => {
    const reservePrice = 100;
    const numBlocksAuctionOpen = 10;

    await auction.startAuction();

    const initialHighestBid = await auction.highestBid();

    // Place a bid higher than the reserve price
    await auction.placeBid({ value: reservePrice + 1 });

    const auctionEnded = await auction.auctionEnded();
    expect(auctionEnded).to.equal(true);

    const nftOwnerBefore = await erc721.ownerOf(auction.nftTokenId);

    await auction.endAuction();

    const nftOwnerAfter = await erc721.ownerOf(auction.nftTokenId);
    const highestBidder = await auction.highestBidder();

    expect(nftOwnerBefore).to.equal(auction.address);
    expect(nftOwnerAfter).to.equal(highestBidder);
  });

  // Add more test cases here

});
