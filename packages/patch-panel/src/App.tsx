import { useCallback } from "react";
import ReactFlow, {
  Edge,
  Node,
  NodeTypes,
  OnConnect,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { Node as DefaultNode } from "./components/Node";

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

const initialNodes = [
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: { value: 123 },
  },
  {
    id: "node-2",
    type: "output",
    targetPosition: "top",
    position: { x: 0, y: 500 },
    data: { label: "node 2" },
  },
  {
    id: "node-3",
    type: "output",
    targetPosition: "top",
    position: { x: 200, y: 500 },
    data: { label: "node 3" },
  },
] as Node[];

const initialEdges = [
  {
    id: "edge-1",
    source: "node-1",
    target: "node-2",
    sourceHandle: "a",
  },
  {
    id: "edge-2",
    source: "node-1",
    target: "node-3",
    sourceHandle: "b",
  },
] as Edge[];

const nodeTypes: NodeTypes = { textUpdater: DefaultNode };

function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback<OnConnect>(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
        panOnScroll
        // defaultEdgeOptions={{ type: "smoothstep" }}
      />
    </div>
  );
}

export default Flow;
