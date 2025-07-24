import Button from './Button.jsx'
import MDSkull from '../sprites/favicon.png'
import "../css/navbar.scss"

function NavBar({ switchTabTo }) {

    return (
        <div className={'nav-bar card flex-row'}>
            <div className='nav-left flex-row'>
                <Button onMouseDown={() => { switchTabTo("heroes") }} text={"Heroes"} color={0} />
                <Button onMouseDown={() => { switchTabTo("items") }} text={"Items"} color={1} />
                <Button onMouseDown={() => { switchTabTo("teams") }} text={"Teams"} color={2} />
            </div>
            <div className='flex-row'>
                <img height={45} width={45} src={MDSkull} />
                <div className='header-big nav-bar-header'>Mobile Dungeon Toolkit</div>
                <div>&nbsp;</div>
            </div>
            <div className='nav-right flex-row'>
                <Button onMouseDown={() => { switchTabTo("splash") }} text={"Splash"} color={3} />
                <Button onMouseDown={() => { switchTabTo("simulator") }} text={"Simulators"} color={4} />
                <Button onMouseDown={() => { switchTabTo("other") }} text={"Other Stuff"} color={5} />
            </div>
        </div>
    )
}

export default NavBar