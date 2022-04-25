const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getTmeStamp, delay } = require("./helpers")

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
        const duration = 60
        const tx = await auction.createAuction(
          ethers.utils.parseEther("0.0001"),
          3,
          "mock item",
          duration
        )

        const currentAuction =  await auction.auctions(0)
        expect(currentAuction.item).to.eq("mock item") 
         

        const ts = await getTmeStamp(tx.blocknumber)
        expect(currentAuction.endsAt).to.eq(ts + duration)
      });
    })



    describe("buy", () => {
      it("> allows to buy" , async function()  {
        await auction.connect(seller).createAuction(
          ethers.utils.parseEther("0.0001"),
          3,
          "mock item",
          60
          )

          this.timeout(5000)
          await delay(1000)

          const buyTx = await auction.connect(buyer).buy(0, { value: ethers.utils.parseEther("0.0001")})

          const currentAuction =  await auction.auctions(0)
          const finalPrice = currentAuction.finalPrice

          await expect(() => buyTx).to.changeEtherBalance(
            seller, finalPrice - Math.floor((finalPrice * 12) / 100)
            )

          await expect(buyTx).to.emit(auction, 'AuctionEnded').withArgs(0 ,finalPrice, buyer.address)

          await expect (
            auction.connect(buyer).buy(0, { value: ethers.utils.parseEther("0.0001")})
          ).to.be.revertedWith("stopped")
      })
    })
});
