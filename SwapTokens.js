
const {expect} = require("chai");

describe("TokenSwap", ()=>{
  let tokenA;
  let tokenB;
  let tokenSwap;
  let owner;
  let addr1;

  beforeEach(async ()=>{
    [owner, addr1] = await ethers.getSigners();

    const name1 = "AToken"; 
    const tokenA = await ethers.deployContract(name1);
    await tokenA.waitForDeployment();
    console.log(`AToken deployed at ${tokenA.target}`);
  
     const name2 = "BToken";
     const tokenB = await ethers.deployContract(name2);
     await tokenB.waitForDeployment();
     console.log(`BToken deployed at ${tokenB.target}`);
  
     const name3 = "TokenSwap";
     const tokenSwap = await ethers.deployContract(name3,[tokenA.target,tokenB.target],{"":tokenA.address});
     await tokenSwap.waitForDeployment();
     console.log(`TokenSwap deployed at ${tokenSwap.target}`);
  });
 
    it("should initialize correctly", async () => {
      console.log("TokenA address:", tokenA.address);
      console.log("TokenB address:", tokenB.address);
      console.log("TokenSwap address:", tokenSwap.address);
  
      expect(await tokenSwap.tokenA()).to.equal(tokenA.target);
      expect(await tokenSwap.tokenB()).to.equal(tokenB.target);
    });
});