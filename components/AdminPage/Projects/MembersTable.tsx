import React from "react";
import { useTranslation } from "react-i18next";


interface MembersTableProps {
  details: {
    email: string;
    userType: string;
  }[];
}

const getNameFromEmail = (email: string) => {
  let regex = /[^a-z]/gi;
  const name = email.split("@")[0];
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  return formattedName.replace(regex, "");
};

const getInitials = (name: string) => {
  const nameArray = getNameFromEmail(name);
  const initials = [nameArray].map((name) => name.charAt(0)).join("");
  return initials;
};

export default function MembersTable({ details }: MembersTableProps) {
  const { t } = useTranslation(); // useTranslation hook

  return (
    <div className="relative">
      <div className="relative mr-4 mt-8 shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="text-md bg-gray-200 dark:bg-bgdarkcolor">
            <tr>
              <th scope="col" className="w-56 px-4 py-3 md:w-64 ">
                <div className="flex cursor-pointer items-center">{t("name")}</div>
              </th>
              <th scope="col" className="hidden px-4 py-3 md:table-cell">
                {t("email")}
              </th>
              <th scope="col" className="w-44 px-4 py-3">
                {t("usertype")}
              </th>
            </tr>
          </thead>
          <tbody>
            {details.map((user, index) => (
              <tr key={index} className="border-b bg-white dark:text-white dark:bg-slate-600">
                <td className="whitespace-nowrap px-4 py-4 font-medium">
                  <div className="flex w-56 items-center">
                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-sm font-semibold text-white">
                      {getInitials(user.email)}
                    </div>
                    {getNameFromEmail(user.email)}
                  </div>
                </td>
                <td className="hidden px-4 py-4 md:table-cell">{user.email}</td>
                <td className="px-4 py-4">{user.userType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
