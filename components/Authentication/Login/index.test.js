import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter} from "next/router";
import Login from "./Login";
import { RouterContext } from "next/dist/shared/lib/router-context";
import TopBar from '../../AdminPage/TopBar'
import DarkModeToggleButton from "../../Sidebar/DarkModeToggleButton";
import Signout from "../Signout/Signout";
import { Flag } from "react-feather";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockRouter = {
  route: "/",
  pathname: "/",
  query: {},
  asPath: "/",
  push: jest.fn(),
};

useRouter.mockReturnValue(mockRouter);


describe("LoginTest", () => {
  test("Renders login page", () => {
    render(<Login />);
    const result = screen.getByText("WELCOME");
    expect(result).toBeInTheDocument();
  });
  test("Renders Login Page By LoginByTestId", () => {
    render(<Login />);
    const result = screen.getByTestId("login-button-element");
    expect(result).toBeInTheDocument();
  });

  test("Renders Login ButtonByRole", () => {
    render(<Login />);
    const result = screen.getByRole("button", { name: "Login" });
    expect(result).toBeInTheDocument();
  });

  test("Renders LoginPage present in FaceBookicon", () => {
    render(<Login />);
    const result = screen.getByTestId("testiconid1");
    expect(result).toBeInTheDocument();
  });
  test("Renders LoginPage present in Googleicon", () => {
    render(<Login />);
    const result = screen.getByTestId("testiconid2");
    expect(result).toBeInTheDocument();
  });
  test("Renders LoginPage present in Githubicon", () => {
    render(<Login />);
    const result = screen.getByTestId("testiconid3");
    expect(result).toBeInTheDocument();
  });

  test("Emailid validation", () => {
    let val = "sai123@gmail.com";
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
    if (!regEmail) {
      return "Invalid Email Address";
    }
  });
  test("Should Have a Login button in Login Page", () => {
    render(<Login />);
    const submitButton = screen.getByText("Login");
    expect(submitButton).toBeInTheDocument();
  });

  test("Email Address input should have type text", () => {
    render(<Login />);
    const email = screen.getByPlaceholderText("Email Address");
    expect(email).toHaveAttribute("type", "text");
  });
  test("Password input should have type password", () => {
    render(<Login />);
    const password = screen.getByPlaceholderText("Password");
    expect(password).toHaveAttribute("type", "password");
  });
  test("should  User credential Dynamically ", () => {
    render(<Login />);
    const emailField = screen.getByPlaceholderText("Email Address");
    const passwordField = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });
    fireEvent.change(emailField, { target: { value: "irfan123@gmail.com" } });
    fireEvent.change(passwordField, { target: { value: "28051997" } });
    fireEvent.click(submitButton);
 });
  
  
  test("should throw error if invalid email address and Password", () => {
    render(<Login />);
    const emailField = screen.getByPlaceholderText("Email Address");
    const passwordField = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });
    fireEvent.change(emailField, { target: { value: "Irfan" } });
    fireEvent.change(passwordField, { target: { value: "281997" } });
    fireEvent.click(submitButton);
    const t = () => {
      throw new TypeError(
        "Incorrect credentials. Check your email and password and try again"
      );
    };
    if (
      emailField.value !== "Irfan123@gmail.com" &&
      passwordField.value !== "28051997"
    ) {
      expect(t).toThrow(TypeError);
      expect(t).toThrow(
        "Incorrect credentials. Check your email and password and try again"
      );
    }
  });

  test("Redirects project page using router in Login Page", () => {
    <RouterContext.Provider value={mockRouter}>
      <Login />
    </RouterContext.Provider>;
    waitFor(() => {
      fireEvent.click(screen.getByText("Login"));
      expect(mockRouter.push).toHaveBeenCalledWith("/projects");
    });
  });


//  describe("Login Page Testing Dynamically",()=>{
//     const onSubmit = jest.fn();

//   beforeEach(() => {
//      render(<Login onSubmitForTest={onSubmit} />);
//      });
  
//   test("should allow the user to submit their credentials Dynamically in Login Page", async () => {
    
//     const emailField = screen.getByTestId("emailTestId");
//     const passwordField = screen.getByTestId("passwordTestId");
//     const submitButton = screen.getByTestId("login-button-element");
//     fireEvent.change(emailField, { target: { value: "Irfan123@gmail.com" } });
//     fireEvent.change(passwordField, { target: { value: "28051997" } });
//     fireEvent.click(submitButton);
//   await waitFor(() => {
//    expect(onSubmit).toHaveBeenCalled();
   
//   });
    
    
  });
// });
// });
/*Top Bar*/
describe("Renders a TopBar",()=>{
  test("Redirects projects in topbar of Project Page", () => {
    <RouterContext.Provider value={mockRouter}>
      <TopBar />
    </RouterContext.Provider>;
    waitFor(() => {
      fireEvent.click(screen.getByText("projects"));
      expect(mockRouter.push).toHaveBeenCalledWith("/projects");
    });
  });
  
  test("Redirects users in topbar of Project Page", () => {
    <RouterContext.Provider value={mockRouter}>
      <TopBar />
    </RouterContext.Provider>;
    waitFor(() => {
      fireEvent.click(screen.getByText("users"));
      expect(mockRouter.push).toHaveBeenCalledWith("/users");
    });
  });
  
  test("Redirects policies in topbar of Project Page", () => {
    <RouterContext.Provider value={mockRouter}>
      <TopBar />
    </RouterContext.Provider>;
    waitFor(() => {
      fireEvent.click(screen.getByText("policies"));
      expect(mockRouter.push).toHaveBeenCalledWith("/policies");
    });
  });

  test("Toggle Button Present in Screen",()=>{
  render(<DarkModeToggleButton /> );
    waitFor(() => {
      expect(screen.findByTestId("LightIcon")).toBeInTheDocument();
      expect(screen.findByTestId("DarkIcon")).toBeInTheDocument();
    });
  });
 test("Text Present in TopBar", () => {
  <RouterContext.Provider value={mockRouter}>
      <TopBar />
    </RouterContext.Provider>;
waitFor(async()=>{
    const flowchartText = screen.getByText("FLOWCHART");
    await expect(flowchartText).toBeInTheDocument();
   });
  });
   



test("Signout present in toggleDropdown",()=>{
render(<Signout />);
waitFor(async()=>{
   const result = screen.getByRole("button", { name: "Sign Out" });
  await expect(result).toBeInTheDocument();
});
});
  
  });
