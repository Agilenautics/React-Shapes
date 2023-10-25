import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from 'next/router'; 
import Login from './Login';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const mockRouter = {
  route: '/',
  pathname: '/',
  query: { projectId: 'some_value' },
  asPath: '/',
};

useRouter.mockReturnValue(mockRouter); 

describe("LoginTest", () => {
    it("Renders login page", () => {
      render(<Login />);
      const result = screen.getAllByText("WELCOME");
      console.log(result);
    });
});
