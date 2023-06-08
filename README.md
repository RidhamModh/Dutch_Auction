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

# Version 2.0

1. Read the ERC721 EIP and OpenZeppelin implementation.
2. Create a new directory in your GitHub repo called v2.0 and initialize a new Hardhat project.
3. Copy over any files you can reuse from the previous versions of this project into the directory for this version.
4. Understand how the ERC721 contract works by downloading an off-the-shelf version from OpenZeppelin, and write test cases to understand how to create NFT contracts, how to mint NFTs, and how to transfer them. ERC721 is the official name for Ethereum's NFT contract specification.
5. To add contracts from OpenZeppelin into your project, definitely use npm to download them. The OpenZeppelin contracts have a lot of dependencies, and thus copying and pasting them will 1) take a lot of time, 2) make it hard to upgrade to newer versions, 3) increase the vulnerability scope of your project, and 4) make it more likely for those contracts to get changed by you or your team.
6. Create a new contract called NFTDutchAuction.sol. It should have the same functionality as BasicDutchAuction.sol but sells an NFT instead of a physical item. The constructor for the NFTDutchAuction.sol should be: constructor(address erc721TokenAddress, uint256 _nftTokenId, uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement)
7. Write test cases to thoroughly test your contracts. Generate a Solidity coverage report and commit it to your repository under this version's directory.
