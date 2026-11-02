import { createPortal } from "react-dom"
import Button from "./Button.jsx"

export default function CatalogueFilterActions({ filtersVisible, onHide, onShow, onClear }) {
    const floatingShowButton = !filtersVisible && typeof document !== "undefined"
        ? createPortal(
            <Button
                className="catalogue-show-filters-fab"
                text="Show filters"
                color={5}
                title="Show catalogue filters"
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
                        <Button text="Hide filters" color={5} onClick={onHide} />
                        {onClear && <Button text="Clear filters" color="cancel" onClick={onClear} />}
                    </>
                ) : (
                    <Button className="catalogue-show-filters-inline" text="Show filters" color={5} onClick={onShow} />
                )}
            </div>
            {floatingShowButton}
        </>
    )
}
