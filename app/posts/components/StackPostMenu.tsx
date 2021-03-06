import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useDisclosure,
} from "@chakra-ui/react"
import { AlertDialogDelete } from "app/posts/components/AlertDialogDelete"
import { useClipboardAndToast } from "app/posts/hooks/useClipboardAndToast"
import React, { FunctionComponent } from "react"
import {
  FiClipboard,
  FiMoreHorizontal,
  FiShare,
  FiTrash2,
} from "react-icons/fi"

type Props = {
  isOwnPost: boolean
}

export const StackPostMenu: FunctionComponent<Props> = (props) => {
  const deleteDialogDisclosure = useDisclosure()

  const hasShareAPI = typeof navigator.share !== "undefined"

  const onShare = () => {
    if (hasShareAPI) {
      navigator.share({
        title: "Flitz",
        url: window.location.href,
      })
    }
  }

  const onCopy = useClipboardAndToast(
    typeof window !== "undefined" ? window.location.href : ""
  )

  return (
    <Stack>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiMoreHorizontal />}
          isRound
          size={"sm"}
          colorScheme={"gray"}
          variant={"ghost"}
          onClick={(event) => event.stopPropagation()}
        >
          {"Actions"}
        </MenuButton>
        <MenuList>
          {props.isOwnPost && (
            <MenuItem
              aria-label={"Delete"}
              icon={<FiTrash2 />}
              onClick={deleteDialogDisclosure.onOpen}
            >
              {"Delete"}
            </MenuItem>
          )}
          {hasShareAPI && (
            <MenuItem aria-label={"Share"} icon={<FiShare />} onClick={onShare}>
              {"Share"}
            </MenuItem>
          )}
          <MenuItem
            aria-label={"Copy link to clipboard"}
            icon={<FiClipboard />}
            onClick={onCopy}
          >
            {"Copy link to clipboard"}
          </MenuItem>
        </MenuList>
      </Menu>
      <AlertDialogDelete
        disclosure={deleteDialogDisclosure}
        onDelete={() => {
          deleteDialogDisclosure.onClose()
        }}
      />
    </Stack>
  )
}
