import { iWalletData, iWalletWrapper } from "@/types/lib";
import { getDefaultProvider, Provider } from "zksync";
import { Network } from "zksync/build/types";
import { ZK_NETWORK } from "@/plugins/build";

const internalWalletData: iWalletData = {
  syncProvider: undefined,
  syncWallet: undefined,
  accountState: undefined,
};

let providerPromise: Promise<Provider>;

/**
 * Wrapper for the major Providers
 * @type iWalletWrapper
 */
export const walletData: iWalletWrapper = {
  get: () => internalWalletData,

  set: (val) => {
    if (Object.prototype.hasOwnProperty.call(val, "syncProvider")) {
      internalWalletData.syncProvider = val.syncProvider;
    }
    if (Object.prototype.hasOwnProperty.call(val, "syncWallet")) {
      internalWalletData.syncWallet = val.syncWallet;
    }
    if (Object.prototype.hasOwnProperty.call(val, "accountState")) {
      internalWalletData.accountState = val.accountState;
    }
  },

  syncProvider: {
    async load() {
      if (internalWalletData.syncProvider) {
        return;
      }
      providerPromise = getDefaultProvider(ZK_NETWORK as Network, "HTTP");
      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(undefined);
          }, 3000);
        });
        internalWalletData.syncProvider = await providerPromise;
      } catch (error) {
        console.log("Failed to load provider", error);
      }
    },
    async get() {
      if (!internalWalletData.syncProvider || typeof providerPromise === "undefined") {
        walletData.syncProvider.load();
      }
      return await providerPromise;
    },
  },
};
