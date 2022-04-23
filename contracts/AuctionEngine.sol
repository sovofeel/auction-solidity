//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract AuctionEngine {
    // Владелец площадки
    address public owner;
    uint256 constant DURATION = 2 days;
    uint256 constant FEE = 12; // Комиссия 12%

    struct Auction {
        address payable seller;
        uint256 startingPrice;
        uint256 finalPrice;
        uint256 startAt;
        uint256 endsAt;
        uint256 discountRate;
        string item;
        bool stopped;
    }

    Auction[] public auctions;

    event ActionCreated(
        uint256 index,
        string itemName,
        uint256 startingPrice,
        uint256 duration
    );

    constructor() {
        owner = msg.sender;
    }

    function createAuction(
        uint256 _startingPrice,
        uint256 _discountRate,
        string calldata _item,
        uint256 _duration
    ) external {
        uint256 duration = _duration == 0 ? DURATION : _duration;

        require(
            _startingPrice >= _discountRate * duration,
            "incorrect starting price: "
        );

        Auction memory newAuction = Auction({
            seller: payable(msg.sender),
            startingPrice: _startingPrice,
            finalPrice: _startingPrice,
            discountRate: _discountRate,
            startAt: block.timestamp,
            endsAt: block.timestamp + duration,
            item: _item,
            stopped: false
        });

        auctions.push(newAuction);

        emit ActionCreated(
            auctions.length - 1,
            _item,
            _startingPrice,
            duration
        );
    }

    function getPriceFor(uint256 index) public view returns (uint256) {
        Auction memory currentAuction = auctions[index];
        require(!currentAuction.stopped, "stopped");
        uint256 elapsed = block.timestamp - currentAuction.startAt;
        uint256 discount = currentAuction.discountRate * elapsed;
        return currentAuction.startingPrice - discount;
    }

    function buy(uint256 index) external payable {
        Auction memory currentAuction = auctions[index];
        require(!currentAuction.stopped, "stopped");
        require(block.timestamp < currentAuction.endsAt, "ended");
        uint256 currentPrice = getPriceFor(index);
        require(msg.value >= currentPrice, "not enought funds!");
        currentAuction.stopped = true;
        currentAuction.finalPrice = currentPrice;
        uint256 refund = msg.value = currentPrice;

        if (refund > 0) {
            payable(msg.sender).transer(refund);
        }

        currentAuction.seller.transer(
            currentPrice - ((currentPrice * FEE) / 100)
        );
    }
}
