import React from "react";
import { NodeHandlers } from "react-arborist";

type FormProps = { defaultValue: string } & NodeHandlers;


const  RenameFormForTreeStructur=({ defaultValue, submit, reset }: FormProps) =>{
  const inputProps = {
    defaultValue,
    autoFocus: true,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      submit(e.currentTarget.value);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          submit(e.currentTarget.value);
          break;
        case "Escape":
          reset();
          break;
      }
    },
  };

  return (
    <input
      className="rounded-lg bg-blue-100 text-lg dark:bg-blue-400"
      type="text"
      {...inputProps}
    />
  );
}


export default RenameFormForTreeStructur
