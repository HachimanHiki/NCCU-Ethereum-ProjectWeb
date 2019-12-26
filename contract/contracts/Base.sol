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

    function getBorrowEther(address _add) public view returns (uint256) {
        return borrowEther[_add];
    }

    function getInitBorrowTime(address _add) public view returns (uint256) {
        return borrowInfo[_add].initBorrowTime;
    }

    function getInitBorrowRate(address _add) public view returns (uint256) {
        return borrowInfo[_add].initBorrowRate;
    }

    function getLockedTokenBalance(address _add) public view returns (uint256) {
        return lockedToken[_add];
    }

    function getUnlockTokenBalance(address _add) public view returns (uint256) {
        return tokenBalance[_add][erc20Token].sub(lockedToken[_add]);
    }

    //function getTokenBalance(address _add, ERC20 _Token) public view returns (uint256) {
    function getTokenBalance(address _add) public view returns (uint256) {
        return tokenBalance[_add][erc20Token];
    }
}