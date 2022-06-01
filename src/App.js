import { buildQueries } from "@testing-library/react";
import React, { useCallback, useState, useMemo } from "react";

const FilterableProductTable = ({ products }) => {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleFilterTextChange = useCallback((value) => {
    setFilterText(value);
    console.log("filter", value);
  }, []);

  const handleInStockChange = useCallback((checked) => {
    setInStockOnly(checked);
    console.log("check", checked);
  }, []);

  return (
    <div
      style={{
        border: "2px solid #1f1f1f",
        borderRadius: "4px",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h2 style={{ margin: "20px 0 5px 0" }}>Thinking in React</h2>
      <h5 style={{ margin: "5px" }}>with functional components</h5>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={handleFilterTextChange}
        onInStockChange={handleInStockChange}
      />
      <ProductTable products={products} filterText={filterText} inStockOnly={inStockOnly} />
    </div>
  );
};

const SearchBar = ({ filterText, inStockOnly, onFilterTextChange, onInStockChange }) => {
  return (
    <div>
      <form>
        <input
          style={{ width: "250px", marginTop: "20px", height: "30px" }}
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(event) => {
            onFilterTextChange(event.target.value);
          }}
        />
        <p>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => {
              onInStockChange(event.target.checked);
            }}
          />{" "}
          Only show products in stock
        </p>
      </form>
    </div>
  );
};

const ProductTable = ({ filterText, inStockOnly, products }) => {
  const filteredProducts = useMemo(() => {
    let lastCategory = null;
    const rows = [];
    products.forEach((product) => {
      if (product.name.indexOf(filterText) === -1) {
        return;
      }
      if (inStockOnly && !product.stocked) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });
    return rows;
  }, [filterText, inStockOnly, products]);

  return (
    <table style={{ width: "100%", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{filteredProducts}</tbody>
    </table>
  );
};

const ProductCategoryRow = ({ category }) => {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
};

const ProductRow = ({ product }) => {
  const name = product.stocked ? product.name : <span style={{ color: "red" }}>{product.name}</span>;
  return (
    <tr>
      <td style={{ width: "50%", textAlign: "center" }}>{name}</td>
      <td style={{ width: "50%", textAlign: "center" }}>{product.price}</td>
    </tr>
  );
};

const PRODUCTS = [
  { category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football" },
  { category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" },
  { category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" },
  { category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch" },
  { category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" },
  { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" },
];

function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", height: "99vh", alignItems: "center" }}>
      <FilterableProductTable products={PRODUCTS} />
    </div>
  );
}

export default App;
