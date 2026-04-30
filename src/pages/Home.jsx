import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../data/products";

export default function Home() {
  const products = getProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const categories = useMemo(() => {
    const values = new Set();
    for (const product of products) values.add(product.category);
    return ["All", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const datasetMinPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.min(...products.map((p) => p.price));
  }, [products]);

  const datasetMaxPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(String(datasetMinPrice));
  const [maxPrice, setMaxPrice] = useState(String(datasetMaxPrice));
  const [sort, setSort] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const trimmedSearch = search.trim().toLowerCase();
    const tokens =
      trimmedSearch.length === 0
        ? []
        : trimmedSearch.split(/\s+/).filter(Boolean);

    const minPriceNumber =
      minPrice.trim() === "" ? Number.NEGATIVE_INFINITY : Number(minPrice);
    const maxPriceNumber =
      maxPrice.trim() === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);

    const withScores = products
      .map((product) => {
        if (tokens.length === 0) return { product, score: 0 };

        const name = String(product.name ?? "").toLowerCase();
        const description = String(product.description ?? "").toLowerCase();

        let score = 0;
        for (const token of tokens) {
          const inName = name.includes(token);
          const inDescription = description.includes(token);
          if (!inName && !inDescription) return null;

          if (inName) score += 50;
          if (name.startsWith(token)) score += 20;
          if (inDescription) score += 10;
        }

        return { product, score };
      })
      .filter(Boolean);

    const filtered = withScores.filter(({ product }) => {
      if (category !== "All" && product.category !== category) return false;
      if (Number.isFinite(minPriceNumber) && product.price < minPriceNumber)
        return false;
      if (Number.isFinite(maxPriceNumber) && product.price > maxPriceNumber)
        return false;
      return true;
    });

    const sorted = filtered.slice();
    const shouldUseRelevance = tokens.length > 0 && sort === "relevance";

    sorted.sort((a, b) => {
      if (shouldUseRelevance && b.score !== a.score) return b.score - a.score;

      switch (sort) {
        case "price-asc":
          return a.product.price - b.product.price;
        case "price-desc":
          return b.product.price - a.product.price;
        case "name-asc":
          return a.product.name.localeCompare(b.product.name);
        case "name-desc":
          return b.product.name.localeCompare(a.product.name);
        case "newest":
          return (
            new Date(b.product.createdAt).getTime() -
            new Date(a.product.createdAt).getTime()
          );
        case "rating-desc":
          return b.product.rating - a.product.rating;
        case "relevance":
        default:
          return (
            new Date(b.product.createdAt).getTime() -
            new Date(a.product.createdAt).getTime()
          );
      }
    });

    return sorted.map(({ product }) => product);
  }, [products, search, category, minPrice, maxPrice, sort]);

  function handleReset() {
    setSearchParams({});
    setCategory("All");
    setMinPrice(String(datasetMinPrice));
    setMaxPrice(String(datasetMaxPrice));
    setSort("relevance");
  }

  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-title">Welcome to ShopHub</h1>
        <p className="home-subtitle">
          Discover amazing products at great prices
        </p>
      </div>
      <div className="container">
        <div className="filters-bar">
          <button
            className="btn btn-secondary btn-small"
            onClick={() => setFiltersOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
          >
            Filters
          </button>
          <span className="filters-count">
            {visibleProducts.length} result{visibleProducts.length === 1 ? "" : "s"}
          </span>
        </div>

        {filtersOpen ? (
          <div
            className="filters-overlay"
            role="presentation"
            onClick={() => setFiltersOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setFiltersOpen(false);
            }}
            tabIndex={-1}
          >
            <aside
              className="filters-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="filters-sidebar-header">
                <h3 className="filters-sidebar-title">Filters</h3>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => setFiltersOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="filters-sidebar-body">
                <div className="filters-sidebar-field">
                  <label className="toolbar-label" htmlFor="product-category">
                    Category
                  </label>
                  <select
                    id="product-category"
                    className="toolbar-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filters-sidebar-field">
                  <label className="toolbar-label" htmlFor="product-sort">
                    Sort
                  </label>
                  <select
                    id="product-sort"
                    className="toolbar-input"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="relevance" disabled={search.trim().length === 0}>
                      Relevance
                    </option>
                    <option value="price-asc">Price: low → high</option>
                    <option value="price-desc">Price: high → low</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                    <option value="newest">Newest</option>
                    <option value="rating-desc">Rating</option>
                  </select>
                </div>

                <div className="filters-sidebar-field">
                  <label className="toolbar-label" htmlFor="product-min-price">
                    Min price
                  </label>
                  <input
                    id="product-min-price"
                    className="toolbar-input"
                    inputMode="decimal"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder={String(datasetMinPrice)}
                  />
                </div>

                <div className="filters-sidebar-field">
                  <label className="toolbar-label" htmlFor="product-max-price">
                    Max price
                  </label>
                  <input
                    id="product-max-price"
                    className="toolbar-input"
                    inputMode="decimal"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={String(datasetMaxPrice)}
                  />
                </div>
              </div>

              <div className="filters-sidebar-footer">
                <button className="btn btn-secondary" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </aside>
          </div>
        ) : null}
        <h2 className="page-title">ShopHub Products</h2>
        <div className="product-grid">
          {visibleProducts.length === 0 ? (
            <div className="empty-state">
              No products match your search and filters.
            </div>
          ) : (
            visibleProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}