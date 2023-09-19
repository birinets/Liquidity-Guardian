import { Button, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

interface Props {
  children: React.ReactNode;
  href: string;
}

export const NavLink = (props: Props) => {
  const { children, href } = props;
  const router = useRouter();
  const isActive = useMemo(
    () => router.pathname === href,
    [router.pathname, href]
  );
  const hoverBg = useColorModeValue("gray.200", "gray.700");

  return (
    <Button
      variant="outline"
      as={Link}
      px={2}
      py={1}
      rounded={"full"}
      _hover={{
        textDecoration: "none",
        bg: hoverBg,
      }}
      href={href}
      isActive={isActive}
    >
      {children}
    </Button>
  );
};
