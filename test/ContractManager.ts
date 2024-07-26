import { expect } from "chai";
import hre from "hardhat";
import {
 loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";  
import { getAddress, parseGwei } from "viem";

describe("ContractManager", function () {

    async function deployManager() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount, wl_address_1, wl_address_2] = await hre.viem.getWalletClients();

        const contractManager = await hre.viem.deployContract("ContractManager");

        const publicClient = await hre.viem.getPublicClient();

        return {
            contractManager,
            owner,
            otherAccount,
            wl_address_1,
            wl_address_2,
            publicClient,
          };
    }

    describe("Deployment", function () {
        it("Should set owner correctly", async () => {
            const { contractManager, owner } = await loadFixture(deployManager);
            const contractOwner = contractManager.read.owner();
            console.log("contractOwner", contractOwner);
            expect(await contractOwner).to.equal(
                getAddress(owner.account.address)
            );
        });
    });

    describe("AddContract", function () {
        describe("Validations", function() {
            it("Should revert if sender is not whitelisted", async () => {
                const { contractManager, otherAccount } = await loadFixture(deployManager);
    
                const addContractNoWhitelisted = await  hre.viem.getContractAt(
                    "ContractManager",
                    contractManager.address,
                    { client: { wallet: otherAccount } }
                );

                await expect(addContractNoWhitelisted.write.addContract([
                    contractManager.address,
                    "new contract"
                ])).to.be.rejectedWith(
                    "Sender cant add contracts"
                );
            });

            it("Should add new contract if sender is whitelisted", async () => {
                const { contractManager, owner, wl_address_1 } = await loadFixture(deployManager);
    
                const addToWhitelist = await hre.viem.getContractAt(
                    "ContractManager",
                    contractManager.address,
                    { client: { wallet: owner } }
                )

                await addToWhitelist.write.addAddressToWhiteList([
                    wl_address_1.account.address
                ]);

                const addContract = await hre.viem.getContractAt(
                    "ContractManager",
                    contractManager.address,
                    { client: { wallet: wl_address_1 } }
                );

                await expect(addContract.write.addContract([
                    contractManager.address,
                    "new contract"
                ])).to.be.fulfilled;
            });
        })
    });

    describe("Update Contract description", function () {
        describe("Validations", function() {
            it("Should revert if sender is not whitelisted", async () => {
                const { contractManager } = await loadFixture(deployManager);
                
                await expect(contractManager.write.updateContractDesc([
                    contractManager.address,
                    "update contract"
                ])).to.be.rejectedWith(
                    "Sender can't update contracts"
                );
            });


            it("Should revert if contract not exists", async () => {
                const { contractManager, wl_address_1, publicClient } = await loadFixture(deployManager);
                
                // add user to whitelist 
                const hash = await contractManager.write.addAddressToWhiteList([
                    wl_address_1.account.address
                ]);

                await publicClient.waitForTransactionReceipt({ hash });

                const updateContract = await hre.viem.getContractAt(
                    "ContractManager",
                    contractManager.address,
                    { client: { wallet: wl_address_1 } }
                );

                await expect(updateContract.write.updateContractDesc([
                    contractManager.address,
                    "updated contract"
                ])).to.be.rejectedWith(
                    "Contract not exist"
                );
            });

            it("Should update contract description if sender is whitelisted and contract  exist", async () => {
                const { contractManager, wl_address_1, publicClient } = await loadFixture(deployManager);
    
                const hash = await contractManager.write.addAddressToWhiteList([
                    wl_address_1.account.address
                ]);

                await publicClient.waitForTransactionReceipt({ hash });

                const updateContract = await hre.viem.getContractAt(
                    "ContractManager",
                    contractManager.address,
                    { client: { wallet: wl_address_1 } }
                );

                await updateContract.write.addContract([
                    contractManager.address,
                    "new contract"
                ]);

                await expect(updateContract.write.updateContractDesc([
                    contractManager.address,
                    "updated contract"
                ])).to.be.fulfilled;

                expect(await updateContract.read.contracts([contractManager.address])).to.equal("updated contract");
            });
        })
    });

    describe("Remove Contract", function () {
        describe("Validations", function() {
            it("Should revert if sender is not whitelisted", async () => {
                const { contractManager } = await loadFixture(deployManager);
                
                await expect(contractManager.write.removeContract([
                    contractManager.address,
                ])).to.be.rejectedWith(
                    "Sender cant remove contracts"
                );
            });

            it("Should remove correctly", async () => {
                const { contractManager, wl_address_1, publicClient } = await loadFixture(deployManager);
                
                const hash = await contractManager.write.addAddressToWhiteList([
                    wl_address_1.account.address
                ]);

                await publicClient.waitForTransactionReceipt({ hash });

                const addNewContract = await hre.viem.getContractAt(
                    "ContractManager",
                    contractManager.address,
                    { client: { wallet: wl_address_1 } }
                );

                await addNewContract.write.addContract([
                    contractManager.address,
                    "new contract"
                ]);

                await expect(addNewContract.write.removeContract([
                    contractManager.address
                ])).to.be.fulfilled;
                expect(await addNewContract.read.contracts([contractManager.address])).to.equal("");
            });
        });
    })
})