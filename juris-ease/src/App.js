import './App.css';
import AppRoutes from './AppRoutes';

function App() {

  return (
    <div className={`App`}>
      <div id="alert-dialog-container"></div>
      <AppRoutes />
    </div>
  );
}

export default App;