import { useTranslate } from "../hooks/useTranslate.jsx"
import DamagedSrc from "../sprites/buttons/damaged.webp"

export default function DamagedItemIndicator({ loading = "lazy" }) {
    const t = useTranslate()
    return (
        <div className="item-damaged" title={t("app.shared.damagedItemLocked_tooltip")} >
            <img src={DamagedSrc} loading={loading} decoding="async" draggable={false} alt="" />
        </div>
    )
}
