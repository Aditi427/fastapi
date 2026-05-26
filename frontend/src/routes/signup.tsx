import { Container, Flex, Input, Text } from "@chakra-ui/react"

import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"

import { type SubmitHandler, useForm } from "react-hook-form"

import { FiDollarSign, FiLock, FiTarget, FiUser } from "react-icons/fi"

import type { UserRegister } from "@/client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"

import useAuth, { isLoggedIn } from "@/hooks/useAuth"

import {
  confirmPasswordRules,
  emailPattern,
  passwordRules,
} from "@/utils"

export const Route = createFileRoute("/signup")({
  component: SignUp,

  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

interface UserRegisterForm extends UserRegister {
  confirm_password: string
  monthly_income: number
  budget: number
}

function SignUp() {
  const { signUpMutation } = useAuth()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",

    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      monthly_income: 0,
      budget: 0,
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    signUpMutation.mutate(data)
  }

  return (
    <Flex
      flexDir={{ base: "column", md: "row" }}
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
          fontSize="4xl"
          fontWeight="extrabold"
          bgGradient="linear(to-r, #8B5CF6, #C084FC)"
          bgClip="text"
          mb={2}
        >
          ExpenseTracker
        </Text>

        <Text
          fontSize="3xl"
          fontWeight="extrabold"
          mb={2}
          color={{
            base: "white",
            _light: "#6D28D9",
          }}
        >
          Create Account
        </Text>

        <Text
          mb={4}
          color={{
            base: "gray.400",
            _light: "#8B5CF6",
          }}
        >
          Start tracking your expenses smarter.
        </Text>

        {/* Full Name */}
        <Field
          invalid={!!errors.full_name}
          errorText={errors.full_name?.message}
        >
          <Text
            mb={2}
            color={{
              base: "gray.300",
              _light: "#7C3AED",
            }}
          >
            Full Name
          </Text>

          <InputGroup w="100%" startElement={<FiUser color="#8B5CF6" />}>
            <Input
              minLength={3}
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
              {...register("full_name", {
                required: "Full Name is required",
              })}
              placeholder="Enter your full name"
              type="text"
            />
          </InputGroup>
        </Field>

        {/* Email */}
        <Field
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          <Text
            mb={2}
            color={{
              base: "gray.300",
              _light: "#7C3AED",
            }}
          >
            Email
          </Text>

          <InputGroup w="100%" startElement={<FiUser color="#8B5CF6" />}>
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
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              placeholder="Enter your email"
              type="email"
            />
          </InputGroup>
        </Field>

        {/* Password */}
        <Field>
          <Text
            mb={2}
            color={{
              base: "gray.300",
              _light: "#7C3AED",
            }}
          >
            Password
          </Text>

          <PasswordInput
            type="password"
            startElement={<FiLock color="#8B5CF6" />}
            {...register("password", passwordRules())}
            placeholder="Enter your password"
            errors={errors}
          />
        </Field>

        {/* Confirm Password */}
        <Field>
          <Text
            mb={2}
            color={{
              base: "gray.300",
              _light: "#7C3AED",
            }}
          >
            Confirm Password
          </Text>

          <PasswordInput
            type="password"
            startElement={<FiLock color="#8B5CF6" />}
            {...register(
              "confirm_password",
              confirmPasswordRules(getValues),
            )}
            placeholder="Confirm your password"
            errors={errors}
          />
        </Field>

        {/* Monthly Income */}
        <Field
          invalid={!!errors.monthly_income}
          errorText={errors.monthly_income?.message}
        >
          <Text
            mb={2}
            color={{
              base: "gray.300",
              _light: "#7C3AED",
            }}
          >
            Monthly Income
          </Text>

          <InputGroup
            w="100%"
            startElement={<FiDollarSign color="#8B5CF6" />}
          >
            <Input
              type="number"
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
              {...register("monthly_income", {
                required: "Monthly income is required",
                valueAsNumber: true,
              })}
              placeholder="Enter your monthly income"
            />
          </InputGroup>
        </Field>

        {/* Budget Field */}
        <Field
          invalid={!!errors.budget}
          errorText={errors.budget?.message}
        >
          <Text
            mb={2}
            color={{
              base: "gray.300",
              _light: "#7C3AED",
            }}
          >
            Monthly Budget
          </Text>

          <InputGroup
            w="100%"
            startElement={<FiTarget color="#8B5CF6" />}
          >
            <Input
              type="number"
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
              {...register("budget", {
                required: "Budget is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Budget must be greater than or equal to 0",
                },
              })}
              placeholder="Enter your monthly budget"
            />
          </InputGroup>
        </Field>

        <Button
          variant="solid"
          type="submit"
          loading={isSubmitting}
          w="100%"
          mt={2}
          bg="#8B5CF6"
          color="white"
          rounded="2xl"
          _hover={{
            bg: "#7C3AED",
            transform: "translateY(-2px)",
          }}
          transition="0.3s"
        >
          Sign Up
        </Button>

        <Text
          mt={2}
          color={{
            base: "gray.400",
            _light: "#7C3AED",
          }}
        >
          Already have an account?{" "}
          <RouterLink
            to="/login"
            className="main-link"
          >
            Log In
          </RouterLink>
        </Text>
      </Container>
    </Flex>
  )
}

export default SignUp