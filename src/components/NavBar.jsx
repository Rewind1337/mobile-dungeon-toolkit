import Button from './Button.jsx'
import { useTranslation } from '../hooks/useTranslation.jsx'
import Logo from '../sprites/logo.webp'
import "../css/navbar.scss"

function NavBar({ switchTabTo }) {
    const heroes = useTranslation('app.navigation.heroes')
    const items = useTranslation('app.navigation.items')
    const teams = useTranslation('app.navigation.teams')
    const homeTooltip = useTranslation("app.navigation.home_tooltip")
    const games = useTranslation('app.navigation.games')
    const simulators = useTranslation('app.navigation.simulators')
    const wiki = useTranslation('app.navigation.wiki')

    return (
        <div className={'nav-bar card flex-row'}>
            <div className='nav-left flex-row'>
                <Button onMouseDown={() => { switchTabTo("heroes") }} text={heroes} color={0} />
                <Button onMouseDown={() => { switchTabTo("items") }} text={items} color={1} />
                <Button onMouseDown={() => { switchTabTo("teams") }} text={teams} color={2} />
            </div>
            <div className='nav-home flex-row'>
                <Button className="nav-home-button" onMouseDown={() => { switchTabTo("splash") }} text={Logo} imgAsText color={6} title={homeTooltip} />
            </div>
            <div className='nav-right flex-row'>
                <Button disabled text={games} color={3} />
                <Button onMouseDown={() => { switchTabTo("simulator") }} text={simulators} color={4} />
                <Button onMouseDown={() => { switchTabTo("wiki") }} text={wiki} color={5} />
            </div>
        </div>
    )
}

export default NavBar