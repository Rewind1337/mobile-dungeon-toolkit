import "../css/other.scss"
import QuestionmarkSrc from "../sprites/questionmark.webp"

function CatalogueEntryCard({ className = "", icon, dataCategory, children }) {
    return (
        <article
            className={`catalogue-entry-card card ${className}`.trim()}
            data-category={dataCategory}
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
