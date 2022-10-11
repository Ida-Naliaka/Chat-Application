import { SmallCloseIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

const DeleteUser = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const[loading, setLoading]= useState(false);
    const toast = useToast();
    const cancelRef = useRef();
    const navigate= useNavigate();
    const{user}= ChatState();

    const deleteMessagesHandler = async() => {
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
              await axios.put(
                `/api/user/deletemessages`,
                {
                  userId: user._id
                },
                config
              );
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom",
                  });
                  setLoading(false);
            }
      }
      const deleteChatsHandler = async() => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          await axios.put(
            `/api/user/deletechats`,
            {
              userId: user._id
            },
            config
          );

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
        }
  }
  const deleteGroupsHandler = async() => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        `/api/user/deletegroups`,
        {
          userId: user._id
        },
        config
      );
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
    }
}
const deleteUserHandler = async() => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
     const {data}= await axios.put(
      `/api/user/deleteuser`,
      {
        userId: user._id
      },
      config
    );
    if (data){ localStorage.removeItem("userInfo");
    navigate("/")} 
  } catch (error) {
      toast({
          title: "Error Occured!",
          description: error.response.data.message,
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
     {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<WarningTwoIcon  />} onClick={onOpen} />
      )}
  <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold' display={"flex"} justifyContent="space-between">
              Delete account
              <SmallCloseIcon display={"flex"} color={"#565555"} w={4} h={4} onClick={onClose}/>
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={()=> {deleteMessagesHandler(); deleteChatsHandler(); deleteGroupsHandler(); deleteUserHandler()}} ml={3}>
                Delete
              </Button>
              
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default DeleteUser
