import { Container, Flex, Image, Input, Text } from "@chakra-ui/react"

import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"

import { type SubmitHandler, useForm } from "react-hook-form"

import { FiLock, FiMail } from "react-icons/fi"

import type { Body_login_login_access_token as AccessToken } from "@/client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"

import useAuth, { isLoggedIn } from "@/hooks/useAuth"


import { emailPattern, passwordRules } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,

  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  const { loginMutation, error, resetError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",

    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // handled in hook
    }
  }

  return (
    <Flex
      justify="center"
      align="center"
      h="100vh"
      bg={{
        base: "#0A0A0B",
        _light: "#F6F0FF",
      }}
      px={4}
    >
      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        maxW="md"
        alignItems="stretch"
        justifyContent="center"
        gap={5}
        centerContent
        bg={{
          base: "#151518",
          _light: "white",
        }}
        rounded="3xl"
        border="1px solid"
        borderColor={{
          base: "gray.800",
          _light: "#E9DDFC",
        }}
        p={10}
        shadow="2xl"
      >
      

        <Text
          fontSize="3xl"
          fontWeight="extrabold"
          mb={2}
          color={{
            base: "white",
            _light: "#6D28D9",
          }}
        >
          Welcome Back
        </Text>

        <Text
          mb={4}
          color={{
            base: "gray.400",
            _light: "#8B5CF6",
          }}
        >
          Log in to continue managing your expenses.
        </Text>

        <Field
          invalid={!!errors.username}
          errorText={errors.username?.message || !!error}
        >
          <InputGroup
            w="100%"
            startElement={<FiMail color="#8B5CF6" />}
          >
            <Input
              bg={{
                base: "#242429",
                _light: "#F5F3FF",
              }}
              border="none"
              color={{
                base: "white",
                _light: "#4C1D95",
              }}
              _placeholder={{
                color: "gray.500",
              }}
              _focusVisible={{
                borderColor: "#8B5CF6",
                boxShadow: "0 0 0 1px #8B5CF6",
              }}
              {...register("username", {
                required: "Username is required",
                pattern: emailPattern,
              })}
              placeholder="Email"
              type="email"
            />
          </InputGroup>
        </Field>

        <PasswordInput
          type="password"
          startElement={<FiLock color="#8B5CF6" />}
          {...register("password", passwordRules())}
          placeholder="Password"
          errors={errors}
        />

        <RouterLink
          to="/recover-password"
          className="main-link"
        >
          Forgot Password?
        </RouterLink>

        <Button
          variant="solid"
          type="submit"
          loading={isSubmitting}
          size="md"
          w="100%"
          bg="#8B5CF6"
          color="white"
          rounded="2xl"
          _hover={{
            bg: "#7C3AED",
            transform: "translateY(-2px)",
          }}
          transition="0.3s"
        >
          Log In
        </Button>

        <Text
          mt={2}
          color={{
            base: "gray.400",
            _light: "#7C3AED",
          }}
        >
          Don't have an account?{" "}
          <RouterLink
            to="/signup"
            className="main-link"
          >
            Sign Up
          </RouterLink>
        </Text>
      </Container>
    </Flex>
  )
}