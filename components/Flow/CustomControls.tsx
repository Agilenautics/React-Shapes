import React, { FC, PropsWithChildren, useState, useEffect } from "react";
import cc from "classcat";
import { shallow } from "zustand/shallow";
import {
  useStore,
  useStoreApi,
  useReactFlow,
  Panel,
  type ReactFlowState,
} from "@reactflow/core";

import { FaPlus, FaMinus } from "react-icons/fa";
import { ControlProps, ControlButton } from "reactflow";

const CustomControls: FC<PropsWithChildren<ControlProps>> = ({
  style,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewOptions,
  onZoomIn,
  onZoomOut,
  onFitView,
  className,
  position = "bottom-right",
}) => {
  const store = useStoreApi();
  const { isInteractive, minZoomReached, maxZoomReached } = useStore(
    (s: ReactFlowState) => ({
      isInteractive:
        s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
      minZoomReached: s.transform[2] <= s.minZoom,
      maxZoomReached: s.transform[2] >= s.maxZoom,
    }),
    shallow
  );
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onZoomInHandler = () => {
    zoomIn();
    onZoomIn?.();
  };

  const onZoomOutHandler = () => {
    zoomOut();
    onZoomOut?.();
  };

  const onFitViewHandler = () => {
    fitView(fitViewOptions);
    onFitView?.();
  };

  return (
    <Panel
      className={cc([
        "react-flow__controls top-6 flex items-center",
        className,
      ])}
      position={position}
      style={style}
      data-testid="rf__controls"
    >
      {showFitView && (
        <ControlButton
          className="react-flow__controls-fitview"
          onClick={onFitViewHandler}
          title="fit view"
          aria-label="fit view"
        >
          <img src="/icons/maximize-2.svg" />
        </ControlButton>
      )}
      {showZoom && (
        <>
          <ControlButton
            onClick={onZoomOutHandler}
            className="react-flow__controls-zoomout"
            title="zoom out"
            aria-label="zoom out"
            disabled={minZoomReached}
          >
            <FaMinus className="text-lg" />
          </ControlButton>
          <div className="bg-white p-1 text-sm">
            {`${Math.round(store.getState().transform[2] * 100)}%`}
          </div>
          <ControlButton
            onClick={onZoomInHandler}
            className="react-flow__controls-zoomin"
            title="zoom in"
            aria-label="zoom in"
            disabled={maxZoomReached}
          >
            <FaPlus />
          </ControlButton>
        </>
      )}
    </Panel>
  );
};

CustomControls.displayName = "CustomControls";

export default CustomControls;
