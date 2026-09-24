import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback } from "react"
import { useExplorerSettings, useExplorerStore } from "../store"
import { useAsync } from "./useAsync"

export default function GraphView({ dark }: { dark: boolean }) {
    const moduleId = useExplorerStore((s) => s.selectedModule)
    const bundleApi = useExplorerStore((s) => s.bundleApi)
    const depth = useExplorerSettings((s) => s.graphDepth)

    const loadGraph = useCallback(
        () => bundleApi!.getModuleGraph(moduleId!, depth),
        [moduleId, bundleApi, depth],
    )
    const graph = useAsync(moduleId != null && bundleApi ? loadGraph : null)

    if (moduleId == null || graph.status !== "success") {
        return (
            <div className="flex size-full items-center justify-center text-lg font-medium text-neutral-500">
                {moduleId == null
                    ? "Select a module"
                    : graph.status === "error"
                      ? "Failed to build the module graph"
                      : "Loading module graph…"}
            </div>
        )
    }

    return (
        <ReactFlowProvider>
            <ReactFlow
                nodes={graph.data.nodes.map((node) =>
                    node.id === `${moduleId}`
                        ? {
                              ...node,
                              data: { label: node.id },
                              style: {
                                  borderColor: "#f43f5e",
                                  color: "#f43f5e",
                              },
                          }
                        : { ...node, data: { label: node.id } },
                )}
                edges={graph.data.edges}
                colorMode={dark ? "dark" : "light"}
                nodesDraggable
                nodesConnectable={false}
                onlyRenderVisibleElements
                minZoom={0}
                fitView
                onNodeClick={(_e, node) => {
                    const id = Number(node.id)
                    if (id !== moduleId)
                        useExplorerStore.getState().navigate(id)
                }}
            >
                <Controls />
                <Background />
                <MiniMap pannable zoomable />
            </ReactFlow>
        </ReactFlowProvider>
    )
}
