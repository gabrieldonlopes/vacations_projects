import React, { useState } from 'react';
import SearchLocationForm from './components/SearchLocationForm';

const App = () => {
  const [showHeader, setShowHeader] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center "> {/* Flex para centralizar */}
      <div className="w-fullp-6 text-center"> {/* Limita largura, aplica padding e centraliza conteúdo */}
        {showHeader && <h1 className="text-4xl font-bold mb-8">Pesquise pelo Clima de sua cidade</h1>}
        <SearchLocationForm setShowHeader={setShowHeader} />
      </div>
    </div>
  );
};

export default App;
