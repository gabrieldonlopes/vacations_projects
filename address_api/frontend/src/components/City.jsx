import api from "../api.js";
import React, { useState, useEffect } from "react";

const City = ({ cep }) => {
  const [cityData, setCityData] = useState(null);
  const [error, setError] = useState(null);

  const getCity = async () => {
    try {
      const response = await api.get(`/address/${cep}`);
      setCityData(response.data);
      setError(null); 
    } catch (err) {
      setError("Erro ao buscar informações da cidade");
      console.error(err);
    }
  };

  useEffect(() => {
    if (cep) {
      getCity();
    }
  }, [cep]); 

  if (error) {
    return <div style={{ color: "red", marginTop: "20px" }}>{error}</div>;
  }

  if (!cityData) {
    return <div style={{ marginTop: "20px" }}>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Informações do endereço</h2>
      <div style={styles.infoContainer}>
        <div style={styles.info}>
          <strong>CEP:</strong> {cityData.cep}
        </div>
        <div style={styles.info}>
          <strong>Cidade:</strong> {cityData.city}
        </div>
        <div style={styles.info}>
          <strong>Estado:</strong> {cityData.state}
        </div>
        <div style={styles.info}>
          <strong>Bairro:</strong> {cityData.neighborhood}
        </div>
        <div style={styles.info}>
          <strong>Rua:</strong> {cityData.street}
        </div>
        <div style={styles.info}>
          <strong>Serviço:</strong> {cityData.service}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    width: "400px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  info: {
    fontSize: "16px",
    color: "#555",
  },
};

export default City;
