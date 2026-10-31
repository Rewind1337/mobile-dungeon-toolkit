const SIMULATOR_LINKS = [
    { id: 'adventure', title: 'Adventure Chapters', description: 'Browse the regular and Shadow World chapter entries.', color: 0, className: 'chapters' },
    { id: 'towers', title: 'Towers', description: 'Browse tower entries and their available stages.', color: 1, className: 'towers' },
    { id: 'titans', title: 'Titans', description: 'Browse the titan encounters.', color: 2, className: 'titans' },
    { id: 'guild-hunt', title: 'Guild Hunt', description: 'Browse guild bosses and their current encounter data.', color: 3, className: 'guildbosses' },
    { id: 'custom', title: 'Custom Combat', description: 'Choose two saved teams for a custom encounter.', color: 4, className: 'custom-combat' },
]

function SimulatorOverview({ onNavigate }) {
    return (
        <main id="page-simulator-overview" className="page flex-col w-100 simulator-overview">
            <header className="card simulator-overview-heading">
                <h1 className="header-big">Simulators</h1>
                <p className="text">Choose a simulator to browse encounters or set up a custom combat matchup.</p>
            </header>
            <div className="simulator-overview-grid">
                {SIMULATOR_LINKS.map(link => (
                    <button
                        type="button"
                        key={link.id}
                        className={`card flex-col simulator-overview-tile ${link.className}`}
                        onClick={() => onNavigate?.(link.id)}
                    >
                        <span className="header">{link.title}</span>
                        <span className="text">{link.description}</span>
                    </button>
                ))}
            </div>
        </main>
    )
}

export default SimulatorOverview