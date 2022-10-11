import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail]= useState();
    const [password, setPassword]= useState();
    const [show, setShow]= useState(false);
    const [loading, setLoading]= useState(false);
    const toast = useToast();
    const navigate= useNavigate();

    const handleClick=()=>setShow(!show);
    const handleSubmit=async ()=>{
      setLoading(true);
      if( !email || !password) {
        toast({
          title: 'Please Fill All the Fields.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:"bottom",
        })
        setLoading(false);
        return;
      }
      try {
          const config={
            headers: {
              "Content-type": "application/json",
            },
          };
          const{ data }= await axios.post(`/api/auth/login`, {
            email: email, 
            password: password}, config)
          toast({
            title: 'Login Successful',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position:"bottom",
          })
          localStorage.setItem("userInfo", JSON.stringify(data))
          setLoading(false)
          navigate("/chats")

        } catch (error) {
          toast({
            title: 'Error Occured',
            description: error.response.data.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
            position:"bottom",
          })
          setLoading(false)
        }
    };

  return (
      <VStack spacing='5px' color='black'>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your Email'
        value={email ||""}
        onChange={(e)=>setEmail(e.target.value)}
        />
      </FormControl>
      
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
        type={show?'text':'password'}
        placeholder='Set Password'
        value={password ||""}
        onChange={(e)=>setPassword(e.target.value)}
         />
         <InputRightElement width='4.5rem' >
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
         </InputRightElement>
         </InputGroup>
      </FormControl>

      
      <Button
      colorScheme='green'
      width='100%' 
      style= {{ marginTop: 15 }}
      onClick={handleSubmit}
      isLoading={loading}>
        Log In
        </Button>
        <Button
        variant='solid'
        colorScheme='red'
        width='100%' 
        style= {{ marginTop: 15 }}
        onClick={()=> {
          setEmail('iydarangie@gmail.com');
          setPassword('MveMJSuNp09*')
          }}>
        Get Guest user Credentials
        </Button>
    </VStack>
  )
}

export default Login
