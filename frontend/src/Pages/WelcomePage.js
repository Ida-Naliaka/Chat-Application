import { Box, Text, useToast } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';
import { verifyUser } from '../Components/Authentication/AuthCode';


const WelcomePage = (url) => {
  url=window.location.href
  const toast= useToast();
 var splitUrl = url.split('/');
 const params= splitUrl[splitUrl.length-1]
 if(verifyUser(params)) {
  toast({
    title: 'Authentication Successful!',
    status: 'success',
    duration: 2000,
    isClosable: true,
    position:"bottom",
  })
 } else {
  toast({
  title: 'Authentication Failed!',
  status: 'warning',
  duration: 2000,
  isClosable: true,
  position:"bottom",
})

}
  return (
    <Box bg={"white"}>
      <Text fontSize={"md"}>
          <b>Account confirmed!</b>
      </Text>
      <Link to={"/"}>
        Please Login to Continue
      </Link>
    </Box>
  )
}

export default WelcomePage
