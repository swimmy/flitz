import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react"
import updateAccountPassword from "app/settings/mutations/updateAccountPassword"
import { useMutation } from "blitz"
import React, { FunctionComponent } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

export const SettingsPagePassword: FunctionComponent = () => {
  const { t } = useTranslation()

  const toast = useToast()

  const [updatePasswordMutation, { isLoading }] = useMutation(
    updateAccountPassword
  )

  const onUpdatePassword = async () => {
    const values = getValues()
    try {
      await updatePasswordMutation({
        currentPassword: values.currentPassword,
        password: values.password,
      })
      toast({ description: t`Changes have bee saved`, status: "success" })
    } catch (err) {
      toast({ status: "error", title: err.message })
    }
  }

  const { handleSubmit, errors, register, getValues } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      currentPassword: "",
      password: "",
    },
  })

  return (
    <Stack spacing={8} px={4}>
      <Heading size={"lg"}>{"Password"}</Heading>
      <FormControl>
        <FormLabel>{t`Current Password`}</FormLabel>
        <HStack spacing={4}>
          <Input
            aria-label={t`Current Password`}
            isDisabled={isLoading}
            name={"currentPassword"}
            ref={register({})}
            type={"password"}
          />
        </HStack>
        <FormErrorMessage>
          {errors.currentPassword && errors.currentPassword.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>{t`New Password`}</FormLabel>
        <HStack spacing={4}>
          <Input
            aria-label={t`New Password`}
            isDisabled={isLoading}
            name={"password"}
            ref={register({})}
            type={"password"}
          />
          <Button
            isLoading={isLoading}
            loadingText={t`Change`}
            onClick={handleSubmit(onUpdatePassword)}
          >
            {t`Change`}
          </Button>
        </HStack>
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}
