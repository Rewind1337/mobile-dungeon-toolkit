import "../css/infos.scss"
import QuestionmarkSrc from "../sprites/questionmark.webp"

function CatalogueEntryCard({ className = "", icon, dataCategory, children, onClick, disabled = false }) {
    const handleKeyDown = event => {
        if (event.key !== "Enter" && event.key !== " ") return
        if (!onClick || disabled) return
        event.preventDefault()
        onClick(event)
    }

    return (
        <article
            className={`catalogue-entry-card card ${className}`.trim()}
            data-category={dataCategory}
            role={onClick ? "button" : undefined}
            tabIndex={onClick && !disabled ? 0 : undefined}
            aria-disabled={disabled || undefined}
            onClick={disabled ? undefined : onClick}
            onKeyDown={handleKeyDown}
        >
            <div className="catalogue-entry-icon-wrap">
                <img
                    className="catalogue-entry-icon"
                    src={icon ?? QuestionmarkSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                />
            </div>
            <div className="catalogue-entry-content">{children}</div>
        </article>
    )
}

export default CatalogueEntryCard
