// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers} = require("hardhat");

async function main() {
  const name1 = "AToken"; 
  const contract = await ethers.deployContract(name1);
  await contract.waitForDeployment();
  console.log(`AToken deployed at ${contract.target}`);

   const name2 = "BToken";
   const contract2 = await ethers.deployContract(name2);
   await contract2.waitForDeployment();
   console.log(`BToken deployed at ${contract2.target}`);

   const name3 = "TokenSwap";
   const contract3 = await ethers.deployContract(name3,[contract.target,contract2.target],{"":contract.address});
   await contract3.waitForDeployment();
   console.log(`TokenSwap deployed at ${contract3.target}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});  
