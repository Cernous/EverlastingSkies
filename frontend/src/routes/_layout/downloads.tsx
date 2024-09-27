import { createFileRoute } from "@tanstack/react-router";
import {
  Flex,
  Box,
  Text,
  Icon,
  Button,
  Center,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";

import { useQueryClient, useQuery } from "@tanstack/react-query";

import { FaDownload, FaMicrosoft , FaLinux} from "react-icons/fa";
import { DownloadableItem, ItemService } from "../../client";
import useFileDL from "../../hooks/useFileDL";

function readItemsQuery() {
  return {
    queryFn: () => ItemService.readItems(),
    queryKey: ["items"]
  }
}

const Itemlist = () => {
  const queryClient = useQueryClient()
  const bgColor = useColorModeValue("ui.secondary", "ui.darkSlate")
  const color = useColorModeValue("ui.dark", "ui.light")

  const {FileDownload, error, loading } = useFileDL();   
  
  const {data, isPlaceholderData} = useQuery({
    ...readItemsQuery(),
    placeholderData: (prevData) => prevData
  })

  let list = data?.data

  const listItems = list? list.map((DownloadableItem) => {
    const handleDownload = async() => {
      // Example: Create a promise that resolves to some file data
      if (DownloadableItem.filename == null) {
        return
      }
      FileDownload(ItemService.getItem({ requestBody: DownloadableItem }), DownloadableItem.filename)  
    }  
    return (
    <Flex
      flexDir="row"
      justifyContent="flex-start"
      mt={4}
      mb={4}
      p={6}
      w="full"
      h="fit-content"
      bgColor={bgColor}
      borderRadius={12}
      key={DownloadableItem.name}
    >
      <Box
        flexDir="column"
        justifyContent="flex-start"
        w="full"
      >
        <Text fontWeight="bold" fontSize={24}>
          <Icon as={FaMicrosoft} mr={2}/>
          {DownloadableItem.name}
        </Text>
        <Text fontWeight="bold">
          Version: {DownloadableItem.tag}
        </Text>
        <Text fontStyle="italic">
          {DownloadableItem.description}
        </Text>
      </Box>

      <Box
        justifyContent="flex-end"
        w="fit-content"
      >
        <Button 
          onClick={handleDownload}
          color="ui.light" 
          bgColor="ui.main" 
          _hover={{bg:color, color: bgColor, transition:"(background-color color) 300ms ease-in"}}>
          <Icon as={FaDownload} mr={2}></Icon>
          <Text>Download!</Text>
        </Button>
      </Box>
    </Flex>
  )}):
  (
    <Flex
      flexDir="row"
      justifyContent="flex-start"
      mt={4}
      mb={4}
      p={6}
      w="full"
      h="fit-content"
    >
      <Center>
        <Heading>
          No downloads available
        </Heading>
      </Center>
    </Flex>
  )

  return (
      <Box>{listItems}</Box>
  )
}

export const Route = createFileRoute("/_layout/downloads")({
  component: () => {
    const bgColor = useColorModeValue("ui.secondary", "ui.darkSlate")
    return (
      <>
        <Box
          top={0}
          position="sticky"
          p={3}
          w="full"
          display={{ base: "none", md: "flex" }}
          flexDir="column"
        >
          <Flex
            flexDir="column"
            justifyContent="flex-start"
            justify="space-between"
            p={6}
            w="full"
            h="fit-content"
            borderRadius={12}
            bgColor={bgColor}
          >
            <Box>
              <Heading>
                <Icon as={FaDownload} mr={2}></Icon>
                Downloads
              </Heading>
            </Box>
            <Text fontStyle="italic">Internal Software Repository - Tools</Text>
          </Flex>
          <Itemlist/>
        </Box>
        
      </>
    );
  },
});
