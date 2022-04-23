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
        uint256 endAt;
        uint256 discountRate;
        string item;
        bool stopped;
    }
}
