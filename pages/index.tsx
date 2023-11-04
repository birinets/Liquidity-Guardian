"use client";
import type { NextPage } from "next";
import { useCallback, useEffect } from "react";
import {
  Accordion,
  Button,
  Flex,
  Heading,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import "@web3inbox/widget-react/dist/compiled.css";

import { useAccount, useSignMessage} from "wagmi";
import { FaBell, FaBellSlash} from "react-icons/fa";
import Notifications from "../components/Notifications";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

const Home: NextPage = () => {
  const isW3iInitialized = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
    isLimited: process.env.NODE_ENV == "production",
  });
  const {
    isRegistering,
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();
  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    isSubscribing,
    isUnsubscribing,
  } = useManageSubscription(account);

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });
  const { signMessageAsync } = useSignMessage();
  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync]
  );

  // We need to set the account as soon as the user is connected
  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessage);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessage, registerIdentity, account]);

  useEffect(() => {
    handleRegistration();
  }, [handleRegistration]);

  const handleSubscribe = useCallback(async () => {
    if (!identityKey) {
      await handleRegistration();
    }

    await subscribe();
  }, [subscribe, identityKey, handleRegistration])


  return (
    <Flex w="full" flexDirection={"column"} maxW="700px">
      <Image
        aria-label="Liquidity Guardender"
        src="./logo.png"
        maxW="300px"
        margin="0 auto"
      />
      <Heading alignSelf={"center"} textAlign={"center"} mb={6}>
        Liquidity Guardener
      </Heading>

      <Flex flexDirection="column" gap={4}>
        {isSubscribed ? (
          <Flex flexDirection={"column"} alignItems="center" gap={4}>
            <Button
              leftIcon={<FaBellSlash />}
              onClick={unsubscribe}
              variant="outline"
              isDisabled={!isW3iInitialized || !account}
              colorScheme="red"
              isLoading={isUnsubscribing}
              loadingText="Unsubscribing..."
              rounded="full"
            >
              Unsubscribe
            </Button>
          </Flex>
        ) : (
          <Tooltip
            label={
              !Boolean(address)
                ? "Connect your wallet first."
                : "Register your account."
            }
            hidden={Boolean(account)}
          >
            <Button
              leftIcon={<FaBell />}
              onClick={handleSubscribe}
              colorScheme="cyan"
              rounded="full"
              variant="outline"
              w="fit-content"
              alignSelf="center"
              isLoading={isSubscribing || isRegistering}
              loadingText="Subscribing..."
              isDisabled={!Boolean(address) || !Boolean(account)}
            >
              Subscribe
            </Button>
          </Tooltip>
        )}

        {isSubscribed && (
          <Accordion defaultIndex={0} index={0} allowToggle={true} mt={10} rounded="xl">
            <Notifications />
          </Accordion>
        )}
      </Flex>
    </Flex>
  );
};

export default Home;
