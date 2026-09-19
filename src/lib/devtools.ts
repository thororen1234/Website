export function base64Encode(text: string, urlSafe = false) {
    let binary = ""
    for (const byte of new TextEncoder().encode(text)) {
        binary += String.fromCharCode(byte)
    }

    const encoded = btoa(binary)
    return urlSafe
        ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
        : encoded
}

export function base64Decode(text: string): string | null {
    try {
        const normalized = text.trim().replace(/-/g, "+").replace(/_/g, "/")
        const padded =
            normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
        const bytes = Uint8Array.from(atob(padded), (char) =>
            char.charCodeAt(0),
        )
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
    } catch {
        return null
    }
}

export type JsonResult =
    { ok: true; text: string } | { ok: false; error: string }

export function formatJson(text: string, indent: number | "tab"): JsonResult {
    try {
        return {
            ok: true,
            text: JSON.stringify(
                JSON.parse(text),
                null,
                indent === "tab" ? "\t" : indent,
            ),
        }
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Invalid JSON",
        }
    }
}

export const HASH_ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]

export async function hashHex(algorithm: string, text: string) {
    const digest = await crypto.subtle.digest(
        algorithm,
        new TextEncoder().encode(text),
    )
    return [...new Uint8Array(digest)]
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
}
