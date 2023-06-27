
async function main() {
    // Deploying the BasicDutchAuction contract
    const BasicDutchAuction = await ethers.getContractFactory("BasicDutchAuction");
    const basicDutchAuction = await BasicDutchAuction.deploy(100,50,1);
  
    await basicDutchAuction.deployed();
  
    console.log("BasicDutchAuction deployed to:", basicDutchAuction.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

// async function main() {
//   const [deployer] = await ethers.getSigners();

//   console.log("Deploying contracts with the account:", deployer.address);

//   const token = await ethers.deployContract("BasicDutchAuction");

//   console.log("Token address:", await token.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });