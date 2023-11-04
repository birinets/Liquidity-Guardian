import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useMessages, useW3iAccount } from "@web3inbox/widget-react";
import Link from "next/link";
import React from "react";

function Notifications() {
  const { account } = useW3iAccount();
  const { messages: notifications, deleteMessage: deleteNotification } = useMessages(account);

  return (
    <AccordionItem>
      <AccordionButton>
        <Heading fontSize="md" as="span" flex="1" textAlign="left">
          Last notifications
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <Box overflowY="scroll" position={"relative"} maxH="400px">
        <AccordionPanel
          display="flex"
          flexDirection={"column"}
          pb={4}
          gap={2}
          position={"relative"}
        >
          {!notifications?.length ? (
            <Text>No notifications yet.</Text>
          ) : (
            notifications
              .sort((a, b) => b.id - a.id)
              .map(({ id, message: notification }) => (
                <Alert
                  as={Link}
                  href={notification.url}
                  target="_blank"
                  key={id}
                  status="info"
                  colorScheme={
                    notification.type === "transactional" ? "blue" : "purple"
                  }
                  rounded="xl"
                >
                  <AlertIcon />

                  <Flex flexDir={"column"} flexGrow={1}>
                    <AlertTitle>{notification.title}</AlertTitle>
                    <AlertDescription flexGrow={1}>
                      {notification.body}
                    </AlertDescription>
                  </Flex>
                  <Flex w="60px" justifyContent="center">
                    <Button onClick={() => window.open(notification.url, '_blank', 'noopener,noreferrer')}>
                      Go
                    </Button>
                  </Flex>
                  <CloseButton
                    alignSelf="flex-start"
                    position="relative"
                    right={-1}
                    top={-1}
                    onClick={async (e) => {
                      e.preventDefault();
                      deleteNotification(id);
                    }}
                  />
                </Alert>
              ))
          )}
        </AccordionPanel>
      </Box>
    </AccordionItem>
  );
}

export default Notifications;
