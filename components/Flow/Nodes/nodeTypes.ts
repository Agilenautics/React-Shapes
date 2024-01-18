import styles from "./shapes.module.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import CustomNode from "./CustomNode";
/* This file contains a list of types of nodes */
const nodeType = {
  customNode: CustomNode,
};
const nodeShapeMap: any = {
  rectangle: ["w-36 p-[2px]", "rounded-md ", ""],
  diamond: [
    "!h-24 w-24",
    "!h-[69%] !w-[69%] rotate-45 translate-x-[15px] translate-y-[15px] rounded-md -rotate-45",
    "-rotate-45",
  ],
  circle: ["h-30 w-30", "!h-20 w-20 rounded-full", "rotate-0"],
  parallelogram: [
    "h-30 w-30",
    "h-30 w-30",
    "rotate-0  w-20 flex items-center justify-center",
  ],
  screw: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-screw-wrench", "rotate-0"],
  trash: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-trash", "rotate-0"],
  gatewayParallel: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-gateway-parallel",
    "rotate-0",
  ],
  intermediateEventCatchCancel: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-cancel",
    "rotate-0",
  ],
  intermediateEventCatchNonInterruptingMessage: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-non-interrupting-message",
    "rotate-0",
  ],
  startEventCompensation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-compensation",
    "rotate-0",
  ],
  startEventNonInterruptingParallelMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-non-interrupting-parallel-multiple",
    "rotate-0",
  ],
  loopMarker: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-loop-marker",
    "rotate-0",
  ],
  parallelMiMarker: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-parallel-mi-marker",
    "rotate-0",
  ],
  startEventNonInterruptingSignal: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-non-interrupting-signal",
    "rotate-0",
  ],
  intermediateEventCatchNonInterruptingTimer: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-non-interrupting-timer",
    "rotate-0",
  ],
  intermediateEventCatchParallelMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-parallel-multiple",
    "rotate-0",
  ],
  intermediateEventCatchCompensation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-compensation",
    "rotate-0",
  ],
  gatewayXor: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-gateway-xor",
    "rotate-0",
  ],
  endEventCancel: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-cancel",
    "rotate-0",
  ],
  intermediateEventCatchCondition: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-condition",
    "rotate-0",
  ],
  intermediateEventCatchNonInterruptingParallelMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-non-interrupting-parallel-multiple",
    "rotate-0",
  ],
  startEventCondition: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-condition",
    "rotate-0",
  ],
  startEventNonInterruptingTimer: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-non-interrupting-timer",
    "rotate-0",
  ],
  sequentialMiMarker: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-sequential-mi-marker",
    "rotate-0",
  ],
  userTask: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-user-task", "rotate-0"],
  businessRule: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-business-rule",
    "rotate-0",
  ],
  subProcessMarker: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-sub-process-marker",
    "rotate-0",
  ],
  startEventParallelMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-parallel-multiple",
    "rotate-0",
  ],
  startEventError: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-error",
    "rotate-0",
  ],
  intermediateEventCatchSignal: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-signal",
    "rotate-0",
  ],
  intermediateEventCatchError: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-error",
    "rotate-0",
  ],
  endEventCompensation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-compensation",
    "rotate-0",
  ],
  subprocessCollapsed: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-subprocess-collapsed",
    "rotate-0",
  ],
  subprocessExpanded: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-subprocess-expanded",
    "rotate-0",
  ],
  task: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-task", "rotate-0"],
  endEventError: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-error",
    "rotate-0",
  ],
  intermediateEventCatchEscalation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-escalation",
    "rotate-0",
  ],
  intermediateEventCatchTimer: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-timer",
    "rotate-0",
  ],
  startEventEscalation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-escalation",
    "rotate-0",
  ],
  startEventSignal: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-signal",
    "rotate-0",
  ],
  businessRuleTask: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-business-rule-task",
    "rotate-0",
  ],
  manual: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-manual", "rotate-0"],
  receive: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-receive", "rotate-0"],
  callActivity: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-call-activity",
    "rotate-0",
  ],
  startEventTimer: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-timer",
    "rotate-0",
  ],
  startEventMessage: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-message",
    "rotate-0",
  ],
  intermediateEventNone: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-none",
    "rotate-0",
  ],
  intermediateEventCatchLink: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-link",
    "rotate-0",
  ],
  endEventEscalation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-escalation",
    "rotate-0",
  ],
  bpmnIo: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-bpmn-io", "rotate-0"],
  gatewayComplex: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-gateway-complex",
    "rotate-0",
  ],
  gatewayEventbased: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-gateway-eventbased",
    "rotate-0",
  ],
  gatewayNone: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-gateway-none",
    "rotate-0",
  ],
  gatewayOr: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-gateway-or", "rotate-0"],
  endEventTerminate: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-terminate",
    "rotate-0",
  ],
  endEventSignal: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-signal",
    "rotate-0",
  ],
  endEventNone: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-none",
    "rotate-0",
  ],
  endEventMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-multiple",
    "rotate-0",
  ],
  endEventMessage: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-message",
    "rotate-0",
  ],
  endEventLink: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-end-event-link",
    "rotate-0",
  ],
  intermediateEventCatchMessage: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-message",
    "rotate-0",
  ],
  intermediateEventThrowCompensation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-throw-compensation",
    "rotate-0",
  ],
  startEventMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-multiple",
    "rotate-0",
  ],
  script: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-script", "rotate-0"],
  manualTask: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-manual-task",
    "rotate-0",
  ],
  send: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-send", "rotate-0"],
  service: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-service", "rotate-0"],
  receiveTask: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-receive-task",
    "rotate-0",
  ],
  user: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-user", "rotate-0"],
  startEventNone: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-none",
    "rotate-0",
  ],
  intermediateEventThrowEscalation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-throw-escalation",
    "rotate-0",
  ],
  intermediateEventCatchMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-multiple",
    "rotate-0",
  ],
  intermediateEventCatchNonInterruptingEscalation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-non-interrupting-escalation",
    "rotate-0",
  ],
  intermediateEventThrowLink: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-throw-link",
    "rotate-0",
  ],
  startEventNonInterruptingCondition: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-non-interrupting-condition",
    "rotate-0",
  ],
  dataObject: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-data-object",
    "rotate-0",
  ],
  scriptTask: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-script-task",
    "rotate-0",
  ],
  sendTask: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-send-task", "rotate-0"],
  dataStore: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-data-store", "rotate-0"],
  startEventNonInterruptingEscalation: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-non-interrupting-escalation",
    "rotate-0",
  ],
  intermediateEventThrowMessage: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-throw-message",
    "rotate-0",
  ],
  intermediateEventCatchNonInterruptingMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-non-interrupting-multiple",
    "rotate-0",
  ],
  intermediateEventCatchNonInterruptingSignal: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-non-interrupting-signal",
    "rotate-0",
  ],
  intermediateEventThrowMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-throw-multiple",
    "rotate-0",
  ],
  startEventNonInterruptingMessage: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-non-interrupting-message",
    "rotate-0",
  ],
  adHocMarker: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-ad-hoc-marker",
    "rotate-0",
  ],
  serviceTask: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-service-task",
    "rotate-0",
  ],
  taskNone: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-task-none", "rotate-0"],
  compensationMarker: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-compensation-marker",
    "rotate-0",
  ],
  startEventNonInterruptingMultiple: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-start-event-non-interrupting-multiple",
    "rotate-0",
  ],
  intermediateEventThrowSignal: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-throw-signal",
    "rotate-0",
  ],
  intermediateEventCatchNonInterruptingCondition: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-intermediate-event-catch-non-interrupting-condition",
    "rotate-0",
  ],
  participant: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-participant",
    "rotate-0",
  ],
  eventSubprocessExpanded: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-event-subprocess-expanded",
    "rotate-0",
  ],
  laneInsertBelow: [
    "h-30 w-34",
    "bpmn-icon-sizing bpmn-icon-lane-insert-below",
    "rotate-0",
  ],
  spaceTool: ["h-30 w-34", "bpmn-icon-sizing bpmn-icon-space-tool", "rotate-0"],
};

export { nodeShapeMap, nodeType };
