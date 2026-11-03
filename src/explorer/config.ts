export const SERVER_BASE_URL = "https://tracker.thororen.com"
export const TRACKER_REPO_URL =
    "https://github.com/thororen1234/Discord-Bundle-Downloader"
export const UPSTREAM_REPO_URL = "https://github.com/sadan4/sadan.zip"
export const UPSTREAM_ISSUE_URL = `${UPSTREAM_REPO_URL}/issues/new`
export const SITE_REPO_URL = "https://github.com/thororen1234/Website"

export const androidBuildId = (versionCode: number) => `android-${versionCode}`

export const androidBundleUrl = (versionCode: number) =>
    `${SERVER_BASE_URL}/android/${versionCode}/bundle`

export function bundleArchiveUrl(buildHash: string) {
    const android = /^android-(\d+)$/.exec(buildHash)
    return android
        ? androidBundleUrl(Number(android[1]))
        : `${SERVER_BASE_URL}/build/archive/${buildHash}.7z`
}
