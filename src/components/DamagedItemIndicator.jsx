import DamagedSrc from "../sprites/buttons/damaged.webp"

export default function DamagedItemIndicator({ loading = "lazy" }) {
    return (
        <div className="item-damaged" title="Damaged item — perk changes are locked" aria-label="Damaged item">
            <img src={DamagedSrc} loading={loading} decoding="async" draggable={false} alt="" />
        </div>
    )
}
