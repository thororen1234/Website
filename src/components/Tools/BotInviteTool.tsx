"use client"

import { useMemo, useState } from "react"
import { ExternalLink } from "lucide-react"
import Box from "@/components/Base/Box"
import CopyButton from "@/components/Tools/CopyButton"
import SegmentedControl from "@/components/Tools/SegmentedControl"
import { buttonClass, fieldClass, labelClass } from "@/components/Tools/fields"
import {
    PERMISSION_GROUPS,
    PERMISSIONS,
    hasPermission,
    inviteUrl,
    parsePermissions,
    togglePermission,
} from "@/lib/permissions"

const scopes = [
    { value: "bot", label: "bot" },
    { value: "applications.commands", label: "applications.commands" },
] as const

function PermissionList({
    value,
    onChange,
}: {
    value: bigint
    onChange: (value: bigint) => void
}) {
    return (
        <div className="flex flex-col gap-5">
            {PERMISSION_GROUPS.map((group) => {
                const permissions = PERMISSIONS.filter(
                    (permission) => permission.group === group,
                )
                if (!permissions.length) return null

                return (
                    <fieldset key={group} className="flex flex-col gap-2">
                        <legend className={labelClass}>{group}</legend>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {permissions.map((permission) => {
                                const checked = hasPermission(value, permission)

                                return (
                                    <label
                                        key={permission.name}
                                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                                            checked
                                                ? "bg-rose-500/10 text-neutral-800 dark:text-neutral-200"
                                                : "text-neutral-600 hover:bg-zinc-200 dark:text-neutral-400 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                onChange(
                                                    togglePermission(
                                                        value,
                                                        permission,
                                                    ),
                                                )
                                            }
                                            className="size-4 accent-rose-600"
                                        />
                                        {permission.label}
                                    </label>
                                )
                            })}
                        </div>
                    </fieldset>
                )
            })}
        </div>
    )
}

function InviteBuilder() {
    const [clientId, setClientId] = useState("")
    const [permissions, setPermissions] = useState(0n)
    const [selectedScopes, setSelectedScopes] = useState<string[]>(["bot"])
    const validId = /^\d{17,20}$/.test(clientId.trim())
    const url = validId
        ? inviteUrl(clientId.trim(), permissions, selectedScopes)
        : ""

    function toggleScope(scope: string) {
        setSelectedScopes((current) =>
            current.includes(scope)
                ? current.filter((item) => item !== scope)
                : [...current, scope],
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <Box compact className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="bot-client-id" className={labelClass}>
                        Application client ID
                    </label>
                    <input
                        id="bot-client-id"
                        inputMode="numeric"
                        value={clientId}
                        onChange={(event) => setClientId(event.target.value)}
                        placeholder="123456789012345678"
                        aria-invalid={clientId !== "" && !validId}
                        spellCheck={false}
                        className={fieldClass}
                    />
                    {clientId && !validId && (
                        <p className="text-xs text-rose-500">
                            Enter a 17–20 digit Discord application ID.
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <span className={labelClass}>Scopes</span>
                    <div className="flex flex-wrap gap-2">
                        {scopes.map((scope) => (
                            <label
                                key={scope.value}
                                className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedScopes.includes(
                                        scope.value,
                                    )}
                                    onChange={() => toggleScope(scope.value)}
                                    className="size-4 accent-rose-600"
                                />
                                {scope.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className={labelClass}>Permissions number</span>
                    <div className="flex items-center gap-2">
                        <output className={`${fieldClass} min-w-0 break-all`}>
                            {permissions.toString()}
                        </output>
                        <CopyButton text={permissions.toString()} />
                    </div>
                </div>
            </Box>

            <Box compact className="flex flex-col gap-2">
                <span className={labelClass}>Invite URL</span>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <output
                        className={`${fieldClass} min-w-0 flex-1 break-all`}
                    >
                        {url ||
                            "Enter an application ID to create an invite link."}
                    </output>
                    {url && <CopyButton text={url} />}
                </div>
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className={`${buttonClass} flex w-fit items-center gap-1.5`}
                    >
                        Open invite <ExternalLink size={14} />
                    </a>
                )}
            </Box>

            <Box compact>
                <PermissionList value={permissions} onChange={setPermissions} />
            </Box>
        </div>
    )
}

function PermissionDecoder() {
    const [input, setInput] = useState("")
    const value = parsePermissions(input)
    const selected = useMemo(
        () =>
            value === null
                ? []
                : PERMISSIONS.filter((p) => hasPermission(value, p)),
        [value],
    )
    const invalid = input.trim() !== "" && value === null

    return (
        <div className="flex flex-col gap-4">
            <Box compact className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label htmlFor="permissions-input" className={labelClass}>
                        Permissions number
                    </label>
                    <input
                        id="permissions-input"
                        inputMode="numeric"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="8"
                        aria-invalid={invalid}
                        spellCheck={false}
                        className={fieldClass}
                    />
                    {invalid && (
                        <p className="text-xs text-rose-500">
                            Enter a valid unsigned 64-bit integer.
                        </p>
                    )}
                </div>
            </Box>

            <Box compact className="flex flex-col gap-3">
                <span className={labelClass}>
                    Enabled permissions
                    {value !== null ? ` (${selected.length})` : ""}
                </span>
                {value === null ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Enter a permission number to inspect it.
                    </p>
                ) : selected.length ? (
                    <ul className="flex flex-wrap gap-2">
                        {selected.map((permission) => (
                            <li
                                key={permission.name}
                                className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-sm text-neutral-700 dark:text-neutral-300"
                            >
                                {permission.label}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        No permissions are enabled.
                    </p>
                )}
            </Box>
        </div>
    )
}

export default function BotInviteTool() {
    const [tab, setTab] = useState<"invite" | "decode">("invite")

    return (
        <div className="flex flex-col gap-4">
            <SegmentedControl
                label="Tool"
                value={tab}
                onChange={setTab}
                options={[
                    { value: "invite", label: "Create invite" },
                    { value: "decode", label: "Decode permissions" },
                ]}
            />
            <div hidden={tab !== "invite"}>
                <InviteBuilder />
            </div>
            <div hidden={tab !== "decode"}>
                <PermissionDecoder />
            </div>
        </div>
    )
}
