// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract NFTDutchAuction is IERC721Receiver, ERC721Holder {
    address public auctioneer;
    address public erc721TokenAddress;
    uint256 public nftTokenId;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;

    uint256 public auctionEndTime;
    bool public auctionEnded;
    address public highestBidder;
    uint256 public highestBid;

    constructor(
        address _auctioneer,
        address _erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) {
        auctioneer = _auctioneer;
        erc721TokenAddress = _erc721TokenAddress;
        nftTokenId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
    }

    function startAuction() external {
        require(
            msg.sender == auctioneer,
            "Only auctioneer can start the auction"
        );
        require(
            auctionEndTime == 0,
            "Auction has already started"
        );

        auctionEndTime = block.number + numBlocksAuctionOpen;
    }

    function placeBid() external payable {
        require(!auctionEnded, "Auction has already ended");
        require(
            msg.value > highestBid,
            "The bid amount is too low"
        );
        require(
            block.number <= auctionEndTime,
            "Auction has already ended"
        );

        if (highestBid > 0) {
            // Refund the previous highest bidder
            (bool success, ) = highestBidder.call{value: highestBid}("");
            require(success, "Failed to refund previous highest bidder");
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function endAuction() external {
        require(!auctionEnded, "Auction has already ended");
        require(
            block.number > auctionEndTime || highestBid >= reservePrice,
            "Auction is still ongoing or reserve price not met"
        );

        auctionEnded = true;

        if (highestBid > 0) {
            IERC721(erc721TokenAddress).safeTransferFrom(
                address(this),
                highestBidder,
                nftTokenId
            );
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external view override returns (bytes4) {
        require(
            tokenId == nftTokenId && from == auctioneer,
            "Invalid ERC721 token received"
        );
        return this.onERC721Received.selector;
    }
}
