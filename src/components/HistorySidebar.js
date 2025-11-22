import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

function HistorySidebar({ productId, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE_URL}/history/${productId}/history`;
        const response = await axios.get(url);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="history-sidebar">
      <div className="sidebar-header">
        <h2>
          <span className="material-icons-outlined">history</span>
          History
        </h2>
        <button className="close-btn" onClick={onClose}>
          <span className="material-icons-outlined">close</span>
        </button>
      </div>

      <div className="sidebar-content">
        {loading ? (
          <div className="loading">
            <span className="material-icons-outlined" style={{ fontSize: "1rem", animation: "spin 1s linear infinite", display: "inline-block" }}>
              hourglass_empty
            </span>
            <div style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Loading...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="no-history">
            <span className="material-icons-outlined" style={{ fontSize: "1rem", display: "block", marginBottom: "0.5rem" }}>info</span>
            No history
          </div>
        ) : (
          <div className="history-list">
            {history.map((record) => (
              <div key={record.id} className="history-item">
                <div className="history-date">{formatDate(record.change_date)}</div>
                <div className="history-details">
                  <div className="history-quantity">
                    <div className="label">Old</div>
                    <div className="value">{record.old_quantity}</div>
                  </div>
                  <span className="history-arrow material-icons-outlined">arrow_forward</span>
                  <div className="history-quantity">
                    <div className="label">New</div>
                    <div className="value">{record.new_quantity}</div>
                  </div>
                </div>
                <div
                  className="history-change"
                  style={{
                    color:
                      record.new_quantity > record.old_quantity
                        ? "#86efac"
                        : record.new_quantity < record.old_quantity
                        ? "#fca5a5"
                        : "var(--gray-400)",
                  }}
                >
                  {record.new_quantity > record.old_quantity ? "+" : ""}
                  {record.new_quantity - record.old_quantity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistorySidebar;
