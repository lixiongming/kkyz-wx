// utils/tabbar.js
import pagesConfig from '@/pages.json';

export function getTabBarRoutes() {
  const tabBarList = pagesConfig.tabBar?.list || [];
  return tabBarList.map(item => '/' + item.pagePath);
}