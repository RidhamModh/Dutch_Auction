# Dutch_Auction

This project asks you to build a decentralized application for a Dutch Auction. The project has multiple milestones, one due every week until the last class of the semester. Each milestone will build upon the work of previous milestones. As noted in the syllabus, you have seven late-days across all homeworks throughout the semester.

Each milestone is due on the date specified in the table below. Submit each completed milestone to canvas as a link to a GitHub repo and a tagged commit with the version #.

# Version 1.0

1. Create a new directory in your GitHub repo called v1.0 and initialize a new Hardhat project.
2. Create a new contract called BasicDutchAuction.sol that implements a Dutch auction as described below.
3. Write test cases to thoroughly test your contracts. Generate a Solidity coverage report and commit it to your repository.
  - reservePrice: the minimum amount of wei that the seller is willing to accept for the item.
  - numBlocksAuctionOpen: the number of blockchain blocks that the auction is open for.
  -   offerPriceDecrement: the amount of wei that the auction price should decrease by during each subsequent block.
  - The seller is the owner of the contract.
  - The auction begins at the block in which the contract is created.
  - The initial price of the item is derived from reservePrice, numBlocksAuctionOpen, and offerPriceDecrement: initialPrice = reservePrice + numBlocksAuctionOpen *     offerPriceDecrement.
  - A bid can be submitted by any Ethereum externally-owned account.
  - The first bid processed by the contract that sends wei greater than or equal to the current price is the winner. The wei should be transferred immediately to       the seller, and the contract should not accept any more bids. All bids besides the winning bid should be refunded immediately.
