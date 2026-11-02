import { lazy, Suspense } from 'react'
import Button from './Button.jsx'
import SimulatorOverview from './SimulatorOverview.jsx'

const SubPageGuildBoss = lazy(() => import('./SubPageGuildBoss.jsx'))
const SubPageTitans = lazy(() => import('./SubPageTitans.jsx'))
const SubPageTowers = lazy(() => import('./SubPageTowers.jsx'))
const SubPageChapters = lazy(() => import('./SubPageChapters.jsx'))
const SubPageCustomCombat = lazy(() => import('./SubPageCustomCombat.jsx'))

const SIMULATOR_TABS = [
    ['adventure', 'Adventure Chapters'],
    ['towers', 'Towers'],
    ['titans', 'Titans'],
    ['guild-hunt', 'Guild Hunt'],
    ['custom', 'Custom Combat'],
]

function PageSimulators({ activeTab = 'overview', onTabChange, savedHeroesRef, savedTeamsRef, manualSaveFunction }) {
    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    {SIMULATOR_TABS.map(([id, label]) => (
                        <Button key={id} text={label} color={4} active={activeTab === id} onClick={() => onTabChange?.(id)} />
                    ))}
                </div>
                <div className="options flex-row card">
                    <Button text="Manual Save" color={4} onClick={manualSaveFunction} />
                </div>
            </div>

            {activeTab === 'overview' ? <SimulatorOverview /> : (
                <div id="page-simulators" className="page flex-row w-100">
                    <Suspense fallback={<div className="card">Loading...</div>}>
                        {activeTab === 'adventure' && <SubPageChapters />}
                        {activeTab === 'towers' && <SubPageTowers />}
                        {activeTab === 'titans' && <SubPageTitans />}
                        {activeTab === 'guild-hunt' && <SubPageGuildBoss />}
                        {activeTab === 'custom' && (
                            <SubPageCustomCombat
                                savedHeroesRef={savedHeroesRef}
                                savedTeamsRef={savedTeamsRef}
                            />
                        )}
                    </Suspense>
                </div>
            )}
        </>
    )
}

export default PageSimulators
