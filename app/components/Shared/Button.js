import React, { useState } from "react";
import styles from "./Button.module.css";

export default function Button({ title, onClick }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  };

  return (
    <button className={styles.button} onClick={handleClick} disabled={loading}>
      {loading ? (
        <img
          src="https://bontelstore.ru/images/blue-loading-gif-transparent-9.gif"
          style={{ height: 30 }}
        />
      ) : (
        title
      )}
    </button>
  );
}
