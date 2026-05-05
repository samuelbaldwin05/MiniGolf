import './styles/index.css';
import { Game } from './core/Game';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { new Game(); });
} else {
  new Game();
}
