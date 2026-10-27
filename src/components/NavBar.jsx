import Button from './Button.jsx'
import MDSkull from '../sprites/favicon.png'
import Logo from '../sprites/logo.webp'
import "../css/navbar.scss"

function NavBar({ switchTabTo }) {

    return (
        <div className={'nav-bar card flex-row'}>
            <div className='nav-left flex-row'>
                <Button onMouseDown={() => { switchTabTo("heroes") }} text={"Heroes"} color={0} />
                <Button onMouseDown={() => { switchTabTo("items") }} text={"Items"} color={1} />
                <Button disabled onMouseDown={() => { switchTabTo("teams") }} text={"Teams"} color={2} />
            </div>
            <div className='flex-row'>
                <img height={45} src={Logo} alt="Mobile Dungeon Toolkit" />
            </div>
            <div className='nav-right flex-row'>
                <Button onMouseDown={() => { switchTabTo("splash") }} text={"Home"} color={3} />
                <Button disabled onMouseDown={() => { switchTabTo("simulator") }} text={"Simulators"} color={4} />
                <Button onMouseDown={() => { switchTabTo("info") }} text={"Info"} color={5} />
            </div>
        </div>
    )
}

export default NavBar