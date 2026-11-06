import { createPortal } from "react-dom"
import Button from "./Button.jsx"
import { useTranslation } from "../hooks/useTranslation.jsx"

export default function CatalogueFilterActions({ filtersVisible, onHide, onShow, onClear }) {
    const showFilters = useTranslation("app.common.showFilters")
    const showCatalogueFilters = useTranslation("app.common.showCatalogueFilters")
    const hideFilters = useTranslation("app.common.hideFilters")
    const clearFilters = useTranslation("app.common.clearFilters")
    const floatingShowButton = !filtersVisible && typeof document !== "undefined"
        ? createPortal(
            <Button
                className="catalogue-show-filters-fab"
                text={showFilters}
                color={5}
                title={showCatalogueFilters}
                onClick={onShow}
            />,
            document.body
        )
        : null

    return (
        <>
            <div className={"catalogue-filter-actions" + (filtersVisible ? "" : " catalogue-filter-actions-hidden")}>
                {filtersVisible ? (
                    <>
                        <Button text={hideFilters} color={5} onClick={onHide} />
                        {onClear && <Button text={clearFilters} color="cancel" onClick={onClear} />}
                    </>
                ) : (
                    <Button className="catalogue-show-filters-inline" text="Show filters" color={5} onClick={onShow} />
                )}
            </div>
            {floatingShowButton}
        </>
    )
}
