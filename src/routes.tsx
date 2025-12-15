import FAQBot from './pages/FAQBot';
import FAQManagement from './pages/FAQManagement';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'FAQ Bot',
    path: '/',
    element: <FAQBot />,
    visible: true
  },
  {
    name: 'FAQ Management',
    path: '/management',
    element: <FAQManagement />,
    visible: true
  }
];

export default routes;
