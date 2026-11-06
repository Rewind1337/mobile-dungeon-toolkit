import { useTranslation } from "../hooks/useTranslation.jsx"

function SimulatorOverview() {
    const title = useTranslation("app.pages.simulators.title")
    const description = useTranslation("app.pages.simulators.description")
    return (
        <main id="page-simulator-overview" className="page flex-col w-100 simulator-overview">
            <header className="card simulator-overview-heading">
                <h1 className="header-big">{title}</h1>
                <p className="text">{description}</p>
            </header>
        </main>
    )
}

export default SimulatorOverview
