export const SERVER_BASE_URL = "https://tracker.thororen.com"
export const TRACKER_REPO_URL =
    "https://github.com/thororen1234/Discord-Bundle-Downloader"
export const UPSTREAM_REPO_URL = "https://github.com/sadan4/sadan.zip"
export const UPSTREAM_ISSUE_URL = `${UPSTREAM_REPO_URL}/issues/new`
export const SITE_REPO_URL = "https://github.com/thororen1234/Website"

export const androidBuildId = (versionCode: number) => `android-${versionCode}`

export function androidVersionCode(buildHash: string) {
    const android = /^android-(\d+)$/.exec(buildHash)
    return android ? Number(android[1]) : null
}

export const androidBundleUrl = (versionCode: number) =>
    `${SERVER_BASE_URL}/android/${versionCode}/bundle`

export const androidSourcesUrl = (versionCode: number) =>
    `${SERVER_BASE_URL}/android/${versionCode}/sources`

export function bundleArchiveUrl(buildHash: string) {
    const versionCode = androidVersionCode(buildHash)
    return versionCode != null
        ? androidBundleUrl(versionCode)
        : `${SERVER_BASE_URL}/build/archive/${buildHash}.7z`
}
