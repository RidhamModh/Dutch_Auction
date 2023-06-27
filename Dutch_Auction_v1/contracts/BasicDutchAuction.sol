// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract BasicDutchAuction {
    address payable public seller;

    uint public reservePrice;
    uint public  numBlocksAuctionOpen;
    uint public  offerPriceDecrement;

    uint public initialPrice;
    uint public  startingBlock;
    uint public  endingBlock;

    bool public auctionEnded = false;
    address public highestBidder = address(0);

    uint public highestBid = 0;

    constructor(uint _reservePrice, uint _numBlocksAuctionOpen, uint _offerPriceDecrement) {
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        seller = payable(msg.sender);
        initialPrice = reservePrice + numBlocksAuctionOpen * offerPriceDecrement;
        startingBlock = block.number;
        endingBlock = startingBlock + numBlocksAuctionOpen;
    }

    function placeBid() public payable {
        require(block.number >= startingBlock && block.number <= endingBlock, "Auction is not currently open.");
        // require(msg.value >= reservePrice, "Bid amount is less than the minimum amount seller is willing to accept");

        uint currentPrice = initialPrice - ((block.number - startingBlock) * offerPriceDecrement);

        if (msg.value > currentPrice) {
            // Refund previous highest bidder if any

            // (bool refundedPreviousBidder, ) = payable(highestBidder).call{value: highestBid}("");
            // require(refundedPreviousBidder, "Failed to refund the previous highest bidder");
            
            highestBidder = msg.sender;
            highestBid = msg.value;
            auctionEnded = true;

            seller.transfer(highestBid);


            // (bool transferredBiddingAmount, ) = seller.call{value: highestBid}("");
            // require(transferredBiddingAmount, "The transfer to the seller has failed");
        }   
        else {
        // Revert the transaction
            revert("Bid amount is not higher than current price");
        } 
        // } else {
        //     // Refund the bid amount immediately
        //     uint256 refundAmount = msg.value;
        //     (bool refunded, ) = msg.sender.call{value: refundAmount}("");
        //     require(refunded, "Failed to refund the bid amount");
        // }
    }
}
