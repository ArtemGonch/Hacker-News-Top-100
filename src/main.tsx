import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

bridge.send('VKWebAppInit')

const routes = [
  {
    path: '/',
    panel: 'stories_page',
    view: 'default_view',
    root: 'default_root',
  },
  {
    path: `/:id`,
    panel: 'news_page',
    view: 'news_view',
    root: 'news_root',
  },
]

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
)
