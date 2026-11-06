import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'

import MDLogo from './sprites/logo.webp'
import PlayaLogo from './sprites/playa_games_logo.webp'
import Seagull from './sprites/seagull.webp'

import NavBar from './components/NavBar.jsx'
import Button from './components/Button.jsx'
import ResetTimers from './components/ResetTimers.jsx'
import { useTranslate } from './hooks/useTranslate.jsx'
import './css/not-found.scss'

import { init_hero_db } from './database/db_heroes.jsx'
import { init_item_db } from './database/db_items.jsx'
import { clearSearchFromUrl } from './js/search.jsx'

const PageItems = lazy(() => import('./components/pages/PageItems.jsx'))
const PageHeroes = lazy(() => import('./components/pages/PageHeroes.jsx'))
const PageSimulators = lazy(() => import('./components/pages/PageSimulators.jsx'))
const PageTeams = lazy(() => import('./components/pages/PageTeams.jsx'))
const PageWiki = lazy(() => import('./components/pages/PageWiki.jsx'))
const PageGames = lazy(() => import('./components/pages/PageGames.jsx'))


const BASE_HEROES = init_hero_db()
const BASE_ITEMS = init_item_db()
const PAGE_TO_ROUTE = {
  splash: '/',
  heroes: '/heroes/',
  items: '/items/',
  teams: '/teams/',
  simulator: '/simulators/',
  wiki: '/wiki/',
  games: '/games/',
};

const WIKI_TAB_TO_ROUTE = {
  overview: '/wiki/',
  'item-catalogue': '/wiki/item-catalogue/items/',
  'set-catalogue': '/wiki/item-catalogue/sets/',
  'perk-catalogue': '/wiki/perk-catalogue/',
  'hero-catalogue': '/wiki/hero-catalogue/heroes/',
  'hero-tier-list-catalogue': '/wiki/hero-catalogue/tier-list/',
  'hero-banners-catalogue': '/wiki/hero-catalogue/banners/',
  'resources-catalogue': '/wiki/resource-catalogue/resources/',
  'gems-catalogue': '/wiki/resource-catalogue/gems/',
  'status-catalogue': '/wiki/status-catalogue/',
  'skills-talents-catalogue': '/wiki/skill-catalogue/',
  'skills-catalogue': '/wiki/skill-catalogue/',
  'talents-catalogue': '/wiki/talent-catalogue/',
};

const normalizeRoute = (route) => {
  while (route.length > 1 && route.endsWith('/')) {
    route = route.slice(0, -1);
  }
  return route;
};

const ROUTE_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_TO_ROUTE).map(([page, route]) => [normalizeRoute(route), page])
);

const getPathWithoutBase = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const basePath = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  let pathname = window.location.pathname;

  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    pathname = pathname.slice(basePath.length) || '/';
  }

  return normalizeRoute(pathname);
};

const getPageFromPath = () => {
  const pathname = getPathWithoutBase();
  if (pathname === '/wiki' || pathname.startsWith('/wiki/')) return 'wiki';
  if (pathname === '/simulators' || pathname.startsWith('/simulators/')) return 'simulator';
  return ROUTE_TO_PAGE[pathname] ?? 'notFound';
};

const getWikiTabFromPath = () => {
  const pathname = getPathWithoutBase();
  return Object.entries(WIKI_TAB_TO_ROUTE)
    .find(([, route]) => normalizeRoute(route) === pathname)?.[0] ?? 'overview';
};

const SIMULATOR_TAB_TO_ROUTE = {
  overview: '/simulators/',
  adventure: '/simulators/adventure/',
  towers: '/simulators/towers/',
  titans: '/simulators/titans/',
  'guild-hunt': '/simulators/guild-hunt/',
  custom: '/simulators/custom/',
  'magic-toilet': '/simulators/magic-toilet/',
};

const getSimulatorTabFromPath = () => {
  const pathname = getPathWithoutBase();
  return Object.entries(SIMULATOR_TAB_TO_ROUTE)
    .find(([, route]) => normalizeRoute(route) === pathname)?.[0] ?? 'overview';
};

const createDefaultState = () => ({
  pageContent: 'splash',
  savedHeroesRef: [],
  savedTeamsRef: [],
  savedItemsRef: {
    WEAPONS: [],
    HELMETS: [],
    ARMORS: [],
    NECKLACES: [],
    RINGS: [],
    OTHER: []
  },
});

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const loadInitialState = () => {
  try {
    const savedState = window.localStorage.getItem('mobileDungeonToolkitData');
    if (!savedState) return createDefaultState();

    const parsedState = JSON.parse(atob(savedState));
    if (!isRecord(parsedState)) {
      throw new Error('Saved data must be an object.');
    }

    const defaults = createDefaultState();
    const savedItems = isRecord(parsedState.savedItemsRef) ? parsedState.savedItemsRef : {};
    const savedTeams = Array.isArray(parsedState.savedTeamsRef)
      ? parsedState.savedTeamsRef.filter(isRecord)
      : defaults.savedTeamsRef;
    const isUntouchedLegacyStarterSet = savedTeams.length === 3
      && ["Default Team", "Team A", "Team B"].every((name, index) => {
        const team = savedTeams[index];
        return team?.id === index
          && team?.name === name
          && Array.isArray(team.heroes)
          && team.heroes.length === 5
          && team.heroes.every(hero => hero == null);
      });
    const savedTeamsRef = isUntouchedLegacyStarterSet ? [savedTeams[0]] : savedTeams;
    const savedItemsRef = Object.fromEntries(
      Object.keys(defaults.savedItemsRef).map(slot => [
        slot,
        Array.isArray(savedItems[slot])
          ? savedItems[slot].filter(isRecord)
          : defaults.savedItemsRef[slot]
      ])
    );

    const state = {
      ...defaults,
      pageContent: typeof parsedState.pageContent === 'string' ? parsedState.pageContent : defaults.pageContent,
      savedHeroesRef: Array.isArray(parsedState.savedHeroesRef)
        ? parsedState.savedHeroesRef.filter(isRecord)
        : defaults.savedHeroesRef,
      savedTeamsRef,
      savedItemsRef
    };

    console.log('Successfully loaded Save from LocalStorage!');
    return state;
  } catch (error) {
    console.error('Failed to load / parse the save from LocalStorage; loading defaults instead.', error);
    return createDefaultState();
  }
};

function FooterLogo({ type }) {
    if (type === "game") {
        return <a className="splash-footer-logo" href="https://mobiledungeon.com/"><img className="splash-footer-logo-image" height={50} src={MDLogo} alt="Mobile Dungeon" /><span className="splash-footer-logo-text">Mobile Dungeon</span></a>
    }
    if (type === "publisher") {
        return <a className="splash-footer-logo" href="https://www.playa-games.com/"><img className="splash-footer-logo-image" height={50} src={PlayaLogo} alt="Playa Games" /><span className="splash-footer-logo-text">Playa Games</span></a>
    }
    return (<a className="splash-footer-logo" href="https://fonts.google.com/">
                    <svg className="splash-footer-logo-image" width="110" height="48" viewBox="0 0 190 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path _ngcontent-ng-c508314537="" d="M130.3 18.7v7h-2V9.3h9.6v2h-7.6v5.4h6.8v2h-6.8ZM138.8 20.1a6 6 0 0 1 1.7-4.3 5.6 5.6 0 0 1 4.2-1.7c1.6 0 3 .6 4.1 1.7a6 6 0 0 1 1.7 4.3c0 1.8-.6 3.2-1.7 4.3a5.6 5.6 0 0 1-4.1 1.7c-1.7 0-3.1-.5-4.2-1.7a6 6 0 0 1-1.7-4.3Zm2.2 0a4 4 0 0 0 1 3c.7.7 1.6 1 2.7 1 1 0 1.9-.3 2.6-1a4 4 0 0 0 1-3 4 4 0 0 0-1-2.9 3.5 3.5 0 0 0-2.6-1.1c-1 0-2 .3-2.7 1.1a4 4 0 0 0-1 3ZM152.3 14.5h2V16h.1c.3-.6.8-1 1.5-1.4.7-.4 1.4-.6 2.1-.6 1.4 0 2.5.4 3.2 1.2.7.8 1.1 2 1.1 3.4v7h-2.1v-6.9c0-1.8-1-2.8-2.8-2.8-.8 0-1.6.4-2.1 1-.6.7-.9 1.6-.9 2.5v6.2h-2.1V14.5ZM168.9 26c-1 0-1.7-.3-2.3-1-.6-.5-1-1.3-1-2.3v-6.3h-2v-2h2V11h2.2v3.5h2.8v2h-2.8V22c0 .8.1 1.3.4 1.6.3.2.6.4 1 .4l.5-.1c.2 0 .3 0 .5-.2l.7 2a6 6 0 0 1-2 .2ZM181 22.6a3 3 0 0 1-1.3 2.5c-.9.7-2 1-3.3 1-1 0-2.1-.3-3-.9a4.9 4.9 0 0 1-1.8-2.3l1.9-.8c.3.7.7 1.2 1.2 1.6a3 3 0 0 0 1.8.5c.6 0 1.2-.1 1.7-.4.4-.3.6-.7.6-1 0-.8-.5-1.3-1.6-1.6l-2-.5C173 20 172 19 172 17.5a3 3 0 0 1 1.3-2.5c.8-.6 1.9-.9 3.2-.9 1 0 2 .2 2.7.7.8.5 1.4 1.1 1.7 2l-1.9.7c-.2-.5-.5-.8-1-1.1-.5-.3-1-.4-1.7-.4-.5 0-1 .1-1.5.4-.4.3-.6.6-.6 1 0 .6.6 1.1 1.8 1.4l1.7.4c2.3.6 3.4 1.7 3.4 3.4ZM55.3 26.1a9.5 9.5 0 0 1-9.5-9.3 9.5 9.5 0 0 1 16-6.7l-1.9 1.8a6.6 6.6 0 0 0-4.6-1.9c-3.8 0-6.8 3-6.8 6.8s3 6.8 6.8 6.8c2.4 0 3.8-1 4.7-1.9.8-.7 1.3-1.8 1.4-3.2h-6.1V16h8.6l.2 1.6c0 1.9-.5 4.2-2.2 6a8.7 8.7 0 0 1-6.6 2.5ZM77.4 20.1c0 3.5-2.6 6-6 6-3.2 0-5.9-2.5-5.9-6s2.7-6 6-6 6 2.5 6 6Zm-2.6 0c0-2.1-1.5-3.6-3.3-3.6-1.8 0-3.4 1.5-3.4 3.6s1.6 3.6 3.4 3.6c1.8 0 3.3-1.4 3.3-3.6ZM90.8 20.1c0 3.5-2.6 6-6 6-3.2 0-5.9-2.5-5.9-6s2.7-6 6-6c3.2 0 6 2.5 6 6Zm-2.6 0c0-2.1-1.5-3.6-3.3-3.6-1.8 0-3.4 1.5-3.4 3.6s1.6 3.6 3.4 3.6c1.8 0 3.3-1.4 3.3-3.6ZM103.9 14.5v10.8c0 4.4-2.7 6.2-5.8 6.2-3 0-4.7-2-5.3-3.5l2.3-1c.4 1 1.4 2.1 3 2.1 2 0 3.2-1.2 3.2-3.5v-.8c-.6.7-1.8 1.3-3.2 1.3a6 6 0 0 1-5.8-6 6 6 0 0 1 5.8-6c1.4 0 2.6.7 3.2 1.4v-1h2.6Zm-2.4 5.7c0-2.2-1.4-3.7-3.2-3.7-1.8 0-3.4 1.5-3.4 3.7 0 2 1.6 3.6 3.4 3.6 1.8 0 3.2-1.6 3.2-3.6ZM108.5 8.1v17.7H106V8h2.6ZM119 22.1l2 1.4a6 6 0 0 1-5 2.6c-3.4 0-6-2.6-6-6 0-3.5 2.6-6 5.7-6s4.7 2.5 5.2 3.9l.3.6L113 22a3 3 0 0 0 2.9 1.8c1.4 0 2.3-.7 3-1.7Zm-6.4-2.2 5.5-2.2c-.4-.7-1.2-1.2-2.3-1.2a3.3 3.3 0 0 0-3.2 3.4Z" fill="#C4C7C5"></path><path _ngcontent-ng-c508314537="" d="m16.7 20.7-4.4 6.6h-10L16.7 6v14.7ZM25.3 6h-8.6v21.3h8.6V6ZM6 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#C4C7C5" strokeWidth="1.5" strokeLinejoin="round"></path><path _ngcontent-ng-c508314537="" d="M25.3 15.3a4.7 4.7 0 0 1 0-9.3m0 9.3V6m0 9.3a4.7 4.7 0 0 0 0-9.3" stroke="#C4C7C5" strokeWidth="1.5"></path><path _ngcontent-ng-c508314537="" d="M25.3 15.3a6 6 0 0 1 0 12" stroke="#C4C7C5" strokeWidth="1.5" strokeLinejoin="round"></path><path _ngcontent-ng-c508314537="" d="M25.3 27.3a6 6 0 0 1 0-12" stroke="#C4C7C5" strokeWidth="1.5"></path></svg>
                    <span className="splash-footer-logo-text">Google Fonts</span>
                  </a>)
}

function renderFooterCopy(template) {
    return template.split(/(\\{\\{game\\}\\}|\\{\\{publisher\\}\\}|\\{\\{fontProvider\\}\\})/g).map((part, index) => {
        if (part === "{{game}}") return <FooterLogo key={index} type="game" />
        if (part === "{{publisher}}") return <FooterLogo key={index} type="publisher" />
        if (part === "{{fontProvider}}") return <FooterLogo key={index} type="fontProvider" />
        return <span key={index}>{part}</span>
    })
}

function App() {
    const t = useTranslate()
  const [initialState] = useState(loadInitialState)

  const heroesRef = useRef(BASE_HEROES)
  const savedHeroesRef = useRef(initialState.savedHeroesRef)
  const savedTeamsRef = useRef(initialState.savedTeamsRef)

  const itemsRef = useRef(BASE_ITEMS)
  const savedItemsRef = useRef(initialState.savedItemsRef)

  // app related
  const [pageContent, setPageContent] = useState(getPageFromPath)
  const [activeWikiTab, setActiveWikiTab] = useState(getWikiTabFromPath)
  const [activeSimulatorTab, setActiveSimulatorTab] = useState(getSimulatorTabFromPath)
  const [importStatus, setImportStatus] = useState("")

  const saveToLocalStorage = useCallback(() => {
    const saveState = {
        pageContent,
        savedHeroesRef: savedHeroesRef.current,
        savedTeamsRef: savedTeamsRef.current,
        savedItemsRef: {
            ...savedItemsRef.current
        }
    };

    const encodedState = btoa(JSON.stringify(saveState));

    try {
        localStorage.setItem('mobileDungeonToolkitData', encodedState);
        console.log('Successfully saved to LocalStorage');
    } catch (error) {
        console.error('Failed to save to LocalStorage; ', error);
    }
  }, [pageContent]);


  useEffect(() => {
    const handlePopState = () => {
      setPageContent(getPageFromPath());
      setActiveWikiTab(getWikiTabFromPath());
      setActiveSimulatorTab(getSimulatorTabFromPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [saveToLocalStorage]);

  const switchTabTo = (page) => {
    const route = PAGE_TO_ROUTE[page] ?? PAGE_TO_ROUTE.splash;
    const baseUrl = import.meta.env.BASE_URL;
    const destination = route === '/' ? baseUrl : `${baseUrl}${route.slice(1)}`;

    if (window.location.pathname !== destination) {
      clearSearchFromUrl();
      window.history.pushState({}, '', destination);
    }

    if (page === 'wiki') setActiveWikiTab('overview');
    if (page === 'simulator') setActiveSimulatorTab('overview');
    setPageContent(page);
  };

  const switchWikiCatalogueTo = (tab) => {
    const route = WIKI_TAB_TO_ROUTE[tab];
    if (!route) return;

    const baseUrl = import.meta.env.BASE_URL;
    const destination = `${baseUrl}${route.slice(1)}`;

    if (window.location.pathname !== destination) {
      clearSearchFromUrl();
      window.history.pushState({}, '', destination);
    }

    setActiveWikiTab(tab);
    setPageContent('wiki');
  }

  const switchSimulatorTo = (tab) => {
    const route = SIMULATOR_TAB_TO_ROUTE[tab];
    if (!route) return;
    const baseUrl = import.meta.env.BASE_URL;
    const destination = `${baseUrl}${route.slice(1)}`;
    if (window.location.pathname !== destination) {
      clearSearchFromUrl();
      window.history.pushState({}, '', destination);
    }
    setActiveSimulatorTab(tab);
    setPageContent('simulator');
  }

  return (
    <>
      {pageContent !== 'notFound' && <NavBar switchTabTo={switchTabTo} />}

      {importStatus && <div className="text" role="status" aria-live="polite" style={{ padding: "4px 10px" }}>{importStatus}</div>}

      <Suspense fallback={
        <div className="page flex-row w-100">
            <div className="card">{importStatus || "Loading..."}</div>
        </div>
      }>
        {pageContent === 'notFound' &&
          <main id="page-not-found" className="not-found-page">
            <section className="not-found-card card flex-col">
              <div className="header-big">{t("app.pages.notFound.title")}</div>
              <img className="not-found-seagull margin-auto" src={Seagull} alt={t("app.pages.splash.seagullAlt")} />
              <div className="header">{t("app.pages.notFound.heading")}</div>
              <p className="text">{t("app.pages.notFound.description")}</p>
              <nav className="not-found-links flex-row w-100" >
                <Button className="not-found-link" text={t("app.navigation.heroes")} color={0} onClick={() => switchTabTo('heroes')} />
                <Button className="not-found-link" text={t("app.navigation.items")} color={1} onClick={() => switchTabTo('items')} />
                <Button className="not-found-link" text={t("app.navigation.teams")} color={2} onClick={() => switchTabTo('teams')} />
                <Button className="not-found-link" text={t("app.navigation.home")} color={6} onClick={() => switchTabTo('splash')} />
                <Button className="not-found-link" text={t("app.navigation.games")} color={3} disabled={true} />
                <Button className="not-found-link" text={t("app.navigation.simulators")} color={4} onClick={() => switchTabTo("simulator")} />
                <Button className="not-found-link" text={t("app.navigation.wiki")} color={5} onClick={() => switchTabTo('wiki')} />
              </nav>
            </section>
          </main>
        }

        {pageContent === 'splash' &&
          <div id='page-splash' className='page flex-col w-100'>
            <section className="under-construction-row card" style={{height: "50px"}} >
                <div className="under-construction-sign">
                    <span className="under-construction-caption">{t("app.pages.splash.siteIs")}</span>
                    <span className="under-construction-label">{t("app.pages.splash.underConstruction")}</span>
                    <span className="under-construction-caption">{t("app.pages.splash.moreFeatures")}</span>
                </div>
            </section>
            <ResetTimers />
            <div className='flex-row top'>
              <div className='card management flex-col'>
                <div className='header-big'>{t("app.pages.splash.management")}</div>
                <div className='flex-row'>
                  <div className='card heroes flex-col home-navigation-tile' role="button" tabIndex={0}  onClick={() => switchTabTo('heroes')} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); switchTabTo('heroes'); } }}>
                    <div className='header card card-static'>{t("app.shared.heroManagement")}</div>
                  </div>
                  <div className='card items flex-col home-navigation-tile' role="button" tabIndex={0}  onClick={() => switchTabTo('items')} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); switchTabTo('items'); } }}>
                    <div className='header card card-static'>{t("app.shared.itemManagement")}</div>
                  </div>
                  <div className='card teams flex-col home-navigation-tile' role="button" tabIndex={0}  onClick={() => switchTabTo('teams')} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); switchTabTo('teams'); } }}>
                    <div className='header card card-static'>{t("app.shared.teamManagement")}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex-row bottom'>
              <div className='card simulations flex-col'>
                <div className='header-big'>{t("app.pages.splash.simulations")}</div>
                <div className='simulation-navigation-grid'>
                  <div className='card chapters flex-col home-navigation-tile is-disabled' aria-disabled="true" >
                    <div className='header card card-static'>{t("app.pages.adventureChapters.title")}</div>
                  </div>
                  <div className='card towers flex-col home-navigation-tile is-disabled' aria-disabled="true" >
                    <div className='header card card-static'>{t("app.pages.towers.title")}</div>
                  </div>
                  <div className='card titans flex-col home-navigation-tile is-disabled' aria-disabled="true" >
                    <div className='header card card-static'>{t("app.pages.titans.title")}</div>
                  </div>
                  <div className='card guildbosses flex-col home-navigation-tile is-disabled' aria-disabled="true" >
                    <div className='header card card-static'>{t("app.pages.guildHunt.title")}</div>
                  </div>
                  <div className='card custom-combat flex-col home-navigation-tile is-disabled' aria-disabled="true" >
                    <div className='header card card-static'>{t("app.pages.customCombat.title")}</div>
                  </div>
                  <div className='card magic-toilet-tile flex-col home-navigation-tile' role="button" tabIndex={0}  onClick={() => switchSimulatorTo('magic-toilet')} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); switchSimulatorTo('magic-toilet'); } }}>
                    <div className='header card card-static'>{t("app.pages.magicToilet.title")}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex-col splash-footer-wrapper'>
              <div className='card footer flex-row'>
                <a className="splash-source-code-link" href='https://www.github.com/rewind1337/mobile-dungeon-toolkit'>
                  <Button className="splash-source-code-button" text={t("app.pages.splash.sourceCode")} color={3} />
                </a>
                <div className="text flex-row splash-footer-ownership splash-footer-copy">{renderFooterCopy(t("app.pages.footer"))}</div>
              </div>
            </div>
          </div >
        }

        {pageContent === 'heroes' && <PageHeroes itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedItemsRef={savedItemsRef} manualSaveFunction={saveToLocalStorage} onImportStatusChange={setImportStatus} />}

        {pageContent === 'items' && <PageItems itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedItemsRef={savedItemsRef} manualSaveFunction={saveToLocalStorage} onImportStatusChange={setImportStatus} />}

        {pageContent === 'teams' && <PageTeams itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedTeamsRef={savedTeamsRef} savedItemsRef={savedItemsRef} manualSaveFunction={saveToLocalStorage} />}

        {pageContent === 'simulator' && <PageSimulators activeTab={activeSimulatorTab} onTabChange={switchSimulatorTo} itemsRef={itemsRef} heroesRef={heroesRef} savedHeroesRef={savedHeroesRef} savedTeamsRef={savedTeamsRef} savedItemsRef={savedItemsRef} />}

        {pageContent === 'games' && <PageGames />}

        {pageContent === 'wiki' && (
          <PageWiki
            itemsRef={itemsRef}
            heroesRef={heroesRef}
            activeTab={activeWikiTab}
            onTabChange={switchWikiCatalogueTo}
          />
        )}

      </Suspense>
    </>
  )
}

export default App
