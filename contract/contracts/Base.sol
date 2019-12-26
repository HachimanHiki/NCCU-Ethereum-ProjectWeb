pragma solidity 0.4.24;

import "./openzeppelin-solidity/ownership/Claimable.sol";
import "./openzeppelin-solidity/token/ERC20/ERC20.sol";
import "./openzeppelin-solidity/math/SafeMath.sol";

contract Base is Claimable{
    using SafeMath for uint256;

    ERC20 erc20Token;
    // 10% / 365 ~= 2.734*1e4 ~= 2734*1e7
    uint256 interestRatePerDay = 2734;
    uint256 interestRatePerDayDecimals = 1e7;
    //uint256 USDTDecimals = 1e6;

    struct borrowInfomation{
        uint256 initBorrowTime;
        uint256 initBorrowRate;
    }

    mapping(address => uint256) public borrowEther;
    mapping(address => uint256) public lockedToken;
    mapping(address => borrowInfomation) public borrowInfo;
    mapping(address => mapping(address => uint256)) public tokenBalance;

    // now only support one ERC20 token
    constructor(address _erc20TokenAddress) public{
        erc20Token = ERC20(_erc20TokenAddress);
    }

    function getBorrowEther() public view returns (uint256) {
        return borrowEther[msg.sender];
    }

    function getInitBorrowTime() public view returns (uint256) {
        return borrowInfo[msg.sender].initBorrowTime;
    }

    function getInitBorrowRate() public view returns (uint256) {
        return borrowInfo[msg.sender].initBorrowRate;
    }

    function getLockedTokenBalance() public view returns (uint256) {
        return lockedToken[msg.sender];
    }

    function getUnlockTokenBalance() public view returns (uint256) {
        return tokenBalance[msg.sender][erc20Token].sub(lockedToken[msg.sender]);
    }

    //function getTokenBalance(ERC20 _Token) public view returns (uint256) {
    function getTokenBalance() public view returns (uint256) {
        return tokenBalance[msg.sender][erc20Token];
    }
}