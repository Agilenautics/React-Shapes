import { gql } from "@apollo/client";

export const ADD_LINK = gql`
 mutation addLinkNode(
    $where: FlowNodeWhere
    $connect: FlowNodeConnectInput
  ) {
    updateFlowNodes(where: $where, connect: $connect) {
      flowNodes {
        isLinked {
          id
          label
          hasFile {
            id
          }
        }
      }
    }
  }
`;
