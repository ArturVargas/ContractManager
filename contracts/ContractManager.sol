// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

contract ContractManager {
    address public owner;
    /** Whith mappings instead of arrays the complexity is O(1) and is gas efficient */
    mapping(address => string) public contracts;
    mapping(address => bool) public whitelist;

    /** Modifier to set the owner of the contract, when is deployed */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can modify");
        _;
    }

    constructor() {
        /** Set owner,  */
        owner = msg.sender;
    }

    /** Functions to manage the whitelist */
    function addAddressToWhiteList(address _address) external onlyOwner {
        whitelist[_address] = true;
    }

    function isWhitelisted(address _address) public view returns(bool) {
        return whitelist[_address];
    }

    /** Add contract function add a new value into the contracts mapping
     @ _contract: address
     @ _description: string
     */
    function addContract(address _contract, string memory _description) public {
        require(isWhitelisted(msg.sender), "Sender cant add contracts");
        contracts[_contract] = _description;
    }

    /** Update contract, if not exsits already, trhow a validation error, */
    function updateContractDesc(address _contract, string memory _description) public {
        require(isWhitelisted(msg.sender), "Sender can't update contracts");
        require(bytes(contracts[_contract]).length != 0, "Contract not exist");
        contracts[_contract] = _description;
    }

    function removeContract(address _contract) public {
        require(isWhitelisted(msg.sender), "Sender cant remove contracts");
        delete contracts[_contract];
    }
}