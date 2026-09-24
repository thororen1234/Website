import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useExplorerSettings, useExplorerStore } from "../store"
import type { TModuleId } from "../types"
import { useAsync } from "./useAsync"

export default function GraphView({ dark }: { dark: boolean }) {
    const moduleId = useExplorerStore((s) => s.selectedModule)
    const buildService = useExplorerStore((s) => s.buildService)
    const depth = useExplorerSettings((s) => s.graphDepth)

    const graph = useAsync(
        moduleId != null && buildService
            ? () =>
                  buildService.generateModuleGraph(moduleId as TModuleId, depth)
            : null,
        [moduleId, buildService, depth],
    )

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
                              style: {
                                  borderColor: "#f43f5e",
                                  color: "#f43f5e",
                              },
                          }
                        : node,
                )}
                edges={graph.data.edges}
                colorMode={dark ? "dark" : "light"}
                nodesDraggable
                nodesConnectable={false}
                onlyRenderVisibleElements
                minZoom={0}
                fitView
                onNodeClick={(_e, node) => {
                    const id = Number(node.id) as TModuleId
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
