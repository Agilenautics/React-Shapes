import { MdGridOn } from "react-icons/md";
import { Controls, ControlButton } from "react-flow-renderer";

/**
 * This component contains the custom controls for the flowchart view. It contains the default controls, and allows us
 * to define custom controls as well.
 * @returns A React component
 */
function CustomControls() {
  return (
    <Controls>
      {/* Make it toggle Grid snapping */}
      <ControlButton>
        <MdGridOn className="text-black" />
      </ControlButton>
    </Controls>
  );
}

export default CustomControls;
