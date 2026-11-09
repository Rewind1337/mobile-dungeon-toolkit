import { useTranslate } from "../hooks/useTranslate.jsx"

export default function MobileFilterSelect({ label, value, onChange, options, multiple = false }) {
    const t = useTranslate()

    return (
        <label className="mobile-filter-control">
            <span className="catalogue-control-label text">{label}</span>
            <select
                multiple={multiple}
                value={multiple ? (Array.isArray(value) ? value.map(String) : []) : value ?? ""}
                onChange={onChange}
            >
                {!multiple && <option value="">{t("app.shared.all")}</option>}
                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </label>
    )
}
