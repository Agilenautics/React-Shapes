import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Login from "./Login";

jest.mock("firebase/auth", () => {
  const signInWithEmailAndPasswordMock = jest.fn();
  return {
    ...jest.requireActual("firebase/auth"),
    getAuth: jest.fn(() => ({
      signInWithEmailAndPassword: signInWithEmailAndPasswordMock,
    })),
    auth: {
      ...jest.requireActual("firebase/auth").auth,
      signInWithEmailAndPassword: signInWithEmailAndPasswordMock,
    },
  };
});

describe("Login component", () => {
  it('displays "Invalid credentials" message when authentication fails', async () => {
    // Arrange
    const errorMessage = "Invalid email or password";

    signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-credentials",
      message: errorMessage,
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    // Act
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(
          "Invalid credentials. Check your email and password and try again."
        )
      ).toBeInTheDocument();
    });
  });
});
