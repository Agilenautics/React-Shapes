import { create } from "zustand";
import { Project } from "../Projects/projectStore";

interface User {
    id: string;
    name: string;
    emailId: string;
    userType: string;
    active: Boolean;
    userName: string;
    timeStamp: string
    hasProject: Project
}

export interface userState {
    usersList: Array<User>;
    user: Array<User>;
    updateUserList: (user: User) => void;
    deleteUserById: (id: string) => void,
    sortOrder: string,
    updateSortingOrder: (sort: string) => void,
    handleSorting: () => void;
    updateUser: (id: string, userType: string) => void;
    userType: string;
    updateUserType: (type: string) => void;
    accessLevel: string;
    updateAccessLevel: (accessType: string) => void;
    updateLoginUser: (user: User) => void
}

const userStore = create<userState>((set) => ({
    usersList: [],
    user: [],
    userType: '',
    updateLoginUser: (loginUser: any) =>
        set((state) => {
            const { hasProjects, ...userData } = loginUser[0]
            return { user: [userData] }
        })
    ,
    accessLevel: '',
    updateAccessLevel(accessType) {
        set((state) => {
            return { accessLevel: accessType }
        })
    },
    updateUserType: (type: string) =>
        set((state) => {

            return { userType: type }
        }),
    sortOrder: 'asc',
    updateUser: (id: string, userType: string) =>
        set((state) => {
            // const old_user = state.usersList.filter((values) => values.id === id)[0];
            // const to_be_update = {...old_user,userType}
            // const to_be_deleted = state.usersList.filter((values)=>values.id!==id)
            const updatedUserList = state.usersList.map((users) => {
                if (users['id'] == id) {
                    return { ...users, "userType": userType }
                }
                return users
            })
            return { usersList: updatedUserList }
        }),
    updateSortingOrder: (sortValue: string) =>
        set((state) => {
            return { sortOrder: sortValue }
        }),
    updateUserList: (user: any) =>
        set((state) => {
            return { usersList: user }
        }),
    deleteUserById: (id: string) =>
        set((state) => {
            const deletedUsers = state.usersList.filter((users) => users.id !== id)
            return { usersList: deletedUsers }
        }),
    handleSorting: () =>
        set((state) => {
            const sortedUsers = [...state.usersList].sort((a, b) => state.sortOrder === "asc" ? a.emailId.localeCompare(b.emailId) : b.emailId.localeCompare(a.emailId))
            return { usersList: sortedUsers }
        })
}))


export default userStore