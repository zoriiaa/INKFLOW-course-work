export const closeCatalogFilters = () => {
    window.dispatchEvent(new Event('inkflow-close-catalog-filters'));
};

export const closeSiteNavigation = () => {
    window.dispatchEvent(new Event('inkflow-close-site-navigation'));
};
