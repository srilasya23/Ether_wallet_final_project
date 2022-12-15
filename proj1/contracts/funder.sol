// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder {
    uint256 public numOfFunders=0;
    address public owner;
    constructor(){
        owner=msg.sender;
    }
    mapping(uint256 => address) private funders;
     
    function getOwner() public view returns(address){
        return owner;
    }
    function transfer() external payable {
        funders[numOfFunders] = msg.sender;
        numOfFunders+=1;
    }

    function withdraw(uint256 withdrawAmount) external {
        require(
            withdrawAmount <= 2000000000000000000 && msg.sender==owner,
            "Cannot withdraw more than 2 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }
}
