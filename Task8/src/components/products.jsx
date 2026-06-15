import { useEffect, useMemo, useState } from "react";

export default function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [productsStatus, setProductsStatus] = useState("idle");
  const [productsError, setProductsError] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");

  useEffect(() => {
    if (productsStatus !== "idle") {
      return;
    }

    setProductsStatus("loading");
    fetch("https://dummyjson.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(data.products ?? []);
        setProductsStatus("success");
      })
      .catch((error) => {
        setProductsError(error.message);
        setProductsStatus("error");
      });
  }, [productsStatus]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = productSearchTerm.trim().toLowerCase();

    if (normalizedSearch === "") {
      return products;
    }

    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.brand?.toLowerCase().includes(normalizedSearch)
    );
  }, [productSearchTerm, products]);

  return (
    <section className="products-page" aria-label="Products">
      <div className="products-header">
        <h2>Products</h2>
        <p>{visibleProducts.length} products</p>
      </div>

      <div className="product-search-row">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true" />
          <input
            value={productSearchTerm}
            onChange={(event) => setProductSearchTerm(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
        </label>
      </div>

      {productsStatus === "loading" && (
        <p className="empty-state">Loading products...</p>
      )}
      {productsStatus === "error" && (
        <p className="empty-state">{productsError}</p>
      )}

      {productsStatus === "success" && (
        <div className="products-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <img
                src={product.images?.[0] || product.thumbnail}
                alt={product.title}
              />
              <div className="product-card-body">
                <div>
                  <h3>{product.title}</h3>
                  <p>{product.brand || product.category}</p>
                </div>
                <span className="product-price">${product.price}</span>
              </div>
              <button
                className="add-cart-btn"
                type="button"
                onClick={() => onAddToCart(product)}
              >
                Add to cart
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
