import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat/";
import { DiceGame, RiggedRoll } from "../typechain-types";

const deployRiggedRoll: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const diceGame: DiceGame = await ethers.getContract("DiceGame");
  const diceGameAddress = await diceGame.getAddress();

  // Uncomment to deploy RiggedRoll contract
  await deploy("RiggedRoll", {
    from: deployer,
    log: true,
    args: [diceGameAddress],
    autoMine: true,
  });

  const riggedRoll: RiggedRoll = await ethers.getContract("RiggedRoll", deployer);

  // Chuyển owner sang địa chỉ frontend nếu cung cấp biến môi trường FRONTEND_OWNER.
  const frontendOwner = process.env.FRONTEND_OWNER;
  if (frontendOwner && frontendOwner !== deployer) {
    try {
      await riggedRoll.transferOwnership(frontendOwner);
    } catch (err) {
      console.log(err);
    }
  }
};

export default deployRiggedRoll;

deployRiggedRoll.tags = ["RiggedRoll"];
