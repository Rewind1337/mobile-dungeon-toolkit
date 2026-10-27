import Button from "./Button.jsx"

function CatalogueResources({ initialView = "resources", onViewChange }) {
    return (
        <section className="hero-catalogue">
            <div className="catalogue-view-switch" aria-label="Resources catalogue sections">
                <Button
                    text="Resources"
                    color={5}
                    active={initialView === "resources"}
                    onClick={() => onViewChange?.("resources")}
                />
                <Button
                    text="Gems"
                    color={5}
                    active={initialView === "gems"}
                    onClick={() => onViewChange?.("gems")}
                />
            </div>
        </section>
    )
}

export default CatalogueResources
