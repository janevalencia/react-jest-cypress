import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionCreateStepTwo from "components/TransactionCreateStepTwo";

/**
 * Integration tests is a way of testing multiple components interaction at once.
 * For example, here we are testing the user flow of creating a Transaction by
 * 1. Asserting the PAY button should be disabled on first startup of the Transaction Create form.
 * 2. Asserting that the PAY button be enabled once amount and note are filled in.
 */
test("Verify the PAY button before and after amount & note are filled in.", async () => {
  // Arrange: Rendering the component to be tested.
  render(<TransactionCreateStepTwo sender={{ id: "5" }} receiver={{ id: "5" }} />);

  // Assertion 1: Before the amount and note are filled in, PAY button should be disabled.
  expect(await screen.findByRole("button", { name: /pay/i })).toBeDisabled();

  // Action: User inputs amount
  userEvent.type(screen.getByPlaceholderText(/amount/i), "50");

  // Action: User inputs note
  userEvent.type(screen.getByPlaceholderText(/add a note/i), "Test PAY button activated.");

  // Assertion 2: After the amount and note are filled in, PAY button should be enabled.
  expect(await screen.findByRole("button", { name: /pay/i })).toBeEnabled();
});
