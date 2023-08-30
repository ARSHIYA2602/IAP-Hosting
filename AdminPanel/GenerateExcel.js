import logo from './logo.svg';
import './App.css';
import AppBar from './AppBar';
import Headings from './Headings';
import GenerateExcel from './GenerateExcel'
import image from "./thapar.jpg"; 

function App() {
  return (
    <div style={{ backgroundImage:`url(${image})`, backgroundSize:'contain',boxShadow:'inset 0 0 0 2000px rgba(43, 0, 0, 0.175)', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <AppBar />
      <Headings />
      <GenerateExcel />
    </div>
  );
}

export default App;