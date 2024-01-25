import React from 'react'
import { render, screen } from "@testing-library/react"
import { useRouter} from "next/router";
import '@testing-library/jest-dom/extend-expect';
import FinishSignIn from '../Authentication/SignInLink/finishSignIn';

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
  }));
  
  
  
describe("Fininsh Sign in Login Page",()=>{
    test("Renders Text Present in FinishSignIn",()=>{
    render(<FinishSignIn />)
     const textElement = screen.getByText("Complete Sign In");
        expect(textElement).toBeInTheDocument();
    })
  
});