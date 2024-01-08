import {gql} from "@apollo/client";


export const UPDATE_EDGE = gql`
mutation UpdateFlowEdges($where: FlowEdgeWhere, $update: FlowEdgeUpdateInput) {
  updateFlowEdges(where: $where, update: $update) {
    flowEdges {
      id
      bidirectional
      boxCSS
      label
      pathCSS
    }
  }
}
`