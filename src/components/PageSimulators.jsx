import { useState } from "react"
import Button from "./Button.jsx"

import { elementSprites } from "../database/db_sprites.jsx"
import Hero from "./Hero.jsx"
import SubPageGuildBoss from "./SubPageGuildBoss.jsx"
import SubPageTitans from "./SubPageTitans.jsx"
import SubPageTowers from "./SubPageTowers.jsx"
import SubPageChapters from "./SubPageChapters.jsx"

function PageSimulators({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef, manualSaveFunction }) {
    const [pageContent, setPageContent] = useState(0)

    return (
        <>
            <div className="flex-row" style={{ justifyContent: "space-between", order: window.matchMedia("(max-width: 900px)").matches ? 1 : 0 }}>
                <div className="pagination flex-row card">
                    <Button text={"Adventure Chapters"} color={0} onClick={() => { setPageContent(0) }} />
                    <Button text={"Towers"} color={1} onClick={() => { setPageContent(1) }} />
                    <Button text={"Titans"} color={2} onClick={() => { setPageContent(2) }} />
                    <Button text={"Guild Hunt"} color={3} onClick={() => { setPageContent(3) }} />
                    <Button text={"Custom Combat"} color={4} onClick={() => { setPageContent(4) }} />
                </div>
                <div className="options flex-row card">
                    <Button text={"Manual Save"} color={5} onClick={() => { manualSaveFunction() }} />
                </div>
            </div>


            <div id='page-simulators' className='page flex-row w-100'>
                {pageContent === 0 && <SubPageChapters heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} itemsRef={itemsRef} savedItemsRef={savedItemsRef} />}
                {pageContent === 1 && <SubPageTowers heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} itemsRef={itemsRef} savedItemsRef={savedItemsRef} />}
                {pageContent === 2 && <SubPageTitans heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} itemsRef={itemsRef} savedItemsRef={savedItemsRef} />}
                {pageContent === 3 && <SubPageGuildBoss heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} itemsRef={itemsRef} savedItemsRef={savedItemsRef} />}
                {pageContent === 4 && <></>}
            </div>
        </>
    )
}

export default PageSimulators