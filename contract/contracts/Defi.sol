pragma solidity 0.4.24;

import "./Borrower.sol";
import "./Lender.sol";

contract Defi is Lender, Borrower{

    constructor() public Base(0xBF20b11C657220fBea7082EbdF19D74fAb7E3DAA){}

    // user withdraw

    function withdrawERC20(uint256 value) public{
        require(getUnlockTokenBalance() >= value);
        tokenBalance[msg.sender][erc20Token] = tokenBalance[msg.sender][erc20Token].sub(value);
        erc20Token.transfer(msg.sender, value);
    }

    // admin test
    function adminWithdrawERC20() public onlyOwner{
        erc20Token.transfer(msg.sender, erc20Token.balanceOf(address(this)));
    }

    function adminWithdrawEth() public onlyOwner{
        msg.sender.transfer(address(this).balance);
    }

}