import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getSender } from '../Config/ChatLogic'
import { ChatState } from '../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import GroupChatModal from './Misc/GroupChatModal'
import { Icon } from '@chakra-ui/react'

const MyChats = ({ fetchAgain }) => {
  const toast=useToast();
  const [loggedUser, setLoggedUser] = useState([]);
  const[chats, setChats]= useState([])
  const { selectedChat, setSelectedChat, user, notification } =
  ChatState();

  const fetchChats = async() => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
 
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="80%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((c) => (
              <Box
                onClick={() => setSelectedChat(c)}
                cursor="pointer"
                bg={selectedChat === c ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === c ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={c._id}
              >
                <Text>
                  {!c.isGroupChat
                    ? getSender(loggedUser, c.users)
                    : c.chatName}
                </Text>
                {c.latestMessage?
                  (<div style={{display:"flex", justifyContent:"space-between"}}>
                    <Text fontSize="xs">
                  <b>{c.latestMessage.sender[0].name} : </b>
                  {  c.latestMessage.content? (
                    c.latestMessage.content.length > 50
                    ? c.latestMessage.content.substring(0, 51) + "..."
                    : c.latestMessage.content): ('Attachment')}
                </Text>
                 <CheckIcon w={2} h={2} color="purple"/>
                 </div>):<></>
                }
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats