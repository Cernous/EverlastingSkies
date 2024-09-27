import {
    Box,
    Flex,
    IconButton,
    Image,
    useColorModeValue,
    useColorMode,
    useDisclosure,
    Icon,
    Center
} from "@chakra-ui/react"
import {FaMoon, FaSun} from "react-icons/fa"

import { useQueryClient } from "@tanstack/react-query"

import Logo from '../../../public/assets/images/Logo.png'

import SideBarItems from "./SideBarItems"


const SideBar = () => {
    const queryClient = useQueryClient()
    const textColor = useColorModeValue("ui.dark", "ui.light")
    const secBgColor = useColorModeValue("ui.secondary", "ui.darkSlate")
    // const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

    //const { isOpen, onOpen, onClose } = useDisclosure()

    const {toggleColorMode, colorMode} = useColorMode();

    return (
        <>
        {/*Desktop*/}
        <Box
            p = {3}
            h="100vh"
            position="sticky"
            top="0"
            display={{base: "none", md:"flex"}}
            w="25%"
        >
            <Flex
                flexDir="column"
                justify="space-between"
                bg={secBgColor}
                p={1}           
                borderRadius={12}
            >
                <Box>
                    <Center>
                        <Image src={Logo} alt="Logo" w="75%" maxW="1xs" p={6}/>
                    </Center>
                    <SideBarItems />
                </Box>
            </Flex>
            <IconButton 
                aria-label={"toggle-ColorMode"}  
                rounded="full"
                size="s"
                position="absolute"
                left={6}
                bottom={6}
                onClick={toggleColorMode}
                transitionProperty="background-color"
                transitionDelay="300ms"
                icon={colorMode === "dark" ? <FaSun/> : <FaMoon/>}
            />      
            </Box>
        </>
    )
}

export default SideBar