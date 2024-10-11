import React from 'react';

const Error = () => {
  return (
    <div style={styles.errorContainer}>
      <h2 style={styles.errorTitle}>Error</h2>
      <p style={styles.errorMessage}>Este usuario ya existe.</p>
    </div>
  );
};

const styles = {
  errorContainer: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #f5c6cb',
    maxWidth: '400px',
    margin: '20px auto',
    textAlign: 'center',
  },
  errorTitle: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  errorMessage: {
    margin: '0',
    fontSize: '16px',
  },
};

export default Error;
