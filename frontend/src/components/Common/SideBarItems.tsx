import {
    Box,
    Flex,
    Icon,
    list,
    Text, 
    Button,
    useColorModeValue,
    background
} from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { UserPublic } from "../../client"
import { FaDownload, FaFile, FaInfo } from "react-icons/fa"

const items = [
    { icon: FaDownload, title: "Downloads", path: "/downloads" },
    { icon: FaFile, title: "Documentations", path: "/doc" },
    { icon: FaInfo, title: "About", path: "/about"}
]

interface SidebarItemsProps {
    onClose?: () => void
}

const SideBarItems = ({ onClose }: SidebarItemsProps) => {
    const queryClient = useQueryClient()
    const textColor = useColorModeValue("ui.dark", "ui.light")
    const bgActive = useColorModeValue("ui.secondary", "ui.darkSlate")
    // const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

    // const finalItems = currentUser?.is_superuser
    // ? [... items, {title: "Items", path: "/"}]
    // : items

    const finalItems = items

    const listItems = finalItems.map (({icon,title, path}) =>
    (
        <Button
            as={Link}
            to={path}
            w="100%"
            p={2}
            key={title}
            borderRadius="0px"
            bg={bgActive}
            bgImage ={"linear(to-l, ui.main, ui.main)"}
            color={textColor}
            onClick={onClose}
            alignItems="left"
            justifyContent="flex-start"
            backgroundPosition= "0% 100%"
            backgroundRepeat="no-repeat"
            backgroundSize="0% 100%"
            transition=".3s ease-in"
            transitionProperty="background-size, color"
            _hover={{
                color:"ui.light",
                backgroundSize:"100% 100%", 
            }}
        >
            <Icon as={icon} ml={1}/>
            <Text ml={2}>{title}</Text>
        </Button>

    ))

    return (
        <>
            <Box>{listItems}</Box>
        </>
    )
}

export default SideBarItems