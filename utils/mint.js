const { ethers } = require("ethers");
const settings = require("../config/config");

const EXPOLER = `${settings.EXPOLER}/tx/`;
const BYTES_TEMPLATE =
  "0x84bb1e42000000000000000000000000{WALLET_ADDRESS}0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
const BYTES_TEMPLATE_FAROS =
  "0x84bb1e42000000000000000000000000{WALLET_ADDRESS}0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

class MintService {
  constructor({ wallet, provider }) {
    this.wallet = wallet;
    this.provider = provider;
  }

  createCalldata(walletAddress, TEMPLATE = BYTES_TEMPLATE) {
    const cleanAddress = walletAddress.replace("0x", "").toLowerCase();
    return TEMPLATE.replace("{WALLET_ADDRESS}", cleanAddress);
  }

  async mintGotChip() {
    try {
      const wallet = this.wallet;
      const provider = this.provider;
      const balance = await provider.getBalance(wallet.address);

      const balanceInEther = ethers.formatEther(balance);

      if (parseFloat(balanceInEther) < 0.0005) {
        return {
          tx: null,
          success: false,
          stop: true,
          message: "Insufficient PHRS for mint",
        };
      }

      const pendingNonce = await provider.getTransactionCount(wallet.address, "pending");
      const latestNonce = await provider.getTransactionCount(wallet.address, "latest");

      if (pendingNonce > latestNonce) {
        return {
          tx: null,
          success: false,
          stop: false,
          message: "There are pending transactions. Please wait for them to be completed.",
        };
      }

      const params = {
        to: "0x0000000038f050528452d6da1e7aacfa7b3ec0a8",
        data: "0x5b70ea9f",
        gasPrice: ethers.parseUnits("1.3", "gwei"),
        gasLimit: 286314,
        chainId: settings.CHAIN_ID,
        nonce: latestNonce,
        value: 0,
      };

      const tx = await wallet.sendTransaction(params);
      await tx.wait(3);

      return {
        tx: tx.hash,
        success: true,
        message: `Mint gotchip successful! Transaction hash: ${EXPOLER}${tx.hash}`,
      };
    } catch (error) {
      if (error.code === "NONCE_EXPIRED" || error.message.includes("TX_REPLAY_ATTACK")) {
        return {
          tx: null,
          success: false,
          stop: true,
          message: "Nonce conflict detected. Please retry the transaction.",
        };
      }
      return {
        tx: null,
        success: false,
        stop: true,
        message: `Error mint gotchip: ${error.message}`,
      };
    }
  }

  async mintGrandline() {
    // try {
    //   const wallet = this.wallet;
    //   const provider = this.provider;
    //   const balance = await provider.getBalance(wallet.address);
    //   const balanceInEther = ethers.formatEther(balance);
    //   if (parseFloat(balanceInEther) < 1.0005) {
    //     return {
    //       tx: null,
    //       success: false,
    //       stop: true,
    //       message: "Insufficient PHRS for mint",
    //     };
    //   }
    //   const pendingNonce = await provider.getTransactionCount(wallet.address, "pending");
    //   const latestNonce = await provider.getTransactionCount(wallet.address, "latest");
    //   if (pendingNonce > latestNonce) {
    //     return {
    //       tx: null,
    //       success: false,
    //       stop: false,
    //       message: "There are pending transactions. Please wait for them to be completed.",
    //     };
    //   }
    //   const params = {
    //     to: "0x1da9f40036bee3fda37ddd9bff624e1125d8991d",
    //     data: "0x84bb1e42",
    //     gasPrice: ethers.parseUnits("1.3", "gwei"),
    //     gasLimit: 1000000,
    //     nonce: latestNonce,
    //     value: ethers.parseEther("1"),
    //   };
    //   const tx = await wallet.sendTransaction(params);
    //   await tx.wait(3);
    //   return {
    //     tx: tx.hash,
    //     success: true,
    //     message: `Mint grandline successful! Transaction hash: ${EXPOLER}${tx.hash}`,
    //   };
    // } catch (error) {
    //   if (error.code === "NONCE_EXPIRED" || error.message.includes("TX_REPLAY_ATTACK")) {
    //     return {
    //       tx: null,
    //       success: false,
    //       stop: true,
    //       message: "Nonce conflict detected. Please retry the transaction.",
    //     };
    //   }
    //   return {
    //     tx: null,
    //     success: false,
    //     stop: true,
    //     message: `Error mint grandline: ${error.message}`,
    //   };
    // }
  }

  async mintPharosBadge() {
    try {
      const wallet = this.wallet;
      const provider = this.provider;
      const balance = await provider.getBalance(wallet.address);

      const balanceInEther = ethers.formatEther(balance);

      if (parseFloat(balanceInEther) < 1.0005) {
        return {
          tx: null,
          success: false,
          stop: true,
          message: "Insufficient PHRS for mint",
        };
      }

      const pendingNonce = await provider.getTransactionCount(wallet.address, "pending");
      const latestNonce = await provider.getTransactionCount(wallet.address, "latest");

      if (pendingNonce > latestNonce) {
        return {
          tx: null,
          success: false,
          stop: false,
          message: "There are pending transactions. Please wait for them to be completed.",
        };
      }

      const valueInWei = ethers.parseEther("1");
      const calldata = this.createCalldata(this.wallet.address);

      const params = {
        to: "0x1da9f40036bee3fda37ddd9bff624e1125d8991d",
        data: calldata,
        gasPrice: ethers.parseUnits("1.3", "gwei"),
        gasLimit: 1000000000,
        nonce: latestNonce,
        value: valueInWei,
      };

      const tx = await wallet.sendTransaction(params);
      await tx.wait(3);

      return {
        tx: tx.hash,
        success: true,
        message: `Mint pharos badge successful! Transaction hash: ${EXPOLER}${tx.hash}`,
      };
    } catch (error) {
      if (error.code === "NONCE_EXPIRED" || error.message.includes("TX_REPLAY_ATTACK")) {
        return {
          tx: null,
          success: false,
          stop: true,
          message: "Nonce conflict detected. Please retry the transaction.",
        };
      }
      return {
        tx: null,
        success: false,
        stop: true,
        message: `Error mint pharos: ${error.message}`,
      };
    }
  }

  async mintFarosBadge() {
    try {
      const wallet = this.wallet;
      const provider = this.provider;
      const balance = await provider.getBalance(wallet.address);

      const balanceInEther = ethers.formatEther(balance);

      if (parseFloat(balanceInEther) < 1.0005) {
        return {
          tx: null,
          success: false,
          stop: true,
          message: "Insufficient PHRS for mint",
        };
      }

      const pendingNonce = await provider.getTransactionCount(wallet.address, "pending");
      const latestNonce = await provider.getTransactionCount(wallet.address, "latest");

      if (pendingNonce > latestNonce) {
        return {
          tx: null,
          success: false,
          stop: false,
          message: "There are pending transactions. Please wait for them to be completed.",
        };
      }

      const valueInWei = ethers.parseEther("1");
      const calldata = this.createCalldata(this.wallet.address, BYTES_TEMPLATE_FAROS);
      const feeData = await provider.getFeeData();
      const params = {
        to: "0x7fB63bFD3Ef701544BF805e88CB9D2Efaa3C01A9",
        data: calldata,
        gasPrice: feeData.gasPrice,
        gasLimit: 1000000000,
        nonce: latestNonce,
        value: valueInWei,
      };

      const tx = await wallet.sendTransaction(params);
      await tx.wait(3);

      return {
        tx: tx.hash,
        success: true,
        message: `Mint faros badge successful! Transaction hash: ${EXPOLER}${tx.hash}`,
      };
    } catch (error) {
      if (error.code === "NONCE_EXPIRED" || error.message.includes("TX_REPLAY_ATTACK")) {
        return {
          tx: null,
          success: false,
          stop: true,
          message: "Nonce conflict detected. Please retry the transaction.",
        };
      }
      return {
        tx: null,
        success: false,
        stop: true,
        message: `Error mint faros: ${error.message}`,
      };
    }
  }
}

module.exports = MintService;
