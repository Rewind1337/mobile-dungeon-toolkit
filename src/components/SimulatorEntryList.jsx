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

export default SimulatorEntryList
