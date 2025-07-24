import { useEffect, useRef, useState } from 'react'

import MDLogo from './sprites/logo.webp'
import PlayaLogo from './sprites/playa_games_logo.png'

import NavBar from './components/NavBar.jsx'
import Button from './components/Button.jsx'

import { init_hero_db } from './database/db_heroes.jsx'
import { init_item_db } from './database/db_items.jsx'

import PageItems from './components/PageItems.jsx'
import PageHeroes from './components/PageHeroes.jsx'
import PageSimulators from './components/PageSimulators.jsx'
import PageTeams from './components/PageTeams.jsx'

import { heroSprites, itemSprites, iconSprites, elementSprites, roleSprites, attributeSprites, raritySprites, statusSprites } from './database/db_sprites.jsx'
import { usePreloadImages } from './hooks/usePreloadImages.jsx'

const BASE_HEROES = init_hero_db()
const BASE_ITEMS = init_item_db()
const defaultState = {
  pageContent: 'splash',
  savedHeroesRef: [],
  savedItemsRef: {
    WEAPONS: [],
    HELMETS: [],
    ARMORS: [],
    NECKLACES: [],
    RINGS: [],
    OTHER: []
  },
};

const loadInitialState = () => {
  const savedState = localStorage.getItem('mobileDungeonToolkitData');

  if (savedState) {
    try {
      let newState = JSON.parse(JSON.stringify(defaultState))
      const parsedState = JSON.parse(atob(savedState));
      for (let key in parsedState) {
        newState[key] = parsedState[key];
      }
      // hero element src correction
      let hero_array = newState["savedHeroesRef"]
      for (let i = 0; i < hero_array.length; i++) {
        hero_array[i].elementSrc = elementSprites[hero_array[i].element]
      }
      newState["savedHeroesRef"] = hero_array

      // item icon src correction
      let item_root = newState["savedItemsRef"]
      for (let key in item_root) {
        let item_array = item_root[key]
        for (let i = 0; i < item_array.length; i++) {
          item_array[i].iconSrc = iconSprites[item_array[i].iconType]
        }
        item_root[key] = item_array;
      }
      newState["savedItemsRef"] = item_root
      console.log('Successfully loaded Save from LocalStorage!');
      return newState
    } catch (error) {
      console.error('Failed to load / parse the save from LocalStorage; ', error);
    }
  } else {
    console.log('No previous save found, loading default');
    return defaultState
  }
};

function App() {
  usePreloadImages([
    ...Object.values(heroSprites),
    ...Object.values(itemSprites),
    ...Object.values(iconSprites),
    ...Object.values(elementSprites),
    ...Object.values(roleSprites),
    ...Object.values(attributeSprites),
    ...Object.values(raritySprites),
    ...Object.values(statusSprites),
  ]);
  const initialState = loadInitialState()

  const heroesRef = useRef(BASE_HEROES)
  const savedHeroesRef = useRef(initialState.savedHeroesRef)

  const itemsRef = useRef(BASE_ITEMS)
  const savedItemsRef = useRef(initialState.savedItemsRef)

  // app related
  const [pageContent, setPageContent] = useState(initialState.pageContent)
  const [timeStamp, setTimeStamp] = useState(0)

  const saveToLocalStorage = () => {
    let saveState = {}
    Object.keys(defaultState).forEach(key => {
      if (key == "savedHeroesRef") {
        let refData = eval(key).current; // Access state variable by name
        saveState[key] = refData
      } else if (key == "savedItemsRef") {
        let refData = eval(key).current; // Access state variable by name
        saveState[key] = {};
        Object.keys(refData).forEach(key2 => {
          saveState[key][key2] = [];
          let typedArray = refData[key2]
          saveState[key][key2] = typedArray;
        })
      } else {
        saveState[key] = eval(key) // Access state variable by name
      }
    })

    saveState = btoa(JSON.stringify(saveState))

    try {
      localStorage.setItem('mobileDungeonToolkitData', saveState)
      console.log('Successfully saved to LocalStorage');
    } catch (error) {
      console.error('Failed to save to LocalStorage; ', error)
    }
  }

  useEffect(() => {
    let timerID = setInterval(() => { setTimeStamp(Date.now()) }, 30000)
    return () => {
      clearInterval(timerID)
    }
  }, [])

  useEffect(() => {
    saveToLocalStorage()
  }, [pageContent]);

  const switchTabTo = (page) => {
    setPageContent(page)
  }

  return (
    <>
      <NavBar switchTabTo={switchTabTo} />

      {pageContent === 'splash' &&
        <div id='page-splash' className='page flex-col w-100'>
          <div className='card welcome flex-col'>
            <div className='header-big'>Mobile Dungeon Toolkit</div>

          </div>
          <div className='flex-row top'>
            <div className='card management flex-col'>
              <div className='header-big'>Management</div>
              <div className='flex-row'>
                <div className='card heroes flex-col'>
                  <div className='header'>Hero Management</div>
                  <Button text={"Take me there"} color={0} onMouseDown={() => { switchTabTo('heroes') }} />
                </div>
                <div className='card items flex-col'>
                  <div className='header'>Item Management</div>
                  <Button text={"Take me there"} color={1} onMouseDown={() => { switchTabTo('items') }} />
                </div>
                <div className='card teams flex-col'>
                  <div className='header'>Team Management</div>
                  <Button text={"Take me there"} color={2} onMouseDown={() => { switchTabTo('teams') }} />
                </div>
              </div>
            </div>
          </div>
          <div className='flex-row bottom'>
            <div className='card simulations flex-col'>
              <div className='header-big'>Simulations</div>
              <div className='flex-row'>
                <div className='card chapters flex-col'>
                  <div className='header'>Chapters</div>
                </div>

                <div className='card titans flex-col'>
                  <div className='header'>Titans</div>
                </div>

                <div className='card towers flex-col'>
                  <div className='header'>Towers</div>
                </div>

                <div className='card guildbosses flex-col'>
                  <div className='header'>Guildbosses</div>
                </div>
              </div>
              <Button text={"Take me there"} color={4} onMouseDown={() => { switchTabTo('simulator') }} />
            </div>
          </div>
          <div className='flex-col'>
            <div className='card footer flex-row'>
              <a className="w-100" href='https://www.github.com/rewind1337/mobile-dungeon-toolkit'>
                <Button autoHeight text={"Source Code"} color={3} />
              </a>
              <div className='text flex-row'>
                <div className='text flex-row'>
                  <div className="text">The Game </div>
                  <a href="https://mobiledungeon.com/">
                    <img height={50} src={MDLogo} alt='Mobile Dungeon' />
                  </a>
                </div>
                <div className='text flex-row'>
                  <div className="text">and all of the Images used here are owned by</div>
                  <a href="https://www.playa-games.com/">
                    <img height={50} src={PlayaLogo} alt='Playa Games' />
                  </a>
                </div>
              </div>
              <div className='text flex-row'>
                <div className='text flex-row'>
                  <div className="text">This site is not affiliated with</div>
                  <a href="https://www.playa-games.com/">
                    <img height={50} src={PlayaLogo} alt='Playa Games' />
                  </a>
                  <div className="text">in any way.</div>
                </div>
              </div>
              <div className='text flex-row'>
                <div className="text">Fonts from</div>
                <a href="https://fonts.google.com/">
                  <svg width="110" height="48" viewBox="0 0 190 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path _ngcontent-ng-c508314537="" d="M130.3 18.7v7h-2V9.3h9.6v2h-7.6v5.4h6.8v2h-6.8ZM138.8 20.1a6 6 0 0 1 1.7-4.3 5.6 5.6 0 0 1 4.2-1.7c1.6 0 3 .6 4.1 1.7a6 6 0 0 1 1.7 4.3c0 1.8-.6 3.2-1.7 4.3a5.6 5.6 0 0 1-4.1 1.7c-1.7 0-3.1-.5-4.2-1.7a6 6 0 0 1-1.7-4.3Zm2.2 0a4 4 0 0 0 1 3c.7.7 1.6 1 2.7 1 1 0 1.9-.3 2.6-1a4 4 0 0 0 1-3 4 4 0 0 0-1-2.9 3.5 3.5 0 0 0-2.6-1.1c-1 0-2 .3-2.7 1.1a4 4 0 0 0-1 3ZM152.3 14.5h2V16h.1c.3-.6.8-1 1.5-1.4.7-.4 1.4-.6 2.1-.6 1.4 0 2.5.4 3.2 1.2.7.8 1.1 2 1.1 3.4v7h-2.1v-6.9c0-1.8-1-2.8-2.8-2.8-.8 0-1.6.4-2.1 1-.6.7-.9 1.6-.9 2.5v6.2h-2.1V14.5ZM168.9 26c-1 0-1.7-.3-2.3-1-.6-.5-1-1.3-1-2.3v-6.3h-2v-2h2V11h2.2v3.5h2.8v2h-2.8V22c0 .8.1 1.3.4 1.6.3.2.6.4 1 .4l.5-.1c.2 0 .3 0 .5-.2l.7 2a6 6 0 0 1-2 .2ZM181 22.6a3 3 0 0 1-1.3 2.5c-.9.7-2 1-3.3 1-1 0-2.1-.3-3-.9a4.9 4.9 0 0 1-1.8-2.3l1.9-.8c.3.7.7 1.2 1.2 1.6a3 3 0 0 0 1.8.5c.6 0 1.2-.1 1.7-.4.4-.3.6-.7.6-1 0-.8-.5-1.3-1.6-1.6l-2-.5C173 20 172 19 172 17.5a3 3 0 0 1 1.3-2.5c.8-.6 1.9-.9 3.2-.9 1 0 2 .2 2.7.7.8.5 1.4 1.1 1.7 2l-1.9.7c-.2-.5-.5-.8-1-1.1-.5-.3-1-.4-1.7-.4-.5 0-1 .1-1.5.4-.4.3-.6.6-.6 1 0 .6.6 1.1 1.8 1.4l1.7.4c2.3.6 3.4 1.7 3.4 3.4ZM55.3 26.1a9.5 9.5 0 0 1-9.5-9.3 9.5 9.5 0 0 1 16-6.7l-1.9 1.8a6.6 6.6 0 0 0-4.6-1.9c-3.8 0-6.8 3-6.8 6.8s3 6.8 6.8 6.8c2.4 0 3.8-1 4.7-1.9.8-.7 1.3-1.8 1.4-3.2h-6.1V16h8.6l.2 1.6c0 1.9-.5 4.2-2.2 6a8.7 8.7 0 0 1-6.6 2.5ZM77.4 20.1c0 3.5-2.6 6-6 6-3.2 0-5.9-2.5-5.9-6s2.7-6 6-6 6 2.5 6 6Zm-2.6 0c0-2.1-1.5-3.6-3.3-3.6-1.8 0-3.4 1.5-3.4 3.6s1.6 3.6 3.4 3.6c1.8 0 3.3-1.4 3.3-3.6ZM90.8 20.1c0 3.5-2.6 6-6 6-3.2 0-5.9-2.5-5.9-6s2.7-6 6-6c3.2 0 6 2.5 6 6Zm-2.6 0c0-2.1-1.5-3.6-3.3-3.6-1.8 0-3.4 1.5-3.4 3.6s1.6 3.6 3.4 3.6c1.8 0 3.3-1.4 3.3-3.6ZM103.9 14.5v10.8c0 4.4-2.7 6.2-5.8 6.2-3 0-4.7-2-5.3-3.5l2.3-1c.4 1 1.4 2.1 3 2.1 2 0 3.2-1.2 3.2-3.5v-.8c-.6.7-1.8 1.3-3.2 1.3a6 6 0 0 1-5.8-6 6 6 0 0 1 5.8-6c1.4 0 2.6.7 3.2 1.4v-1h2.6Zm-2.4 5.7c0-2.2-1.4-3.7-3.2-3.7-1.8 0-3.4 1.5-3.4 3.7 0 2 1.6 3.6 3.4 3.6 1.8 0 3.2-1.6 3.2-3.6ZM108.5 8.1v17.7H106V8h2.6ZM119 22.1l2 1.4a6 6 0 0 1-5 2.6c-3.4 0-6-2.6-6-6 0-3.5 2.6-6 5.7-6s4.7 2.5 5.2 3.9l.3.6L113 22a3 3 0 0 0 2.9 1.8c1.4 0 2.3-.7 3-1.7Zm-6.4-2.2 5.5-2.2c-.4-.7-1.2-1.2-2.3-1.2a3.3 3.3 0 0 0-3.2 3.4Z" fill="#C4C7C5"></path><path _ngcontent-ng-c508314537="" d="m16.7 20.7-4.4 6.6h-10L16.7 6v14.7ZM25.3 6h-8.6v21.3h8.6V6ZM6 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#C4C7C5" stroke-width="1.5" stroke-linejoin="round"></path><path _ngcontent-ng-c508314537="" d="M25.3 15.3a4.7 4.7 0 0 1 0-9.3m0 9.3V6m0 9.3a4.7 4.7 0 0 0 0-9.3" stroke="#C4C7C5" stroke-width="1.5"></path><path _ngcontent-ng-c508314537="" d="M25.3 15.3a6 6 0 0 1 0 12" stroke="#C4C7C5" stroke-width="1.5" stroke-linejoin="round"></path><path _ngcontent-ng-c508314537="" d="M25.3 27.3a6 6 0 0 1 0-12" stroke="#C4C7C5" stroke-width="1.5"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div >
      }

      {pageContent === 'heroes' && <PageHeroes itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedItemsRef={savedItemsRef} manualSaveFunction={saveToLocalStorage} />}

      {pageContent === 'items' && <PageItems itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedItemsRef={savedItemsRef} manualSaveFunction={saveToLocalStorage} />}

      {pageContent === 'teams' && <PageTeams itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedItemsRef={savedItemsRef} manualSaveFunction={saveToLocalStorage} />}

      {pageContent === 'simulator' && <PageSimulators itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedItemsRef={savedItemsRef} manualSaveFunction={saveToLocalStorage} />}

      {pageContent === 'other' && <></>}

      {
        pageContent === '' && <div className='flex-row flex-wrap'>
          {Array.from(Object.keys(statusSprites)).map(status =>
            <img src={statusSprites[status]} title={status} style={{ width: "64px", height: "64px" }}></img>)}
        </div>
      }
    </>
  )
}

export default App
