const {expect} = require("chai");
// const { ethers } = require("hardhat");z

 describe("TokenSwap", async()=>{
     let tokenA;
     let tokenB;
     let tokenSwap;
     let addr1;
     let owner;

    beforeEach(async ()=>{
        [owner, addr1] = await ethers.getSigners();
      
       const name1 = "AToken";
       tokenA = await ethers.deployContract(name1);
       await tokenA.waitForDeployment();
       
       console.log(`AToken deployed at ${tokenA.target}`);
  
       const name2 = "BToken";
       tokenB = await ethers.deployContract(name2);
       await tokenB.waitForDeployment();
       console.log(`BToken deployed at ${tokenB.target}`);
  
       const name3 = "TokenSwap";
       tokenSwap = await ethers.deployContract(name3,[tokenA.target,tokenB.target,]);
       await tokenSwap.waitForDeployment();
       
       console.log(`TokenSwap deployed at ${tokenSwap.target}`);
      //  console.log("testing", await tokenSwap.getAddress());`                        `                                                                                                                                                                                                                                                                                                                                                                                                                                                               ``                  qqqqqqqqqqqqqqqqqqqqqqqqqqqq`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       `````````````````````````````````````````````````````````                             ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````q`      q1  `````````qqqq
       await tokenA.transfer(tokenSwap.target, ethers.parseEther("50"));
       await tokenB.transfer(tokenSwap.target, ethers.parseEther("1000"));
      //  console.log("TokenA balance for tokenSwap contract:", ethers.formatEther(await tokenA.balanceOf(tokenSwap.target)));
      //  await tokenA.transfer(await addr1.getAddress(), ethers.parseEther("20"));
      });

      it("should initialize with correct values", async ()=> {
        
        expect(await tokenSwap.tokenA()).to.equal(tokenA.target);
        expect(await tokenSwap.tokenB()).to.equal(tokenB.target);
        expect(await tokenSwap.rate()).to.equal(100);
        expect(await tokenSwap.purchaseThreshold()).to.equal(10000);
        expect(await tokenSwap.rateIncreasePercentage()).to.equal(10);
        expect(await tokenSwap.initialBPrice()).to.equal(ethers.parseEther("0.01"));
      });

      it("should swap A to B correctly", async function () {
         
         await tokenA.connect(owner).approve(tokenSwap.target, ethers.parseEther("50"));
         await tokenB.connect(owner).approve(tokenSwap.target, ethers.parseEther("1000"));

         await tokenSwap.connect(owner).swapAToB(ethers.parseEther("5"));

         const balanceA = await tokenA.balanceOf(owner.address);
         const balanceB = await tokenB.balanceOf(owner.address);

         expect(balanceA).to.equal(ethers.parseEther("45"));
         expect(balanceB).to.equal(ethers.parseEther("9500"));
         console.log("tokenSwap balance", tokenB.balanceOf(tokenSwap.target));

      });
        
      it("should swap B to A correctly", async ()=>{
        
        await tokenA.connect(owner).approve(tokenSwap.target, ethers.parseEther("50"));
        await tokenB.connect(owner).approve(tokenSwap.target, ethers.parseEther("1000"));

        await tokenSwap.connect(owner).swapBToA(ethers.parseEther("200"));

        const balanceB = await tokenB.balanceOf(owner.address);
        const balanceA = await tokenA.balanceOf(owner.address);
        
        
        expect(balanceB).to.equal(ethers.parseEther("8800"));
        expect(balanceA).to.equal(ethers.parseEther("52"));
      });
               
  });