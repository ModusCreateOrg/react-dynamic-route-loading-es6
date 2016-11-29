import App from 'containers/App';
import Home from 'pages/Home';
import Blog from 'pages/Blog';
import About from 'pages/About';

export default {
  component: App,
  childRoutes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: 'blog',
      component: Blog,
    },
    {
      path: 'about',
      component: About,
    },
  ]
};
