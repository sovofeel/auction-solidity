const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuctionEngine", () => {
    let owner
    let seller
    let buyer
    let auction

    beforeEach(async function() {
      [owner, seller, buyer] = await ethers.getSigners();

      const AuctionEngine = await ethers.getContractFactory("AuctionEngine", owner);
      auction = await AuctionEngine.deploy()
      await auction.deployed();
    })

    it("> sets correct owner", async () => {
      const currentOwner = await auction.owner(); 
      expect(currentOwner).to.eq(owner.address)
    })

    describe("createAuction", () => {
      it("> creates auction correctly", async () => {
        const tx = await auction.createAuction(
          ethers.utils.parseEther("0.0001"),
          3,
          "mock item",
          60
        )

        const currentAuction =  await auction.auctions(0)
        expect(currentAuction.item).to.eq("mock item")
         
      });
    })
});
