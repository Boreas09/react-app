import { RpcProvider, Contract } from "starknet";

function addHexPadding(value, targetLength, prefix) {
  if (value.length === 0) {
    return prefix ? "0x" + "0".repeat(targetLength) : "0".repeat(targetLength);
  }
  if (value.startsWith("0x")) {
    return prefix
      ? "0x" + value.substring(2).padStart(targetLength, "0")
      : value.substring(2).padStart(targetLength, "0");
  }
  return prefix
    ? "0x" + value.padStart(targetLength, "0")
    : value.padStart(targetLength, "0");
}

export async function prepareMulticallCalldata(calls) {
  const calldata = ["0x76971d7f"];
  const length = addHexPadding(calls.length.toString(16), 64, false);

  calldata.push(length);

  for (const call of calls) {
    calldata.push(addHexPadding(call.to, 64, false).replace("0x", ""));
    calldata.push(addHexPadding(call.entrypoint, 64, false).replace("0x", ""));
    calldata.push(
      addHexPadding(call.calldata.length.toString(16), 64, false).replace(
        "0x",
        ""
      )
    );

    calldata.push(
      ...call.calldata.map((c) => addHexPadding(c, 64, false).replace("0x", ""))
    );
  }

  return calldata.join("");
}

export async function getStarknetAddress(address) {
  const starknetProvider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  const contractAddress =
    "0x036a4f60ea2e8b318d96f5d3935583df1d520324a4901192e470da01d700cf87";

  const { abi: testAbi } = await starknetProvider.getClassAt(contractAddress);
  if (testAbi === undefined) {
    throw new Error("no abi.");
  }
  const rosettaContract = new Contract(
    testAbi,
    contractAddress,
    starknetProvider
  );

  // Interaction with the contract with call
  const addr = await rosettaContract.get_starknet_address_with_fallback(
    address
  );

  return addr;
}
