/**
 * Calculate the available vertical space for a hero or item preview list.
 * The mobile offset and existing desktop/mobile list-header heights are preserved.
 */
export function getPreviewListHeight(listElement, viewportHeight, isMobile, constants) {
    let height = viewportHeight - constants.listHeightDefault - 5

    if (isMobile) {
        height = viewportHeight - constants.listHeightDefault + 77
    }

    if (listElement) {
        const headerHeight = isMobile ? constants.listHeightMobile : constants.listHeightDefault
        height = viewportHeight - (headerHeight + listElement.offsetTop)
    }

    return height
}
