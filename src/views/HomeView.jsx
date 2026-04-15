import { useNavigate } from 'react-router-dom';
import { Home } from '../pages/Home';

const NAV_ROUTES = {
  automation: '/automation'
};

export default function HomeView() {
  const navigate = useNavigate();
  return <Home onNav={(id) => navigate(NAV_ROUTES[id] ?? `/${id}`)} />;
}
