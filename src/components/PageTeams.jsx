import { useState } from "react"
import HeroList from "./HeroList.jsx"
import Button from "./Button.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"

function PageTeams({ savedHeroesRef, manualSaveFunction }) {
    const { listHeight, listRef } = useDynamicList(165, true);
    const [pageContent, setPageContent] = useState(0)
    const [teams, ] = useState([
        { id: 0, name: "Default Team", heroes: Array(5).fill({ id: -1 }) },
        { id: 1, name: "Team A", heroes: Array(5).fill({ id: -1 }) },
        { id: 2, name: "Team B", heroes: Array(5).fill({ id: -1 }) }
    ])

    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <Button text={"Your Teams"} color={2} onClick={() => { setPageContent(0) }} />
                </div>
                <div className="options flex-row card">
                    <Button text={"Manual Save"} color={5} onClick={() => { manualSaveFunction() }} />
                </div>
            </div>

            <div id='page-teams' className='page flex-row w-100'>
                {pageContent === 0 &&
                    <>
                        <div ref={listRef} className='teams-list card flex-col w-50' style={{ maxHeight: listHeight }}>
                            <div className='header-big'>Your Teams</div>
                            {teams.map((team, teamIndex) =>
                                <div className="team card flex-col" key={"team-" + teamIndex}>
                                    <div className="flex-row">
                                        <Button text={"Delete Team"} autoHeight color={5} onClick={() => { }} />
                                        <Button text={"Clear Team"} autoHeight color={4} onClick={() => { }} />
                                        <div className="header-big">{team.name}</div>
                                    </div>
                                    <div className="flex-row">

                                    </div>
                                </div>)}
                            <div className="team team-new card flex-row">
                                <Button text={"Create new Team"} autoHeight color={2} onClick={() => { }} />
                            </div>
                        </div>
                        <div className='card w-50'>
                            <HeroList savedHeroes headerText={"Saved Heroes"} heroesRef={savedHeroesRef.current} setSelectedHeroId={() => {console.log("click")}}/>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default PageTeams