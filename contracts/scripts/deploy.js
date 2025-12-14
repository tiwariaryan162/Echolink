const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const echoLink = await hre.ethers.deployContract("EchoLink", ["Hello EchoLink!"]);

    await echoLink.waitForDeployment();

    console.log("EchoLink deployed to:", echoLink.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
