import { lazy, Suspense } from 'react'
import Button from './Button.jsx'
import SimulatorOverview from './SimulatorOverview.jsx'

const SubPageGuildBoss = lazy(() => import('./SubPageGuildBoss.jsx'))
const SubPageTitans = lazy(() => import('./SubPageTitans.jsx'))
const SubPageTowers = lazy(() => import('./SubPageTowers.jsx'))
const SubPageChapters = lazy(() => import('./SubPageChapters.jsx'))
const SubPageCustomCombat = lazy(() => import('./SubPageCustomCombat.jsx'))
const SubPageMagicToilet = lazy(() => import('./SubPageMagicToilet.jsx'))

const SIMULATOR_TABS = [
    ['adventure', 'Adventure Chapters', 'button-gradient-5-1'],
    ['towers', 'Towers', 'button-gradient-5-2'],
    ['titans', 'Titans', 'button-gradient-5-3'],
    ['guild-hunt', 'Guild Hunt', 'button-gradient-5-4'],
    ['custom', 'Custom Combat', 'button-gradient-5-5'],
    ['magic-toilet', 'Magic Toilet', 'magic-toilet'],
]

function PageSimulators({ activeTab = 'overview', onTabChange, heroesRef, savedHeroesRef, savedTeamsRef, manualSaveFunction }) {
    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    {SIMULATOR_TABS.map(([id, label, color]) => (
                        <Button key={id} text={label} color={color} active={activeTab === id} onClick={() => onTabChange?.(id)} />
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
                        {activeTab === 'magic-toilet' && <SubPageMagicToilet heroesRef={heroesRef} />}
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
