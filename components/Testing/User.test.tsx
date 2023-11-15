import React from "react";
import { useRouter } from "next/router";
import "@testing-library/jest-dom/extend-expect";
import Users from "../AdminPage/Users/Users";
import { MockedProvider, wait } from "@apollo/react-testing";
import { ALL_USERS, DELETE_USER, ADD_USER, } from "../../gql";
import userEvent from "@testing-library/user-event";
import {
  AllUsers,
  usersData,
  getAlluserWrapper,
  SuccessfullMockData,
  DeleteMockData,
  delUsers,
  GetMockDataByUserId,
  ErrorMockData,
  LoadingMockData
} from "./AllUser";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const Mocks = [
  {
    request: {
      query: ALL_USERS,
    },
    result: {
      data: {
        users: {
          active: "true",
          emailId: "irfan123@gmail.com",
          userName: "Irfan",
          id: "d3a43307-b133-4386-b129-a578f65eb829",
        },
      },
    },
  },
];

describe("Testing a Users Page", () => {
  afterEach(cleanup);
  test("Renders a Users Page with ClassName", () => {
    const { container } = render(
      <MockedProvider>
        <Users />
      </MockedProvider>
    );
waitFor(async()=>{
    container.querySelector("py-4 text-2xl font-semibold");
   await  expect(container).toBeDefined();})
  });

  test("Renders a  UserPage", async () => {
    render(
      <MockedProvider>
        <Users />
      </MockedProvider>
    );
  });

  test("Test a LoadingIcon is present in UserPage",  () => {
    const Mocks = [
      {
        request: {
          query: ALL_USERS,
        },
        result: {
          data: {
            users: {
              active: "true",
              emailId: "irfan123@gmail.com",
              userName: "Irfan",
              id: "d3a43307-b133-4386-b129-a578f65eb829",
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={Mocks}>
        <Users />
      </MockedProvider>
    );
    waitFor(async()=>{
    expect(await screen.findByTestId("Icontest1")).toBeInTheDocument();});
  });

  describe("Graphql Data", () => {
    const { result } = getAlluserWrapper(SuccessfullMockData);
    it("should be defined and return correct data", () => {
      expect(result).toBeDefined();
      waitFor(async () => {
        await expect(result.current).toEqual({
          loading: false,
          data: AllUsers,
          error: undefined,
        });
      });
    });
  });
  describe("GetQuery", () => {
    const { result } = getAlluserWrapper(GetMockDataByUserId);
    test("User ID is present in the GraphQL query result", () => {
      expect(result).toBeDefined();
      waitFor(async () => {
        await expect(result.current).toEqual({
          data: usersData,
        });
      });
    });
  });

  describe("Delete Graphql Data", () => {
    const { result } = getAlluserWrapper(DeleteMockData);
    it("should pass emailId to validate delete the record", () => {
      waitFor(async () => {
        await expect(result.current).toEqual({
          data: delUsers,
        });
        await expect(screen.getByTestId("delTestIcon")).toBeInTheDocument();
      });
    });
  });
  
  describe("error in UserPage",()=>{
    const { result } = getAlluserWrapper(ErrorMockData);
       it("Renders a  error message using  query in users component",()=>{  
        waitFor(async()=>{
          expect(result).toBeDefined();
         expect(await screen.findByText("LoadingError!")).toBeInTheDocument();
      });
    })      
     });  
     describe("Loading in UserPage",()=>{
      const { result } = getAlluserWrapper(LoadingMockData);
      it("Renders  loading icon while waiting for GraphQL query",()=>{  
          waitFor(async()=>{
            const LoadingIcon=await screen.findByTestId("Icontest1");
            expect(result).toBeDefined();
           expect(LoadingIcon).toBeInTheDocument();
        });
      });       
       });
       


});
