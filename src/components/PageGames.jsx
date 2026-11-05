import PageHelpButton from "./PageHelpButton.jsx"
import { GamesGuide } from "./Guides.jsx"

export default function PageGames() {
    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <span className="text">More activities coming soon</span>
                </div>
                <div className="options flex-row card">
                    <PageHelpButton title="Fun & Games">
                        <GamesGuide />
                    </PageHelpButton>
                </div>
            </div>
            <main id="page-games" className="page card flex-col w-100">
                <div className="header-big">Fun &amp; Games</div>
                <p className="text">This section is reserved for future fun and game-related tools.</p>
            </main>
        </>
    )
}
