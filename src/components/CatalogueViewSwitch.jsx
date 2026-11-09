import Button from "./Button.jsx"

function CatalogueViewSwitch({ view, onViewChange, options }) {
    const getCompactLabel = label => label.endsWith(" Catalogue") ? `${label.slice(0, -10)}s` : label;
    return (
        <nav className="catalogue-view-switch">
            {options.map(option => (
                <Button key={option.value} text={<><span className="catalogue-view-label-full">{option.label}</span><span className="catalogue-view-label-compact">{option.compactLabel ?? getCompactLabel(option.label)}</span></>} color={5} active={view === option.value} onClick={() => onViewChange?.(option.value)} />
            ))}
        </nav>
    )
}

export default CatalogueViewSwitch
