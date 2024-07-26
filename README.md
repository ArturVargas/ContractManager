# Contract Manager

Smart Contract that manages efficiently the storage, updating and removal contract addresses and their corresponding descriptions.

## To Run the project

* Install library's

```shell
 npm i
 ```

* Compile Contracts

```shell
 npx hardhat compile
 ```

* Run the test with gas report

```shell
 npx hardhat test
```

* See the test coverage running

```shell
 SOLIDITY_COVERAGE=true npx hardhat coverage
```

### Testing

The testing aproach is `Unit Testing` focused on the correct execution of the functions and his validations

---------------------

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
