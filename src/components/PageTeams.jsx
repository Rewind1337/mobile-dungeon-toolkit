import { useEffect, useLayoutEffect, useRef, useState } from "react"
import ItemList from "./ItemList.jsx"
import ItemPreview from "./ItemPreview.jsx"
import HeroList from "./HeroList.jsx"
import HeroPreview from "./HeroPreview.jsx"
import Button from "./Button.jsx"
import EmptyHero from "./EmptyHero.jsx"
import Hero from "./Hero.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { CONSTANTS } from "../database/constants.jsx"

function PageTeams({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef, manualSaveFunction }) {
    const { listHeight, listRef, events } = useDynamicList(() => { }, 0, CONSTANTS.listHeightSubPage);
    const [pageContent, setPageContent] = useState(0)
    const [selectedSavedHeroId, setSelectedSavedHeroId] = useState(null)
    const [selectedSavedItemId, setSelectedSavedItemId] = useState({ slot: null, id: null })
    const [teams, setTeams] = useState([{ id: 0, name: "Default Team", heroes: Array(5).fill({ id: -1 }) }, { id: 1, name: "Team A", heroes: Array(5).fill({ id: -1 }) }, { id: 2, name: "Team B", heroes: Array(5).fill({ id: -1 }) }])
    const [teamIndex, setTeamIndex] = useState(null)
    const [heroIndex, setHeroIndex] = useState(null)

    const [forceUpdate, setForceUpdate] = useState({})

    const handleTeamHeroClick = (teamIndex, heroIndex) => {
        setTeamIndex(teamIndex)
        setHeroIndex(heroIndex);
    }

    const handleSavedHeroClick = () => {
        if (selectedSavedHeroId === null || heroIndex === null) return;

        let hero = savedHeroesRef.current[selectedSavedHeroId];
        if (!hero) return;

        if (teams[teamIndex]?.heroes) {
            const heroes = teams[teamIndex].heroes || [];
            for (let i = 0; i < heroes.length; i++) {
                if (heroes[i]?.id === selectedSavedHeroId) return;
            }
        }

        setTeams(prev => {
            const newTeams = [...prev];
            const team = { ...newTeams[teamIndex] };
            const heroes = team.heroes || [];
            team.heroes = [...heroes];
            team.heroes[heroIndex] = hero;
            newTeams[teamIndex] = team;
            return newTeams;
        });
    };

    useEffect(() => {
        if (selectedSavedHeroId !== null && heroIndex !== null) {
            handleSavedHeroClick();
        }
    }, [selectedSavedHeroId])

    return (
        <>
            <div className="flex-row" style={{ justifyContent: "space-between", order: window.matchMedia("(max-width: 900px)").matches ? 1 : 0 }}>
                <div className="pagination flex-row card w-100">
                    <Button text={"Your Teams"} color={2} onClick={() => { setPageContent(0) }} />
                </div>
                <div className="options flex-row card">
                    <Button text={"Manual Save"} color={5} onClick={() => { manualSaveFunction() }} />
                </div>
            </div>

            <div id='page-heroes' className='page flex-row w-100'>
                {pageContent === 0 &&
                    <>
                        <div ref={listRef} className='teams-list card flex-col w-50' style={{ maxHeight: listHeight }}>
                            <div className='header-big'>Your Teams</div>
                            {teams.map((team, teamIndex) =>
                                <div className="team card flex-col">
                                    <div className="flex-row">
                                        <Button text={"Delete Team"} color={5} onClick={() => { }} />
                                        <Button text={"Clear Team"} color={4} onClick={() => { }} />
                                        <div className="header-big">{team.name}</div>
                                    </div>
                                    <div className="flex-row">
                                        {team.heroes[0].id === -1 ? <EmptyHero onClick={() => { handleTeamHeroClick(teamIndex, 0) }} /> : <Hero heroObj={team.heroes[0]} key={teamIndex + "-" + 0} level={1} onClick={() => { handleTeamHeroClick(teamIndex, 0) }} />}
                                        {team.heroes[1].id === -1 ? <EmptyHero onClick={() => { handleTeamHeroClick(teamIndex, 1) }} /> : <Hero heroObj={team.heroes[1]} key={teamIndex + "-" + 1} level={1} onClick={() => { handleTeamHeroClick(teamIndex, 1) }} />}
                                        {team.heroes[2].id === -1 ? <EmptyHero onClick={() => { handleTeamHeroClick(teamIndex, 2) }} /> : <Hero heroObj={team.heroes[2]} key={teamIndex + "-" + 2} level={1} onClick={() => { handleTeamHeroClick(teamIndex, 2) }} />}
                                        {team.heroes[3].id === -1 ? <EmptyHero onClick={() => { handleTeamHeroClick(teamIndex, 3) }} /> : <Hero heroObj={team.heroes[3]} key={teamIndex + "-" + 3} level={1} onClick={() => { handleTeamHeroClick(teamIndex, 3) }} />}
                                        {team.heroes[4].id === -1 ? <EmptyHero onClick={() => { handleTeamHeroClick(teamIndex, 4) }} /> : <Hero heroObj={team.heroes[4]} key={teamIndex + "-" + 4} level={1} onClick={() => { handleTeamHeroClick(teamIndex, 4) }} />}
                                    </div>
                                </div>)}
                            <div className="team team-new card flex-row">
                                <Button text={"Create new Team"} color={2} onClick={() => { }} />
                            </div>
                        </div>
                        <div className='card w-50'>
                            <HeroList setForceUpdate={setForceUpdate} savedHeroes headerText={"Saved Heroes"} heroesRef={savedHeroesRef.current} setSelectedHeroId={setSelectedSavedHeroId} />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default PageTeams