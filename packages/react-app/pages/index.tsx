import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { getContract, formatEther, createPublicClient, http } from "viem";
import { celo } from "viem/chains";
import { stableTokenABI } from "@celo/abis";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  // @ts-ignore
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
        <Card className="w-full">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-bold">My Account</h2>
          </CardHeader>
          <CardContent className="px-6 py-8 bg-background text-foreground">
            <div className="bg-muted rounded-lg p-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Address</div>
                <div className="text-sm font-medium text-muted-foreground">
                  {userAddress}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="text-sm font-medium">cUSD Balance</div>
                <div className="text-sm font-medium text-muted-foreground">
                  ${balance}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>No Wallet Connected</div>
      )}
    </div>
  );
}
