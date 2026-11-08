import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx'
import { useTranslate } from '../hooks/useTranslate.jsx';

import '../css/hero.scss'

import Hero from './Hero.jsx'
import VirtualizedGrid from './VirtualizedGrid.jsx'
import HeroCatalogueFilters from './HeroCatalogueFilters.jsx'
import BackToTopButton from './BackToTopButton.jsx';
import { ATTRIBUTE_DEFINITIONS, ELEMENT_DEFINITIONS, RARITY_DEFINITIONS, ROLE_DEFINITIONS, getEnumNameById } from '../database/enums.jsx';
import { getSearchableValues, matchesSearchQuery, useUrlSearch } from '../js/search.jsx';

function HeroList({extraHeight = 0, savedHeroes = false, headerText, heroesRef, selectedHeroId, setSelectedHeroId, onSelectHero, onDoubleClick }) {
    const t = useTranslate()
    const { listHeight, listRef, events } = useDynamicList(extraHeight);
    const [search, setSearch, commitSearch] = useUrlSearch();
    const [filters, setFilters] = useState({
        element: null,
        role: null,
        mainAttribute: null,
        rarity: null,
        isStarred: null
    });
    const [filtersVisible, setFiltersVisible] = useState(true)
    const [sortOrder, setSortOrder] = useState("alphabetic")

    const toggleFilter = (type, value) => {
        setFilters(previous => ({
            ...previous,
            [type]: previous[type] === value ? null : value
        }))
    };

    const clearFilters = () => {
        setFilters({ element: null, role: null, mainAttribute: null, rarity: null, isStarred: null });
        setSearch("");
        commitSearch("");
    };

    const filteredHeroes = useMemo(() => {
        const result = heroesRef.filter((heroObj) => (
            (filters.element === null || heroObj.element === filters.element) &&
            (filters.role === null || heroObj.role === filters.role) &&
            (filters.mainAttribute === null || heroObj.mainAttribute === filters.mainAttribute) &&
            (filters.rarity === null || filters.rarity === heroObj.rarity) &&
            (filters.isStarred === null || heroObj.isStarred === filters.isStarred) &&
            matchesSearchQuery([
                ...getSearchableValues(heroObj, new Set(), true),
                getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(heroObj.mainAttribute)) ?? '',
                getEnumNameById(ELEMENT_DEFINITIONS, Number(heroObj.element)) ?? '',
                getEnumNameById(RARITY_DEFINITIONS, Number(heroObj.rarity)) ?? '',
                getEnumNameById(ROLE_DEFINITIONS, Number(heroObj.role)) ?? '',
            ], search, term => {
                if (term === 'starred') return heroObj.isStarred === true;
                if (term === 'not starred') return heroObj.isStarred === false;
                return undefined;
            })
        ));

        return result.sort((a, b) => {
            const byName = String(a.name).localeCompare(String(b.name), undefined, { sensitivity: "base" })
            if (sortOrder === "rarity") return Number(b.rarity ?? 0) - Number(a.rarity ?? 0) || byName
            if (sortOrder === "level") return Number(b.level ?? 0) - Number(a.level ?? 0) || byName
            return byName
        });
    }, [heroesRef, filters, search, sortOrder]);

    return (<>
        <HeroCatalogueFilters
            search={search}
            setSearch={setSearch}
            headerText={headerText}
            onSearchBlur={() => commitSearch(search)}
            rarityFilter={filters.rarity === null ? "all" : String(filters.rarity)}
            setRarityFilter={value => toggleFilter("rarity", value === "all" ? null : Number(value))}
            attributeFilter={filters.mainAttribute === null ? "all" : String(filters.mainAttribute)}
            setAttributeFilter={value => toggleFilter("mainAttribute", value === "all" ? null : Number(value))}
            elementFilter={filters.element === null ? "all" : String(filters.element)}
            setElementFilter={value => toggleFilter("element", value === "all" ? null : Number(value))}
            roleFilter={filters.role === null ? "all" : String(filters.role)}
            setRoleFilter={value => toggleFilter("role", value === "all" ? null : Number(value))}
            starredOnly={filters.isStarred === true}
            setStarredOnly={value => setFilters(previous => ({ ...previous, isStarred: value ? true : null }))}
            resultCount={filteredHeroes.length}
            totalCount={heroesRef.length}
            clearFilters={clearFilters}
            filtersVisible={filtersVisible}
            onHideFilters={() => setFiltersVisible(false)}
            onShowFilters={() => setFiltersVisible(true)}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
        />
        <div className='list hero-list flex-row virtualized-list-scroll' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {filteredHeroes.length === 0 ? (
                <div className="text-big margin-auto">{t("app.shared.noHeroesMatchFilters")}</div>
            ) : (
                <VirtualizedGrid
                    items={filteredHeroes}
                    scrollElementRef={listRef}
                    minColumnWidth={110}
                    mobileMinColumnWidth={68}
                    estimatedRowHeight={185}
                    rowGap={8}
                    columnGap={8}
                    className="hero-list-virtual"
                    rowClassName="hero-list-virtual-row"
                    renderItem={heroObj => (
                        <Hero
                            selected={(savedHeroes ? heroObj.saveId : heroObj.id) === selectedHeroId}
                            heroObj={heroObj}
                            level={savedHeroes ? (heroObj.level ?? null) : null}
                            onClick={() => {
                                const clickedId = savedHeroes ? heroObj.saveId : heroObj.id
                                if (onSelectHero) {
                                    onSelectHero(clickedId)
                                } else {
                                    setSelectedHeroId(currentId => currentId === clickedId ? null : clickedId)
                                }
                            }}
                            onDoubleClick={onDoubleClick ? () => onDoubleClick(heroObj) : undefined}
                        />
                    )}
                />
            )}
        </div>
        <BackToTopButton scrollRef={listRef} className="hero-list-back-to-top" />
    </>
    )
}

export default memo(HeroList)