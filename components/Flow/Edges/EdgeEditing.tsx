import React, { useState } from "react";
import { colors } from "../edgeNodeColor";
import { FaCheck } from "react-icons/fa";
import { GET_NODES, UPDATE_EDGE, updateEdgeBackend } from "../../../gql";
import { Edge, updateEdge } from "reactflow";
import fileStore from "../../TreeView/fileStore";
import { event } from "jquery";
interface EdgeEditingProps {
  id: string;
  labelX: number;
  labelY: number;
  data: any;
  editing: any;
  setEditing: any;
  setEdgeData: any;
}

const EdgeEditing: React.FC<EdgeEditingProps> = ({
  id,
  labelX,
  labelY,
  data,
  editing,
  setEditing,
  setEdgeData,
}) => {
  const { Id } = fileStore();
  // const [edgeLabel, setEdgeLabel] = useState<string>(data.label);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdgeData({
      ...data,
      label: e.target.value,
    });
  };
  const handleUpdateEdge = async (
    e: any,
    id: string,
    edgeData: string | boolean
  ) => {
    e.preventDefault();
    let updatedEdgeData = {
      ...data,
      id,
    };
    switch (editing.type) {
      case "label":
        await updateEdgeBackend(UPDATE_EDGE, updatedEdgeData, GET_NODES, Id);
        break;
      // await updateEdgeBackend(Id,id,"LABEL",{label:edgeLabel});
      case "arrows":
        updatedEdgeData.bidirectional = edgeData;
        await updateEdgeBackend(UPDATE_EDGE, updatedEdgeData, GET_NODES, Id);
        setEdgeData({
          ...updatedEdgeData,
          bidirectional: edgeData,
        });
        // await updateEdgeBackend(UPDATE_EDGE, data, GET_NODES, Id);
        break;
      case "colors":
        updatedEdgeData.pathCSS = edgeData;
        await updateEdgeBackend(UPDATE_EDGE, updatedEdgeData, GET_NODES, Id);
        setEdgeData({
          ...data,
          pathCSS: edgeData,
        });

        break;
      default:
    }
    setEditing({
      ...editing,
      active: false,
      type: "",
    });
    // await updateEdgeBackend(UPDATE_EDGE, updatedEdgeData, GET_NODES, Id);
  };

  switch (editing.type) {
    case "colors":
      return (
        <>
          <div className="grid -translate-y-5 grid-cols-5 gap-2 rounded border border-[#C0D5E7] bg-white px-4 py-2 shadow-md">
            {colors.map((color: string, index: number) => {
              return (
                <div
                  onClick={(e) => handleUpdateEdge(e, id, color)}
                  key={index}
                  style={{ backgroundColor: color }}
                  className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded-full`}
                >
                  {data.pathCSS === color && (
                    <FaCheck
                      size={8}
                      style={{
                        color: "#fff",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    case "arrows":
      return (
        <div className="flex w-[80px] items-center justify-between gap-2 rounded border border-[#C0D5E7] bg-white p-2 shadow-md">
          <button
            className="h-2.5 w-2.5"
            onClick={(e) => handleUpdateEdge(e, id, false)}
          >
            <img src="\assets\editingEdgeIcons\Right.svg" alt="edgedirection" />
          </button>
          <button className="h-2.5 w-2.5 rotate-180">
            <img src="\assets\editingEdgeIcons\Right.svg" alt="edgedirection" />
          </button>
          <button
            className="h-2.5 w-2.5"
            onClick={(e) => handleUpdateEdge(e, id, true)}
          >
            <img
              src="\assets\editingEdgeIcons\Bidirectional.svg"
              alt="edgedirection"
            />
          </button>
        </div>
      );
    case "label":
      return (
        <form
          autoComplete="off"
          className="flex items-center justify-center"
          onSubmit={(e) => handleUpdateEdge(e, id, data.label)}
        >
          <input
            style={{
              borderColor: `${data.pathCSS}`,
            }}
            className={`w-11 rounded-[30px] border bg-white text-center text-[7px] outline-0`}
            type="text"
            name="edgeLabel"
            id="edgeLabel"
            value={data.label}
            onChange={handleLabelChange}
          />
        </form>
      );
    default:
      return null;
    // <div className="flex w-14 translate-y-4 items-center justify-around rounded border border-[#C0D5E7] bg-white py-1 shadow-md">
    //   <button className="h-3 w-3"  onClick={() =>
    //       setEditingMode({
    //         type: "arrows",
    //         flag: true,
    //       })
    //     } >
    //     <img
    //       src="/assets/editingEdgeIcons/RightGreen.svg"
    //       alt="edgedirection"
    //     />
    //   </button>
    //   <button
    //     onClick={() =>
    //       setEditingMode({
    //         type: "colors",
    //         flag: true,
    //       })
    //     }
    //     style={{ backgroundColor: `${data.pathCSS}` }}
    //     className={`h-3 w-3 cursor-pointer rounded-full`}
    //   ></button>
    //   <button className="h-3 w-3"  onClick={() =>
    //       setEditingMode({
    //         type: "label",
    //         flag: true,
    //       })
    //     }>
    //     <img src="/assets/editingEdgeIcons/Text.svg" alt="edgedirection" />
    //   </button>
    // </div>
  }
};

export default EdgeEditing;
