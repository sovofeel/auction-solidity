const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuctionEngine", function () {
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

    it("sets owner", async () => {
      const currentOwner = await auction.owner();
      expect(currentOwner).to.eq(owner.address)
    })
});
