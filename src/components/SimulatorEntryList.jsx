function SimulatorEntryList({ entries = [], entryLabel = "Entry" }) {
    if (!Array.isArray(entries) || entries.length === 0) {
        return <p className="text simulator-empty-data">{`No ${entryLabel.toLowerCase()} entries have been added yet.`}</p>
    }

    return (
        <div className="simulator-entry-list flex-col">
            {entries.map((entry, index) => (
                <article className="card simulator-data-entry" key={entry?.id ?? index}>
                    <div className="header">{entry?.name ?? `${entryLabel} ${index + 1}`}</div>
                    <pre className="text simulator-data-json">{JSON.stringify(entry, null, 2)}</pre>
                </article>
            ))}
        </div>
    )
}

export function SimulatorEntryDetails({ entry, entryLabel = "Entry" }) {
    if (!entry) return null
    const metadata = Object.fromEntries(Object.entries(entry).filter(([key]) => key !== "stages"))
    return (
        <div className="simulator-entry-details flex-col">
            <div className="header-big">{entry.name ?? entryLabel}</div>
            <pre className="text simulator-data-json">{JSON.stringify(metadata, null, 2)}</pre>
            <div className="header">Stages</div>
            <SimulatorEntryList entries={entry.stages} entryLabel="Stage" />
        </div>
    )
}

export default SimulatorEntryList
