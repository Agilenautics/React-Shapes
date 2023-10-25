import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Login from './Login'

describe("LoginTest", () => {
    it("Renders login page", () => {
      render(<Login />);
       const result = screen.getAllByText("WELCOME");
       console.log(result)
    });
  });