import Button from "./Button.jsx"

function CatalogueViewSwitch({ ariaLabel, view, onViewChange, options }) {
    return (
        <nav className="catalogue-view-switch" aria-label={ariaLabel}>
            {options.map(option => (
                <Button key={option.value} text={option.label} color={5} active={view === option.value} onClick={() => onViewChange?.(option.value)} />
            ))}
        </nav>
    )
}

export default CatalogueViewSwitch
