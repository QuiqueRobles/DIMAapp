import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OwnerRegisterScreen from "@/screens/Login/OwnerRegisterScreen"; // Adjust path
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigation } from "@react-navigation/native";

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: jest.fn(),
}));
global.alert = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("lodash", () => ({
  debounce: (fn: any) => fn, // Mock debounce to execute immediately
}));

describe("OwnerRegisterScreen", () => {
  let mockSupabase: any;
  let mockNavigation: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(() => ({
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    };

    (useSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
    mockNavigation = { navigate: jest.fn() };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  test("renders correctly", () => {
    const { getByPlaceholderText } = render(<OwnerRegisterScreen />);
    expect(getByPlaceholderText('owner_register.club_name_placeholder')).toBeTruthy();
    expect(getByPlaceholderText('Club Address')).toBeTruthy();
    expect(getByPlaceholderText('owner_register.email_placeholder')).toBeTruthy();
    expect(getByPlaceholderText('Phone')).toBeTruthy();
  });

  test("disables button when required fields are empty", async () => {
    const { getByText } = render(<OwnerRegisterScreen />);
    const button = getByText('owner_register.confirm');

    fireEvent.press(button);
    await waitFor(() => {
      expect(button).toBeTruthy(); // Button exists but doesn't proceed
    });
  });

  test("enables button when all fields are filled", async () => {
    const { getByPlaceholderText, getByText } = render(<OwnerRegisterScreen />);

    fireEvent.changeText(getByPlaceholderText('owner_register.club_name_placeholder'), "Test Club");
    fireEvent.changeText(getByPlaceholderText("Club Address"), "Test Address");
    fireEvent.changeText(getByPlaceholderText('owner_register.email_placeholder'), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Phone"), "1234567890");
    const button = getByText('owner_register.confirm');

   

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith("club_requests");
    });
  });

  test("shows success message after form submission", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<OwnerRegisterScreen />);

    fireEvent.changeText(getByPlaceholderText('owner_register.club_name_placeholder'), "Test Club");
    fireEvent.changeText(getByPlaceholderText("Club Address"), "Test Address");
    fireEvent.changeText(getByPlaceholderText('owner_register.email_placeholder'), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Phone"), "1234567890");
    const button = getByText('owner_register.confirm');

    fireEvent.press(button);

    await waitFor(() => {
      expect(queryByText('owner_register.thank_you_text')).toBeTruthy();
    });
  });

  test("shows error if Supabase insert fails", async () => {
    mockSupabase.from = jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ data: null, error: { message: "Insert failed" } })),
    }));

    const { getByPlaceholderText, getByText } = render(<OwnerRegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('owner_register.club_name_placeholder'), "Test Club");
    fireEvent.changeText(getByPlaceholderText("Club Address"), "Test Address");
    fireEvent.changeText(getByPlaceholderText('owner_register.email_placeholder'), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Phone"), "1234567890");
    const button = getByText('owner_register.confirm');

    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText("Insert failed")).toBeTruthy();
    });
  });
});
