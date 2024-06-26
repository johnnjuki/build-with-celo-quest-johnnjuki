import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { getContract, formatEther, createPublicClient, http } from "viem";
import { celo } from "viem/chains";
import { stableTokenABI } from "@celo/abis";

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
}); // Mainnet

async function checkCUSDBalance(publicClient: any, address: string) {
  console.log(address);

  let StableTokenContract = getContract({
    abi: stableTokenABI,
    address: STABLE_TOKEN_ADDRESS,
    client: {
      public: publicClient,
    },
  });

  let balanceInBigNumber = await StableTokenContract.read.balanceOf([address]);

  let balanceInWei = balanceInBigNumber.toString();

  let balanceInEthers = formatEther(balanceInWei);

  return balanceInEthers;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
      checkCUSDBalance(publicClient, address).then((balance) => {
        setBalance(balance);
      });
    }
  }, [address, isConnected]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {isConnected ? (
        <>
          <div className="h1">Balance: {balance} cUSD</div>
          <div className="h2 text-center">Your address: {userAddress}</div>
        </>
      ) : (
        <div>No Wallet Connected</div>
      )}
    </div>
  );
}
