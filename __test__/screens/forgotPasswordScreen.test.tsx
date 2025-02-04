// import React from "react";
// import { render, fireEvent, waitFor } from "@testing-library/react-native";
// import ForgotPasswordScreen from "@/screens/Login/ForgotPassword"; // Update this path
// import { useNavigation } from "@react-navigation/native";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";

// jest.mock("@supabase/auth-helpers-react", () => ({
//   useSupabaseClient: () => ({
//     auth: {
//       resetPasswordForEmail: jest.fn(async (email) => {
//         if (!email.includes("@")) {
//           throw new Error("Invalid email format");
//         }
//         return {}; // Simulate success response
//       }),
//     },
//   }),
// }));

// jest.mock("@react-navigation/native", () => ({
//   useNavigation: () => ({
//     navigate: jest.fn(),
//   }),
// }));

// describe("ForgotPasswordScreen", () => {
//   it("renders correctly", () => {
//     const { getByPlaceholderText, getByTestId,getByText} = render(<ForgotPasswordScreen />);

//     expect(getByPlaceholderText("Email")).toBeTruthy();
//     expect(getByTestId("Reset Password")).toBeTruthy();
//   });

//   it("displays an error when an invalid email is entered", async () => {
//     const { getByPlaceholderText, getByTestId, getByText} = render(<ForgotPasswordScreen />);
    
//     fireEvent.changeText(getByPlaceholderText("Email"), "invalid-email");
//     fireEvent.press(getByTestId("Reset Password"));

//     await waitFor(() => {
//       expect(getByText("Invalid email format")).toBeTruthy();
//     });
//   });

//   it("sends a password reset email and navigates to Login", async () => {
//     const { getByPlaceholderText, getByTestId, getByText } = render(<ForgotPasswordScreen />);
    
//     fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
//     fireEvent.press(getByTestId("reset-password-button")); // Use testID instead of text search
  
//     await waitFor(() => {
//       expect(getByText("Password reset email sent. Check your inbox.")).toBeTruthy();
//     });
//   });
// });

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ForgotPasswordScreen from "@/screens/Login/ForgotPassword"; // Update this path
import { useNavigation } from "@react-navigation/native";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
  global.alert=jest.fn()
 

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: () => ({
    auth: {
      resetPasswordForEmail: jest.fn(async (email) => {
        if (!email.includes("@")) {
          throw new Error("Invalid email format");
        }
        return {}; // Simulate success response
      }),
    },
  }),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe("ForgotPasswordScreen", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText, getByTestId,getByText} = render(<ForgotPasswordScreen />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByTestId("reset-password-button")).toBeTruthy();
  });

  it("displays an error when an invalid email is entered", async () => {
    const { getByPlaceholderText, getByTestId, getByText} = render(<ForgotPasswordScreen />);
    
    fireEvent.changeText(getByPlaceholderText("Email"), "invalid-email");
    fireEvent.press((getByTestId("reset-password-button")));

    await waitFor(() => expect(alert).toHaveBeenCalledWith("Invalid email format"))
    });

  it("sends a password reset email and navigates to Login", async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<ForgotPasswordScreen />);
    
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.press(getByTestId("reset-password-button")); // Use testID instead of text search
  
    await waitFor(() => expect(alert).toHaveBeenCalledWith("Password reset email sent. Check your inbox."))
    });
  });
