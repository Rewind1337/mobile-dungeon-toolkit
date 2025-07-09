export function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)) }

export function formatNumber(n, decimals) {
    if (n < 0 || !Number.isFinite(n) || !Number.isInteger(decimals) || decimals < 0) {
        return "Invalid input";
    }

    const suffixes = [
        { threshold: 1_000_000_000_000, suffix: "Bil" },
        { threshold: 1_000_000_000, suffix: "Mrd" },
        { threshold: 1_000_000, suffix: "Mil" },
        { threshold: 1_000, suffix: "T" },
        { threshold: 0, suffix: "" }
    ];

    const { threshold, suffix } = suffixes.find(s => n >= s.threshold);
    const divided = n / threshold;
    const formatted = divided.toFixed(decimals).replace(".", ",");

    return formatted + suffix;
}