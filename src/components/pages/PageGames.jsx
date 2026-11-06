import HelpButton from "../HelpButton.jsx"
import { GamesGuide } from "../Guides.jsx"
import { useTranslation } from "../../hooks/useTranslation.jsx"

export default function PageGames() {
    const comingSoon = useTranslation("app.pages.games.comingSoon")
    const title = useTranslation("app.pages.games.title")
    const description = useTranslation("app.pages.games.description")

    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <span className="text">{comingSoon}</span>
                </div>
                <div className="options flex-row card">
                    <HelpButton title={title}>
                        <GamesGuide />
                    </HelpButton>
                </div>
            </div>
            <main id="page-games" className="page card flex-col w-100">
                <div className="header-big">{title}</div>
                <p className="text">{description}</p>
            </main>
        </>
    )
}
