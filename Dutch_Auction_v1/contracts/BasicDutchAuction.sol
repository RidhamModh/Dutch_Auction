// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract BasicDutchAuction {
    address payable public seller;

    uint256 public immutable reservePrice = 1 ether;
    uint256 public immutable numBlocksAuctionOpen = 30;
    uint256 public immutable offerPriceDecrement = 0.01 ether;

    uint256 public initialPrice;
    uint256 public immutable startingBlock;
    uint256 public immutable endingBlock;

    bool public auctionEnded = false;
    address public highestBidder = address(0);

    uint256 public highestBid = 0;

    constructor() {
        seller = payable(msg.sender);
        initialPrice = reservePrice + numBlocksAuctionOpen * offerPriceDecrement;
        startingBlock = block.number;
        endingBlock = startingBlock + numBlocksAuctionOpen;
    }

    function placeBid() public payable {
        require(block.number >= startingBlock && block.number <= endingBlock, "Auction is not currently open.");
        require(msg.value >= reservePrice, "Bid amount is less than the minimum amount seller is willing to accept");

        uint256 currentPrice = initialPrice - ((block.number - startingBlock) * offerPriceDecrement);

        if (msg.value > currentPrice) {
            // Refund previous highest bidder if any
            if (highestBidder != address(0)) {
                (bool refundedPreviousBidder, ) = payable(highestBidder).call{value: highestBid}("");
                require(refundedPreviousBidder, "Failed to refund the previous highest bidder");
            }

            highestBidder = msg.sender;
            highestBid = msg.value;
            auctionEnded = true;

            (bool transferredBiddingAmount, ) = seller.call{value: highestBid, gas: 230000}("");
            require(transferredBiddingAmount, "The transfer to the seller has failed");
        } else {
            // Refund the bid amount immediately
            uint256 refundAmount = msg.value;
            (bool refunded, ) = msg.sender.call{value: refundAmount}("");
            require(refunded, "Failed to refund the bid amount");
        }
    }
}
