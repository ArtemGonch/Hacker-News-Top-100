import StoriesPage from './components/StoriesPage/StoriesPage'
import { useActiveVkuiLocation, useGetPanelForView } from '@vkontakte/vk-mini-apps-router';
import { Root, View, Panel } from '@vkontakte/vkui';
import NewsPage from './components/NewsPage/NewsPage';

export default function App() {
  const { view: activeView } = useActiveVkuiLocation();
  const activePanel = useGetPanelForView(activeView);
  return (
    <Root activeView={activeView || ''}>
          <View nav={activeView} activePanel={activePanel || ''}>
            <Panel nav="stories_page"><StoriesPage/></Panel>
            <Panel nav="news_page"><NewsPage/></Panel>
          </View>
    </Root>
  )
}
