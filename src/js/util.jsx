export function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)) }

export function formatNumber(n, decimals) {
    if (n < 0 || !Number.isFinite(n) || !Number.isInteger(decimals) || decimals < 0) {
        return "Invalid input";
    }

    if (n <= 9_999) return String(n);

    const suffixes = [
        { threshold: 1_000_000_000_000, suffix: "T" },
        { threshold: 1_000_000_000, suffix: "B" },
        { threshold: 1_000_000, suffix: "M" },
        { threshold: 1_000, suffix: "K" },
        { threshold: 0, suffix: "" }
    ];

    const { threshold, suffix } = suffixes.find(s => n >= s.threshold);
    const divided = n / threshold;
    const formatted = divided.toFixed(decimals).replace(".", ",");

    return formatted + suffix;
}

/** Convert enum-style identifiers into readable labels. */
export const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())
