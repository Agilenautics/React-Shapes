import { MockedResponse,MockedProvider } from "@apollo/react-testing";
import { renderHook } from "@testing-library/react";
import { Children } from "react";
import Users from "../AdminPage/Users/Users";
import Projects from "../AdminPage/Projects/Projects";
import { ALL_USERS,DELETE_USER ,GET_USER,ADD_USER,GET_PROJECTS} from '../../gql';
export const AllUsers=()=>{
    allUsers:{
        userMocks:[{
            active:false,
           emailId: "anitha@agilenautics.com",
           hasProjects: [
                  {
                    id: "dfe6235e-1f22-4f56-b304-9762c860d0a3",
                    name: "Hotel Management(Demo)"
                  }]
        }]
    }
};
export const delUsers=()=>{
    deleteUsers: []
}
export const addUsers=()=>{
  //Add OPeration
  addUsers:{
    userMocks:[{
        active:false,
       emailId: "diya@gmail.com",
       hasProjects: [
              {
                id: "dfe6235e-1f22-4f56-b304-9762c860d0a3",
                name: "Hotel Management(Demo)"
              }]
    }]
}
}
export const ErrorMocks= ()=>{
  users: [{ 
     active:true,
       emailId:"irfan123@gmail.com",
       userName:"Irfan",
       id:"d3a43307-b133-4386-b129-a578f65eb829"
      }]}

      export const getProjectdataMocks=()=>{
        getProjects:{
          projects:[
            {
              "id": "6144eaeb-633b-4a2a-8740-5176a7b81c8f",
              "name": "Software Development",
              "description": "sample software ",
              "usersInProjects": [
                {
                  "emailId": "irfan123@gmail.com"
                }]}]
        }
      }


//Successfull Mock data of render hook
export const SuccessfullMockData:MockedResponse[]= [{
    request: {
      query: GET_USER ,
      variables:{
        emailId:"anitha@agilenautics.com"
      },
    },
    result: {
      data:AllUsers
  }}]

  export const DeleteMockData:MockedResponse[]= [{
    request: {
      query:DELETE_USER ,
      variables:{
        emailId:"sai123@gmail.com"
      },
    },
    result:{
      data:delUsers
    }
      
  }]

  export const ErrorMockData:MockedResponse[]= [{
    request: {
      query: ALL_USERS ,
    },
    error:new Error("Loading Error!"),
    result: {
      data:ErrorMocks
  }
}]
export const LoadingMockData:MockedResponse[]= [{
  request: {
    query: GET_USER ,
  },
  result: {
}}]
  export const AddUserMock:MockedResponse[]= [{
    request: {
      query:ADD_USER ,
      variables:{
           "active": true,
            "userType": "user",
            "emailId": "sai@gmail.com",
            "hasProjects": "project1"
          
        
      },
    },
    result:{
      data:addUsers
    },
      }]

  export const usersData=()=>{
    getUser:{
      users:
      [{
        active:false,
        id:'65022122-69f3-4cae-a342-329ede91a374',
       emailId: "sailakshmikrishnaraj0269@gmail.com",
       hasProjects: [
              {
                id: "dfe6235e-1f22-4f56-b304-9762c860d0a3",
                name: "Hotel Management(Demo)"
              }]
    }]
    }
  }
  
export const GetMockDataByUserId:MockedResponse[]= [{
    request: {
      query: GET_USER 
    },
    result:{data:usersData}
   }]

   export const GetProjectDataByname:MockedResponse[]= [{
    request:{
      query:GET_PROJECTS,
      variables:{
        name:"Software Development"
      }},
      result:{data:getProjectdataMocks}
   }]

export function getAlluserWrapper(MockData:MockedResponse[] = []){

    const wrapper=({children}:React.PropsWithChildren)=>(
        <MockedProvider mocks={MockData} addTypename={false} >{children}</MockedProvider>
    );
     const  {result}=renderHook(()=>Users(),{wrapper})
    return{
        result
    }
}
export function getAllProjectWrapper(MockData:MockedResponse[] = []){

  const wrapper=({children}:React.PropsWithChildren)=>(
      <MockedProvider mocks={MockData} addTypename={false} >{children}</MockedProvider>
  );
   const  {result}=renderHook(()=>Projects(),{wrapper})
  return{
      result
  }
}

