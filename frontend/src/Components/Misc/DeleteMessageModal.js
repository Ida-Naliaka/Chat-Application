import { SmallCloseIcon } from '@chakra-ui/icons';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogOverlay, Button, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';


/*
 function useForceUpdate(){
      const [value, setValue] = useState(0); // integer state
      return () => setValue(value => value + 1); // update state to force render
      // An function that increment 👆🏻 the previous state like here 
      // is better than directly setting `value + 1`
  }*/
const DeleteMessageModal = ({fetchMessages, user, themessage}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const[loading, setLoading]= useState(false);
    const { selectedChat, setSelectedChat } = ChatState()
    const [selectedMessage, setSelectedMessage] = useState();
    const toast = useToast();
    const cancelRef = React.useRef();
    
   // const forceUpdate = useForceUpdate();
    
  const deleteHandler = async() => {
 
    if (selectedMessage.sender[0]._id !== user._id) {
            toast({
                title: "You cannot Delete someone else's message",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom",
              });
              onClose();
              return;
        }
        try {
          setSelectedChat(selectedMessage.chat);
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
           await axios.put(
            `/api/message/remove`,
            {
              chatId: selectedMessage.chat,
              messageId: selectedMessage._id,

            },
            config
          );
          fetchMessages();
          setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
        }
  }

  return (
    <>
  <IconButton display={{ base: "flex" }} w={4} h={4} background="inherit" icon={<SmallCloseIcon display={"flex"} color={"#565555"} 
    w={3} h={3}/>} onClick={()=>{onOpen(); setSelectedMessage(themessage);}}/>
  <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold' display={"flex"} justifyContent="space-between">
              Delete Message
              <SmallCloseIcon display={"flex"} color={"#565555"} w={4} h={4} onClick={onClose}/>
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={deleteHandler} ml={3}>
                Delete
              </Button>
              
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default DeleteMessageModal
