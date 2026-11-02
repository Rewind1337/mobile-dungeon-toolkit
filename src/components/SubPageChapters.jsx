import { useState } from "react"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { SimulatorEntryDetails } from "./SimulatorEntryList.jsx"
import Button from "./Button.jsx"
import LightworldIcon from "../sprites/simulation/lightworld_icon.webp"
import Threshold1Icon from "../sprites/simulation/threshold1_icon.webp"
import Threshold2Icon from "../sprites/simulation/threshold2_icon.webp"
import Threshold3Icon from "../sprites/simulation/threshold3_icon.webp"

const CHAPTERS = [
    { id: 0, name: "Maerwynn", stages: [] },
    { id: 1, name: "Black Forest", stages: [] },
    { id: 2, name: "Gnarogrim", stages: [] },
    { id: 3, name: "Stumble Steppe", stages: [] },
    { id: 4, name: "Split Canyon", stages: [] },
    { id: 5, name: "Sunburn Desert", stages: [] },
    { id: 6, name: "Skull Island", stages: [] },
    { id: 7, name: "Sprawling Jungle", stages: [] },
    { id: 8, name: "Mojo Mangroves", stages: [] },
    { id: 9, name: "Northrunt", stages: [] },
    { id: 10, name: "Shadowrock Mountain", stages: [] },
    { id: 11, name: "Plains of Oz'Korr", stages: [] },
    { id: 12, name: "Nevermoor", stages: [] },
    { id: 13, name: "Rotten Lands", stages: [] },
    { id: 14, name: "Busted Lands", stages: [] },
    { id: 15, name: "Tusk Mountain", stages: [] },
    { id: 16, name: "Magmaron", stages: [] },
]

const SHADOW_CHAPTERS = [
    { id: 0, name: "Maerwynn", stages: [] },
    { id: 1, name: "Black Forest", stages: [] },
    { id: 2, name: "Gnarogrim", stages: [] },
    { id: 3, name: "Stumble Steppe", stages: [] },
    { id: 4, name: "Split Canyon", stages: [] },
    { id: 5, name: "Sunburn Desert", stages: [] },
    { id: 6, name: "Skull Island", stages: [] },
    { id: 7, name: "Sprawling Jungle", stages: [] },
    { id: 8, name: "Mojo Mangroves", stages: [] },
    { id: 9, name: "Northrunt", stages: [] },
    { id: 10, name: "Shadowrock Mountain", stages: [] },
    { id: 11, name: "Plains of Oz'Korr", stages: [] },
]

const SHADOW_THRESHOLDS = [1, 2, 3]

function Chapter({ chapter, shadowChapter, onSelect }) {
    const thresholdIcons = {
        1: Threshold1Icon,
        2: Threshold2Icon,
        3: Threshold3Icon,
    }

    return (
        <div className="chapter-wrapper flex-row">
            <Button
                className="chapter card flex-row"
                dataId={chapter.id}
                dataThreshold={0}
                prefix={<span className="text">{chapter.id + 1}</span>}
                text={<span className="header">{chapter.name}</span>}
                suffix={<img src={LightworldIcon} alt="" loading="lazy" decoding="async" draggable={false} />}
                onClick={() => onSelect(chapter, 0)}
            />
            {shadowChapter
                ? SHADOW_THRESHOLDS.map(threshold => (
                    <Button
                        className="chapter-shadow card"
                        key={threshold}
                        dataId={shadowChapter.id}
                        dataThreshold={threshold}
                        title={"Shadow World " + threshold + " · Threshold " + threshold}
                        text={<span className="header">SW {threshold}</span>}
                        suffix={<img src={thresholdIcons[threshold]} alt="" loading="lazy" decoding="async" draggable={false} />}
                        onClick={() => onSelect(shadowChapter, threshold)}
                    />
                ))
                : <span className="chapter-shadow-placeholder text" aria-label="Shadow World chapters coming soon">Soon...</span>}
        </div>
    )
}

function SubPageChapters() {
    const { listHeight, listRef, events } = useDynamicList(0, true)
    const [selectedChapter, setSelectedChapter] = useState(null)

    const selectChapter = (chapter, threshold) => setSelectedChapter({ chapter, threshold })

    return (
        <div className="simulator-selection-layout page flex-row w-100">
            <section className="card w-66 simulator-selection-list">
                <div className="header-big">Select Chapter</div>
                <div ref={listRef} {...events} className="list chapter-list flex-col" style={{ maxHeight: listHeight }}>
                    {CHAPTERS.map(chapter => (
                        <Chapter key={`chapter-${chapter.id}`} chapter={chapter}
                            shadowChapter={SHADOW_CHAPTERS.find(shadow => shadow.id === chapter.id)}
                            onSelect={selectChapter} />
                    ))}
                </div>
            </section>
            <section className={"card w-100 simulator-selection-detail" + (selectedChapter?.threshold > 0 ? " is-shadow-world" : "")}>
                {selectedChapter ? (
                    <>
                        <SimulatorEntryDetails entry={selectedChapter.chapter} title={"Chapter " + (selectedChapter.chapter.id + 1) + " - " + selectedChapter.chapter.name + (selectedChapter.threshold > 0 ? " - Threshold " + selectedChapter.threshold : "")} emptyMessage="No stage entries have been defined yet." />
                    </>
                ) : (
                    <div className="header-big">Select a Chapter</div>
                )}
            </section>
        </div>
    )
}

export default SubPageChapters
