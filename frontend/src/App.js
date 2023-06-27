import React, { useState } from 'react';
// import { providers } from 'ethers';
// import { ethers } from 'ethers';
// import AuctionArtifact from '/Users/ridham/Desktop/Dutch_Auction_v6/frontend/src/artifacts/BasicDutchAuction.json';
import AuctionArtifact from './artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json';
import './App.css';

const { ethers } = require('ethers');
// const { Web3Provider } = require('ethers/providers/web3');

const App = () => {
  const [reservePrice, setReservePrice] = useState('');
  const [numBlocksAuctionOpen, setNumBlocksAuctionOpen] = useState('');
  const [offerPriceDecrement, setOfferPriceDecrement] = useState('');
  const [deployedContractAddress, setDeployedContractAddress] = useState('');
  const [lookupContractAddress, setLookupContractAddress] = useState('');
  const [lookupContractDetails, setAuctionInfo] = useState(null);
  const [bidContractAddress, setBidContractAddress] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidResult, setBidResult] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('User denied account access:', error);
      }
    } else {
      alert('Please install MetaMask to use this app!');
    }
  };

  const deployAuction = async () => {
    try {
      await connectWallet();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(
        AuctionArtifact.abi,
        AuctionArtifact.bytecode,
        signer
      );
      const contract = await factory.deploy(
        ethers.utils.parseEther(reservePrice),
        numBlocksAuctionOpen,
        ethers.utils.parseEther(offerPriceDecrement)
      );
      await contract.deployed();
      setDeployedContractAddress(contract.address);
    } catch (error) {
      console.error('Error deploying auction:', error);
    }
  };

  const handleShowInfo = async () => {
    try {
      await connectWallet();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const provider = new Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        lookupContractAddress,
        AuctionArtifact.abi,
        provider
      );

      
      const numBlocksAuctionOpen = await contract.numBlocksAuctionOpen();
      const reservePrice = await contract.reservePrice();
      console.log("ReserveP", reservePrice);
      const offerPriceDecrement = await contract.offerPriceDecrement();
      const minimumBidPrice = await contract.initialPrice();
      const auctionStatus = await contract.auctionEnded();
      const buyerAddr = await contract.highestBidder();

      setAuctionInfo({
        reservePrice: reservePrice.toString(),
        numBlocksAuctionOpen: numBlocksAuctionOpen.toString(),
        offerPriceDecrement: offerPriceDecrement.toString(),
        minimumBidPrice: ethers.utils.formatEther(minimumBidPrice),
        auctionStatus: auctionStatus ? 'Ended' : 'Ongoing',
        winner: buyerAddr === ethers.constants.AddressZero ? 'No winner yet' : buyerAddr,
      });
    } catch (error) {
      console.error('Error fetching contract details:', error);
      setAuctionInfo(null);
    }
  };

  const handleBid = async () => {
    try {
      await connectWallet();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        bidContractAddress,
        AuctionArtifact.abi,
        signer
      );
      // const bidTx = await contract.placeBid({ value: ethers.utils.parseEther(bidAmount) });
      // await bidTx.wait();
      // setBidResult('Bid accepted as the winner');

        // Place a bid
        const bid = ethers.utils.parseEther(bidAmount); // Convert bid amount to wei
        const transaction = await contract.placeBid({ value: bid });
  
        // Wait for the transaction to be mined
        await transaction.wait();
  
        // Set the bidResult state
        setBidResult('Bid accepted as the winner.');
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidResult('Bid not accepted.');
    }
  };

  return (
    <div className="App">
      <section>
        <h2>Deployment</h2>
        <input
          type="text"
          value={reservePrice}
          onChange={(e) => setReservePrice(e.target.value)}
          placeholder="Reserve Price (ETH)"
        />
        <input
          type="number"
          value={numBlocksAuctionOpen}
          onChange={(e) => setNumBlocksAuctionOpen(e.target.value)}
          placeholder="Number of Blocks"
        />
        <input
          type="text"
          value={offerPriceDecrement}
          onChange={(e) => setOfferPriceDecrement(e.target.value)}
          placeholder="Price Decrement (ETH)"
        />
        <button onClick={deployAuction}>Deploy</button>
        {deployedContractAddress && (
          <div>Contract Address: {deployedContractAddress}</div>
        )}
      </section>

      <section>
        <h2>Look up info on an auction</h2>
        <input
          type="text"
          value={lookupContractAddress}
          onChange={(e) => setLookupContractAddress(e.target.value)}
          placeholder="Contract Address"
        />
        <button onClick={handleShowInfo}>Show Info</button>
        <div>
          {lookupContractDetails ? (
            <div>
              <p>Reserve Price: {lookupContractDetails.reservePrice}</p>
              <p>Number of Blocks: {lookupContractDetails.numBlocksAuctionOpen}</p>
              <p>Price Decrement: {lookupContractDetails.offerPriceDecrement}</p>
              <p>Current Minimum bid to win:{' '}{lookupContractDetails.minimumBidPrice} ETH</p>
              <p>Auction Status: {lookupContractDetails.auctionStatus}</p>
              <p>Winner: {lookupContractDetails.winner}</p>
              </div>
            ) : (
            "Details not found"
          )}
        </div>
      </section>

      <section>
        <h2>Submit a bid</h2>
        <input
          type="text"
          value={bidContractAddress}
          onChange={(e) => setBidContractAddress(e.target.value)}
          placeholder="Contract Address"
        />
        <input
          type="text"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Bid Amount (ETH)"
        />
        <button onClick={handleBid}>Bid</button>
        {bidResult && <div>{bidResult}</div>}
      </section>
    </div>
  );
};

export default App;
