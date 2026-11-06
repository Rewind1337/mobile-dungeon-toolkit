import { lazy, Suspense } from 'react'
import Button from '../Button.jsx'
import HelpButton from '../HelpButton.jsx'
import { SimulatorsGuide } from '../Guides.jsx'
import SimulatorOverview from '../SimulatorOverview.jsx'
import { useTranslate } from '../../hooks/useTranslate.jsx'

const SubPageGuildBoss = lazy(() => import('../SubPageGuildBoss.jsx'))
const SubPageTitans = lazy(() => import('../SubPageTitans.jsx'))
const SubPageTowers = lazy(() => import('../SubPageTowers.jsx'))
const SubPageChapters = lazy(() => import('../SubPageChapters.jsx'))
const SubPageCustomCombat = lazy(() => import('../SubPageCustomCombat.jsx'))
const SubPageMagicToilet = lazy(() => import('../SubPageMagicToilet.jsx'))

const SIMULATOR_TABS = [
    ['adventure', 'app.pages.simulators.adventureChapters', 'button-gradient-5-1', 'app.pages.simulators.adventure'],
    ['towers', 'app.pages.simulators.towers', 'button-gradient-5-2'],
    ['titans', 'app.pages.simulators.titans', 'button-gradient-5-3'],
    ['guild-hunt', 'app.pages.simulators.guildHunt', 'button-gradient-5-4'],
    ['custom', 'app.pages.customCombat.title', 'button-gradient-5-5', 'app.pages.simulators.customCompact'],
    ['magic-toilet', 'app.pages.magicToilet.title', 'magic-toilet'],
]

function PageSimulators({ activeTab = 'overview', onTabChange, heroesRef, savedHeroesRef, savedTeamsRef }) {
    const t = useTranslate()
    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    {SIMULATOR_TABS.map(([id, label, color, compactLabel]) => (
                        <Button
                            key={id}
                            text={compactLabel
                                ? <><span className="catalogue-view-label-full">{t(label)}</span><span className="catalogue-view-label-compact">{t(compactLabel)}</span></>
                                : t(label)}
                            color={color}
                            active={activeTab === id}
                            disabled={id !== 'magic-toilet'}
                            onClick={() => onTabChange?.(id)}
                        />
                    ))}
                </div>
                <div className="options flex-row card">
                    <HelpButton title={t("app.navigation.simulators")}>
                        <SimulatorsGuide />
                    </HelpButton>
                </div>
            </div>

            {activeTab === 'overview' ? <SimulatorOverview /> : (
                <div id="page-simulators" className="page flex-row w-100">
                    <Suspense fallback={<div className="card">{t("app.shared.loading")}</div>}>
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
