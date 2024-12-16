const FileStorage = artifacts.require("DecentralizedFileStorage");

module.exports = function (deployer) {
  deployer.deploy(FileStorage);
};
