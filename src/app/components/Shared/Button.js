import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ title, onClick, disabled, style }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      disabled={disabled}
      style={style}>
      {title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func, // Make onClick optional
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default Button;
