import React, { useState } from 'react'
import {Avatar, Badge, Image, Text, useToast } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import ScrollableFeed  from 'react-scrollable-feed';
import DeleteMessageModal from './Misc/DeleteMessageModal';
import axios from 'axios';
import { CheckIcon, DownloadIcon } from '@chakra-ui/icons';
var socket;

const ScrollableChat = ({ messages, fetchAgain, setFetchAgain }) => {
    const { selectedChat, user } = ChatState();
    const [loading, setLoading] = useState(false);
    const toast= useToast();
    const fetchMessages = async () => {
        if (!selectedChat) return;
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          setLoading(true);
    
          const { data } = await axios.get(
            `/api/message/${selectedChat._id}`,
            config
          );
          messages=data;
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
        }
      };
      const checkType=(str)=>{
        let splitLink= str.split('.');
        return splitLink[splitLink.length-1]
        }
      async function downloadImage(imageSrc) {
        const image = await fetch(imageSrc)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)
        const linkArea= document.getElementById('img')
        linkArea.href = imageURL
        
        linkArea.download = 'enchat image '
        linkArea.click();
      }
      async function downloadVideo(videoSrc, sender) {
        const video = await fetch(videoSrc)
        const vidBlog = await video.blob()
        const vidURL = URL.createObjectURL(vidBlog)
        const linkArea= document.getElementById('vidId')
        linkArea.href = vidURL
        linkArea.download = 'enchat video from' +`${ sender}`
        linkArea.click();
      }

  return (
    <ScrollableFeed>
      {
        messages &&
        messages.map((m, i) => (
            <div
            key={m._id}>

                 <div style= {{
                  display: 'flex',
                  flexDirection: `${
                  m.sender[0]._id===user._id ? "row-reverse" : "row"}`,
                  }}>
               
                <Avatar
                  mt="15px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender[0].name}
                  src={m.sender[0].pic}
                  />
                  
                  <span
                  style={{
                  backgroundColor: `${
                    m.sender[0]._id===user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: m.sender[0]._id===user._id ? '50%' : 0,
                  marginRight: m.sender[0]._id===user._id ? 0 :"50%",
                  marginTop: 5,
                  marginBottom:3,
                  display: "flex",
                  width:"fit-content",
                  height:"fit-content",
                  flexDirection: "column",
                  borderRadius: "20px",
                  padding: "5px 15px",
                }}>
                  <div style={{display: "flex",
                    justifyContent: "space-between",
                    alignItems:"space-between"
                    }}>
                      <Text 
                  w="100%"
                  color={ "#565555"}
                  fontFamily="Work sans"
                  fontSize={"13px"}
                  fontWeight={"bold"}
                  display="flex"
                  >
                 { m.sender[0].name}
                 </Text>
                 <DeleteMessageModal 
                 user={user}
                 themessage={m}
                 fetchMessages={fetchMessages}/>
                 </div>
                
                <div style={{display:"flex",
                 flexDirection:"column"}}>
                    {
                        m.attachment?
                        (
                            checkType(m.attachment)=='jpg'||'png'||'jpeg' ?
                        (
                            m.sender[0]._id===user._id ?
                            (
                            <div style={{display:"flex",
                            flexDirection:"column"}}>
                             <Image
                             borderRadius="2px"
                             boxSize="150px"
                             src={m.attachment}
                             alt={'attachment'}
                             allowFullScreen
                           /></div>
                           ):
                        (
                        <div style={{display:"flex",
                        flexDirection:"column"}}>
                         <Image
                         borderRadius="2px"
                         boxSize="150px"
                         src={m.attachment}
                         alt={'attachment'}
                         allowFullScreen
                       />
                       <a id='img'>
                       <DownloadIcon onClick={()=>downloadImage(m.attachment)}/>
                       </a>
                       </div> )
                       )
                        :( 
                            m.sender[0]._id===user._id ?
                            (
                            <div style={{display:"flex",
                            flexDirection:"column"}}>
                                <video width="150" height="150" controls allowFullScreen style={{display:"block"}}>
                                 <source  src={URL.createObjectURL(m.attachment)} />
                                 </video>
                              </div>
                              ):
                            (
                            <div style={{display:"flex",
                            flexDirection:"column"}}>
                              <video width="150" height="150" controls allowFullScreen style={{display:"block"}}>
                                 <source id='vidId' src={URL.createObjectURL(m.attachment)} />
                                 </video>
                               <a >
                           <DownloadIcon onClick={()=>downloadVideo(m.attachment)}/>
                           </a>
                           </div>
                           )
                           )) : m.content}
                           </div>
                           <div style={{display:"flex", justifyContent:"space-between"}}>
                            <Badge
                            colorScheme={'inherit'}
                            color={"#565555"}
                            fontWeight="medium"
                            fontSize={"11px"}
                            display="flex"
                            justifyContent={m.sender[0]._id===user._id ?"flex-start":"flex-end"}>
                                {new Date(m.sentAt).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
                                </Badge>
                                    {m.sender[0]._id===user._id ? 
                                    (<Badge colorScheme={'inherit'}>
                                    <CheckIcon w={2} h={2} color="purple"/>
                                    </Badge>):
                                    <></> }
                </div>
                </span>
              </div>
            </div>
        )

        )
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat
