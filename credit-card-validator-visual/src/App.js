import CreditCardForm from "./components/CreditCardForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
    <CreditCardForm/>
    <ToastContainer />
    </div>
  );
}

export default App;
