import React, { useState, useEffect, useRef } from "react";

export default function DraggableBox() {
  const el = useRef();
  useDraggable(el);
  //@ts-ignore
  return <div ref={el} className="DraggableBox"></div>;
}
//@ts-ignore
export function useDraggable(el) {
  console.log("drag", el);

  const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 });
  useEffect(() => {
    //@ts-ignore
    const handleMouseDown = (event) => {
      const startX = event.pageX - dx;
      const startY = event.pageY - dy;
      //@ts-ignore
      const handleMouseMove = (event) => {
        const newDx = event.pageX - startX;
        const newDy = event.pageY - startY;
        setOffset({ dx: newDx, dy: newDy });
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", handleMouseMove);
        },
        { once: true }
      );
    };
    el.current.addEventListener("mousedown", handleMouseDown);
    return () => {
      el.current.removeEventListener("mousedown", handleMouseDown);
    };
  }, [dx, dy]);

  useEffect(() => {
    el.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }, [dx, dy]);
}
