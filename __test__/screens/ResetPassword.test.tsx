import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ResetPasswordScreen from "@/screens/Login/ResetPasswordScreen"; // Update this path

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: () => ({
    auth: {
      updateUser: jest.fn(() => Promise.resolve({})), // Mock success response
    },
  }),
}));

test("shows error if passwords don't match", async () => {
  const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen />);

  fireEvent.changeText(getByPlaceholderText("New Password"), "password123");
  fireEvent.changeText(getByPlaceholderText("Confirm Password"), "password321");
  fireEvent.press(getByText("Reset Password"));

  await waitFor(() => {
    expect(getByText("Passwords don't match")).toBeTruthy();
  });
});

test("resets password successfully", async () => {
  const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen />);
  
  fireEvent.changeText(getByPlaceholderText("New Password"), "password123");
  fireEvent.changeText(getByPlaceholderText("Confirm Password"), "password123");
  fireEvent.press(getByText("Reset Password"));

  await waitFor(() => {
    expect(getByText("Password reset successfully!")).toBeTruthy();
  });
});
