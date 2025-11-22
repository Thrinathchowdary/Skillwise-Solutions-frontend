import React, { useState } from "react";

function ProductRow({ product, onUpdate, onDelete, onSelectProduct }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(product);

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSave = () => {
    const changes = {};
    Object.keys(editData).forEach((key) => {
      if (editData[key] !== product[key]) {
        changes[key] = editData[key];
      }
    });

    if (Object.keys(changes).length > 0) {
      onUpdate(product.id, changes);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(product);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="product-row editing">
        <td style={{ padding: "0.65rem 0.75rem" }}>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="edit-input"
          />
        </td>
        <td style={{ padding: "0.65rem 0.75rem" }}>
          <input
            type="text"
            value={editData.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
            className="edit-input"
          />
        </td>
        <td style={{ padding: "0.65rem 0.75rem" }}>
          <input
            type="text"
            value={editData.brand || ""}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="edit-input"
          />
        </td>
        <td style={{ padding: "0.65rem 0.75rem" }}>
          <input
            type="number"
            value={editData.stock}
            onChange={(e) => handleChange("stock", parseInt(e.target.value))}
            className="edit-input"
            min="0"
          />
        </td>
        <td style={{ padding: "0.65rem 0.75rem" }}>
          <span
            className={`status ${
              editData.stock === 0 ? "out-of-stock" : "in-stock"
            }`}
          >
            {editData.stock === 0 ? "Out" : "In"}
          </span>
        </td>
        <td style={{ padding: "0.65rem 0.75rem" }} className="actions">
          <button className="btn-save" onClick={handleSave}>
            <span className="material-icons-outlined">check</span>
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            <span className="material-icons-outlined">close</span>
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="product-row">
      <td style={{ padding: "0.65rem 0.75rem" }}>{product.name}</td>
      <td style={{ padding: "0.65rem 0.75rem", color: "var(--gray-400)" }}>
        {product.category || "—"}
      </td>
      <td style={{ padding: "0.65rem 0.75rem", color: "var(--gray-400)" }}>
        {product.brand || "—"}
      </td>
      <td style={{ padding: "0.65rem 0.75rem", fontWeight: "600" }}>
        {product.stock}
      </td>
      <td style={{ padding: "0.65rem 0.75rem" }}>
        <span
          className={`status ${
            product.stock === 0 ? "out-of-stock" : "in-stock"
          }`}
        >
          {product.stock === 0 ? "Out" : "In"}
        </span>
      </td>
      <td style={{ padding: "0.65rem 0.75rem" }} className="actions">
        <button
          className="btn-edit"
          onClick={() => setIsEditing(true)}
          title="Edit"
        >
          <span className="material-icons-outlined">edit</span>
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(product.id)}
          title="Delete"
        >
          <span className="material-icons-outlined">delete</span>
        </button>
        <button
          className="btn-history"
          onClick={() => onSelectProduct(product.id)}
          title="History"
        >
          <span className="material-icons-outlined">history</span>
        </button>
      </td>
    </tr>
  );
}

function ProductTable({ products, onUpdate, onDelete, onSelectProduct }) {
  return (
    <div className="product-table-container">
      <div style={{ overflowX: "auto" }}>
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "2rem 0.75rem",
                    color: "var(--gray-400)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "2rem" }}
                    >
                      inbox
                    </span>
                    <span style={{ fontSize: "0.75rem" }}>
                      No products found
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onSelectProduct={onSelectProduct}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
