"use client";
import { useManageSubscription, useW3iAccount } from "@web3inbox/widget-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Preferences from "../components/Preferences";

const PreferencesPage: NextPage = () => {
  const router = useRouter();
  const {
    account,
  } = useW3iAccount();
  const {
    isSubscribed,
  } = useManageSubscription(account);

  useEffect(() => {
    if(!isSubscribed) {
      router.push('/');
    }
  }, [isSubscribed, router]);

  return <>
    {isSubscribed && (<Preferences/>)}
  </>;
};

export default PreferencesPage;
