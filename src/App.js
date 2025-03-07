import React, { useState } from "react";
import { RosettanetAccount, cairo } from "starknet";
import { connect } from "get-starknet-ui";
import {
  getStarknetAddress,
  prepareMulticallCalldata,
} from "./prepareCalldata";
import BigNumber from "bignumber.js";
import { parseEther } from "ethers";

export default function App() {
  const [walletName, setWalletName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [callMethodResults, setCallMethodResults] = useState({
    blockNumber: "",
    chainId: "",
    estimateGas: "",
    gasPrice: "",
    getBalance: "",
    getBlockByHash: "",
    getBlockByNumber: "",
    getBlockTransactionCountByHash: "",
    getBlockTransactionCountByNumber: "",
    getCode: "",
    getTransactionHashByBlockHashAndIndex: "",
    getTransactionHashByBlockNumberAndIndex: "",
    getTransactionByHash: "",
    getTransactionCount: "",
    getTransactionReceipt: "",
    permissions: "",
  });

  function handleConnect() {
    return async () => {
      const res = await connect();
      console.log(res);
      setWalletName(res?.name || "");
      setSelectedAccount(res);
    };
  }

  async function getCallMethods() {
    let rAccount;

    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: "https://alpha-deployment.rosettanet.io",
        },
        selectedAccount
      );
    } else {
      console.log("Please connect with get-starknet");
    }

    const tx = {
      from: rAccount.address,
      to: rAccount.address,
      value: "0x9184e72a",
    };

    if (rAccount) {
      try {
        await rAccount.blockNumberRosettanet().then((res) => {
          console.log(res);
          setCallMethodResults((prev) => ({
            ...prev,
            blockNumber: parseInt(res, 16),
          }));
        });

        await rAccount.chainIdRosettanet().then((res) => {
          console.log(res);
          setCallMethodResults((prev) => ({
            ...prev,
            chainId: res,
          }));
        });

        // await rAccount.getPermissionsRosettanet().then((res) => {
        //   console.log(res);
        //   setCallMethodResults((prev) => ({
        //     ...prev,
        //     permissions: res,
        //   }));
        // });

        await rAccount.estimateGasRosettanet(tx).then((res) => {
          console.log(res);
          setCallMethodResults((prev) => ({
            ...prev,
            estimateGas: res,
          }));
        });

        await rAccount.gasPriceRosettanet().then((res) => {
          console.log(res);
          setCallMethodResults((prev) => ({
            ...prev,
            gasPrice: res,
          }));
        });

        await rAccount.getBalanceRosettanet(rAccount.address).then((res) => {
          console.log(res);
          setCallMethodResults((prev) => ({
            ...prev,
            getBalance: res,
          }));
        });

        await rAccount
          .getBlockByHashRosettanet(
            "0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7"
          )
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getBlockByHash: res,
            }));
          });

        await rAccount.getBlockByNumberRosettanet("0x123").then((res) => {
          console.log(res);
          setCallMethodResults((prev) => ({
            ...prev,
            getBlockByNumber: res,
          }));
        });

        await rAccount
          .getBlockTransactionCountByHashRosettanet(
            "0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7"
          )
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getBlockTransactionCountByHash: res,
            }));
          });

        await rAccount
          .getBlockTransactionCountByNumberRosettanet("0x123")
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getBlockTransactionCountByNumber: res,
            }));
          });

        await rAccount.getCodeRosettanet(rAccount.address).then((res) => {
          console.log(res);
          setCallMethodResults((prev) => ({
            ...prev,
            getCode: res,
          }));
        });

        await rAccount
          .getTransactionHashByBlockHashAndIndexRosettanet(
            "0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7",
            1
          )
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getTransactionHashByBlockHashAndIndex: res,
            }));
          });

        await rAccount
          .getTransactionHashByBlockNumberAndIndexRosettanet("0x123", 1)
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getTransactionHashByBlockNumberAndIndex: res,
            }));
          });

        await rAccount
          .getTransactionByHashRosettanet(
            "0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"
          )
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getTransactionByHash: res,
            }));
          });

        await rAccount
          .getTransactionCountRosettanet(rAccount.address)
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getTransactionCount: res,
            }));
          });

        await rAccount
          .getTransactionReceiptRosettanet(
            "0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"
          )
          .then((res) => {
            console.log(res);
            setCallMethodResults((prev) => ({
              ...prev,
              getTransactionReceipt: res,
            }));
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function signMessage() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: "https://alpha-deployment.rosettanet.io",
        },
        selectedAccount
      );
    } else {
      console.log("Please connect with get-starknet");
    }

    const msgParams = JSON.stringify({
      domain: {
        // This defines the network, in this case, Mainnet.
        chainId: 1381192787,
        // Give a user-friendly name to the specific contract you're signing for.
        name: "Ether Mail",
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        // This identifies the latest version.
        version: "1",
      },

      // This defines the message you're proposing the user to sign, is dapp-specific, and contains
      // anything you want. There are no required fields. Be as explicit as possible when building out
      // the message schema.
      message: {
        contents: "Hello, Bob!",
        from: {
          name: "Cow",
          wallets: [
            "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
          ],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      // This refers to the keys of the following types object.
      primaryType: "Mail",
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        // Not an EIP712Domain definition.
        Group: [
          { name: "name", type: "string" },
          { name: "members", type: "Person[]" },
        ],
        // Refer to primaryType.
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    });

    if (rAccount) {
      try {
        // await rAccount.walletProvider
        //   .request({
        //     method: "eth_signTypedData_v4",
        //     params: [rAccount.address, msgParams],
        //   })
        //   .then((res) => {
        //     console.log(res);
        //   });

        await rAccount
          .signMessageRosettanet(msgParams, rAccount.address)
          .then((res) => {
            console.log(res);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function sendTransaction() {
    let rAccount;

    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: "https://alpha-deployment.rosettanet.io",
        },
        selectedAccount
      );
    } else {
      console.log("Please connect with get-starknet");
    }

    if (rAccount) {
      const unsignedTx = {
        to: "0xaa79a8e98e1C8Fac6Fe4DD0e677d01BF1CA5f419",
        value: "0xDE0B6B3A7640000",
        from: rAccount.address,
        data: "0x",
      };
      try {
        await rAccount.sendTransactionRosettanet(unsignedTx).then((res) => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function xStrk() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: "https://alpha-deployment.rosettanet.io",
        },
        selectedAccount
      );
    } else {
      console.log("Please connect with get-starknet");
    }

    if (rAccount) {
      const snAddress =
        "0x" + (await getStarknetAddress(rAccount.address)).toString(16);
      const starkAmount = cairo.uint256(parseEther("1"));
      const calldata = [
        {
          to: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          entrypoint:
            "0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c",
          calldata: [
            "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
            new BigNumber(starkAmount.low).toString(16),
            new BigNumber(starkAmount.high).toString(16),
          ],
        },
        {
          to: "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
          entrypoint:
            "0x00c73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01",
          calldata: [
            new BigNumber(starkAmount.low).toString(16),
            new BigNumber(starkAmount.high).toString(16),
            snAddress,
          ],
        },
      ];

      const call = await prepareMulticallCalldata(calldata);

      const unsignedTx = {
        from: rAccount.address,
        to: rAccount.address,
        data: call,
        value: "0x0",
      };

      try {
        console.log("transaction object", unsignedTx);

        await rAccount.sendTransactionRosettanet(unsignedTx).then((res) => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function changetoRosettanet() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await RosettanetAccount.connect(
        {
          nodeUrl: "https://alpha-deployment.rosettanet.io",
        },
        selectedAccount
      );
    } else {
      console.log("Please connect with get-starknet");
    }

    if (rAccount) {
      try {
        await rAccount.switchChainRosettanet().then((res) => {
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <div>
      <h2>Connect With Starknet.js</h2>
      <p>
        This part you can connect to Starknet with using Starknet.js and
        get-starknet. It will connect with MetaMask for now. Supports both
        Starknet and Ethereum requests. Both Metamask and Metamask Snaps will be
        in modal. Metamask Normal is the one added.
      </p>
      <p>
        If your wallet is connected before this page, please disconnect it from
        left side. If not there will be an error.
      </p>
      <div>
        <button onClick={handleConnect()}>Connect With get-starknet</button>
        <button onClick={changetoRosettanet}>
          Change Network to Rosettanet
        </button>
        <button onClick={getCallMethods}>Get Call Methods</button>
        <button onClick={signMessage}>Sign Message</button>
        <button onClick={sendTransaction}>Send 1 STRK</button>
        <button onClick={xStrk}>xSTRK</button>
      </div>
      <p>Wallet Name : {walletName}</p>
      <p>Call Methods : </p>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {JSON.stringify(callMethodResults, null, 2)}
      </pre>
    </div>
  );
}
