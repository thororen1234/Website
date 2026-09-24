import { TriangleAlert, X } from "lucide-react"
import type { ReactNode, RefObject } from "react"
import { fieldClass, labelClass } from "@/components/Tools/fields"
import { useExplorerSettings, useExplorerStore } from "../store"
import { editorThemes } from "../themes"

function Warning({ text, children }: { text: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-500/50 p-3">
            <p className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <TriangleAlert size={16} className="shrink-0" />
                {text}
            </p>
            {children}
        </div>
    )
}

export default function SettingsDialog({
    ref,
}: {
    ref: RefObject<HTMLDialogElement | null>
}) {
    const openInNewTab = useExplorerSettings((s) => s.openModulesInNewTab)
    const theme = useExplorerSettings((s) => s.editorTheme)
    const depth = useExplorerSettings((s) => s.graphDepth)

    return (
        <dialog
            ref={ref}
            onClick={(e) =>
                e.target === e.currentTarget && ref.current?.close()
            }
            className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-zinc-300 bg-zinc-100 p-0 text-neutral-800 backdrop:bg-black/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-200"
        >
            <div className="flex flex-col gap-5 px-6 py-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Settings</h2>
                    <button
                        type="button"
                        aria-label="Close settings"
                        onClick={() => ref.current?.close()}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 text-neutral-600 transition-colors hover:bg-zinc-200 hover:text-rose-500 active:scale-[.97] dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:bg-zinc-800"
                    >
                        <X size={16} />
                    </button>
                </div>

                <Warning text="Experimental. Expect bugs and please report them.">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={openInNewTab}
                            onChange={(e) =>
                                useExplorerSettings.setState({
                                    openModulesInNewTab: e.target.checked,
                                })
                            }
                            className="accent-rose-500"
                        />
                        Open modules in a new tab
                    </label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Go to definition (ctrl-click) into another module opens
                        it in a new tab instead of this one.
                    </p>
                </Warning>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="explorer-theme" className={labelClass}>
                        Editor theme
                    </label>
                    <select
                        id="explorer-theme"
                        value={theme}
                        onChange={(e) =>
                            useExplorerSettings.setState({
                                editorTheme: e.target.value,
                            })
                        }
                        className={fieldClass}
                    >
                        {editorThemes.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Only changes the code editor, not the rest of the page.
                    </p>
                </div>

                <Warning text="Values above 1 can make the graph lag or hang.">
                    <label
                        htmlFor="explorer-depth"
                        className="flex justify-between text-sm"
                    >
                        Graph depth
                        <span className="font-mono">{depth}</span>
                    </label>
                    <input
                        id="explorer-depth"
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={depth}
                        onChange={(e) => {
                            if (useExplorerStore.getState().panel === "graph") {
                                useExplorerStore.setState({ panel: "code" })
                            }
                            useExplorerSettings.setState({
                                graphDepth: Number(e.target.value),
                            })
                        }}
                        className="accent-rose-500"
                    />
                </Warning>
            </div>
        </dialog>
    )
}
