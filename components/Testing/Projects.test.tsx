import React from "react";
//import { useRouter } from "next/router";
import "@testing-library/jest-dom/extend-expect";
import Projects from "../AdminPage/Projects/Projects";
import { MockedProvider, wait } from "@apollo/react-testing";
import userEvent from "@testing-library/user-event";
import {GetProjectDataByname,getProjectdataMocks,getAllProjectWrapper} from "./AllUser";
import {render,screen,fireEvent,waitFor,cleanup,} from "@testing-library/react";
// jest.mock("next/router", () => ({
//   useRouter: jest.fn(),
// }));

describe("GetProject Graphql Data", () => {
    const { result } = getAllProjectWrapper(GetProjectDataByname);
    it("should pass Project name to validate  the record using Graphql Query", () => {
      waitFor(async () => {
        await expect(result.current).toEqual({
          data: getProjectdataMocks,
        });
        
      });
    });
  });