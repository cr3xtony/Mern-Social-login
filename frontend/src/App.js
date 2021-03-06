import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import Loader from 'react-loader-spinner';

function App() {
  return (
    <Router>
      <Container>
        <Route path="/" component={LoginScreen} exact />
        <Route path="/register" component={RegisterScreen} exact />
        <Route path="/home" component={HomeScreen} exact />
        <Route path="/loader" component={Loader} exact />
      </Container>
    </Router>
  );
}

export default App;
