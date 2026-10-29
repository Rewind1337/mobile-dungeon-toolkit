import { humanizeKey, stringify } from "../js/skillsTalentsUtils.jsx"
import "../css/infos.scss"
import "../css/infos_heroes.scss"

export default function TalentEffect({ effect }) {
    const entries = (Array.isArray(effect) ? effect : [effect]).flatMap(value => {
        if (value && typeof value === "object" && !Array.isArray(value)) return Object.entries(value)
        return [["Effect", value]]
    })
    return <dl className="talent-effect-list flex-row justify-center">
        {entries.map(([key, value], index) => <div className="talent-effect-entry w-fit" key={key + "-" + index}>
            <dt className="text">{humanizeKey(key)}</dt>
            <dd className="text">{typeof value === "object" && value !== null ? stringify(value) : String(value)}</dd>
        </div>)}
    </dl>
}
