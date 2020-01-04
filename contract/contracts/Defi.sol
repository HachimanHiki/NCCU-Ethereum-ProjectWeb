pragma solidity 0.4.24;

import "./Borrower.sol";
import "./Lender.sol";

contract Defi is Lender, Borrower{

    constructor(address _add) public Base(_add){}

    // user withdraw

    event WithdrawERC20(address indexed user, uint256 value);

    function withdrawERC20(uint256 _value) public{
        require(getUnlockTokenBalance() >= _value);
        tokenBalance[msg.sender][erc20Token] = tokenBalance[msg.sender][erc20Token].sub(_value);
        erc20Token.transfer(msg.sender, _value);

        emit WithdrawERC20(msg.sender, _value);
    }

    // admin test
    function adminWithdrawERC20() public onlyOwner{
        erc20Token.transfer(msg.sender, erc20Token.balanceOf(address(this)));
    }

    function adminWithdrawEth() public onlyOwner{
        msg.sender.transfer(address(this).balance);
    }

}