import {BrowserRouter as Router} from "react-router-dom"
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AllRoutes from "./AllRoutes";

function App() {
  return (
    <div className="App">
    <Router>
      <div>  
       <Navbar/>
       <AllRoutes/>
       <Footer />
      </div>
    </Router>
      
    </div>
  );
}

export default App;
