import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import SideBar from "../components/Common/SideBar"

export const Route = createFileRoute('/_layout')({
  component: Layout,
})

function Layout() {
  return (
    <Flex maxW="large" h="auto" position="relative">
      <SideBar />
      {/* <Flex 
        justify="center" 
        align="center" 
        height="100vh" 
        width="full"   
        backgroundColor={bgColor}>
        <Spinner 
          size="xl" 
          color="ui.main"
          thickness='15px'
          width="15vh"
          height="15vh"
        ></Spinner>
      </Flex> */}

      <Flex w="full"><Outlet /></Flex>
    </Flex>
  )
} 