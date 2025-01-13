import './App.css'
import SearchCityForm from './components/SearchCityForm'
function App() {
  return(
    <div className="App">
      <header className="App-header">
        <h1>Busque pela sua cidade via CEP</h1>
      </header>
      <main>
        <SearchCityForm />
      </main>
    </div>
  );
};

export default App
