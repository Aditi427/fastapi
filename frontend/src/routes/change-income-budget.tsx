// ChangeIncomeBudget.tsx

import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react"

import { createFileRoute } from "@tanstack/react-router"

import { useForm, type SubmitHandler } from "react-hook-form"

import { FiDollarSign, FiTarget } from "react-icons/fi"

import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"

interface ChangeIncomeBudgetForm {
  monthly_income: number
  budget: number
}

export const Route = createFileRoute("/change-income-budget")({
  component: ChangeIncomeBudget,
})

function ChangeIncomeBudget() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangeIncomeBudgetForm>({
    defaultValues: {
      monthly_income: 0,
      budget: 0,
    },
  })

  const onSubmit: SubmitHandler<ChangeIncomeBudgetForm> = async (data) => {
    console.log(data)

    // API call here
    // await updateIncomeBudget(data)
  }

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bg={{
        base: "#0A0A0B",
        _light: "#F6F0FF",
      }}
      px={4}
    >
      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        maxW="lg"
        bg={{
          base: "#151518",
          _light: "white",
        }}
        p={10}
        rounded="3xl"
        border="1px solid"
        borderColor={{
          base: "gray.800",
          _light: "#E9DDFC",
        }}
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
          Update Income & Budget
        </Text>

        <Text
          mb={8}
          color={{
            base: "gray.400",
            _light: "#8B5CF6",
          }}
        >
          Manage your financial limits and monthly income.
        </Text>

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
              placeholder="Enter monthly income"
              bg={{
                base: "#242429",
                _light: "#F5F3FF",
              }}
              border="none"
              color={{
                base: "white",
                _light: "#4C1D95",
              }}
              _focusVisible={{
                borderColor: "#8B5CF6",
                boxShadow: "0 0 0 1px #8B5CF6",
              }}
              {...register("monthly_income", {
                required: "Monthly income is required",
                valueAsNumber: true,
              })}
            />
          </InputGroup>
        </Field>

        {/* Budget */}
        <Field
          mt={6}
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
              placeholder="Enter monthly budget"
              bg={{
                base: "#242429",
                _light: "#F5F3FF",
              }}
              border="none"
              color={{
                base: "white",
                _light: "#4C1D95",
              }}
              _focusVisible={{
                borderColor: "#8B5CF6",
                boxShadow: "0 0 0 1px #8B5CF6",
              }}
              {...register("budget", {
                required: "Budget is required",
                valueAsNumber: true,
              })}
            />
          </InputGroup>
        </Field>

        <Button
          type="submit"
          loading={isSubmitting}
          w="100%"
          mt={8}
          bg="#8B5CF6"
          color="white"
          rounded="2xl"
          _hover={{
            bg: "#7C3AED",
            transform: "translateY(-2px)",
          }}
          transition="0.3s"
        >
          Save Changes
        </Button>
      </Container>
    </Flex>
  )
}

export default ChangeIncomeBudget