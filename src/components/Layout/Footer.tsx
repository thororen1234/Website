export default function Footer() {
    return (
        <footer className="flex items-center justify-between py-12 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
                © {new Date().getFullYear()} thororen
            </span>

            <p className="text-neutral-600 dark:text-neutral-400">
                Skidded with 💗 from{" "}
                <a
                    href="https://naibuu.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                >
                    Naibuu
                </a>
                .
            </p>
        </footer>
    )
}
