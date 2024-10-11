import React from 'react';

const Exito = () => {
  return (
    <div style={styles.successContainer}>
      <h2 style={styles.successTitle}>Éxito</h2>
      <p style={styles.successMessage}>Usuario creado correctamente.</p>
    </div>
  );
};

const styles = {
  successContainer: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #c3e6cb',
    maxWidth: '400px',
    margin: '20px auto',
    textAlign: 'center',
  },
  successTitle: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  successMessage: {
    margin: '0',
    fontSize: '16px',
  },
};

export default Exito;
