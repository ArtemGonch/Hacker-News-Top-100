import React, { useCallback, useEffect, useState } from 'react';
import './StoriesPage.css';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Button } from '@vkontakte/vkui';

interface News {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
}

const StoriesPage: React.FC = () => {
  const routeNavigator = useRouteNavigator();
  const [newsIds, setNewsIds] = useState<number[]>([]);
  const [newsList, setNewsList] = useState<News[]>([]);

  const fetchNews = useCallback(async () => {
    await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(async response => await response.json())
      .then((data: number[]) => setNewsIds(data.slice(0, 100)))
      .catch(error => console.error(error));
  }, [newsIds]);

  useEffect(() => {
    if (newsIds.length > 0) {
      Promise.all(newsIds.map(async id =>
        await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(async response => await response.json())
      ))
        .then((data: News[]) => setNewsList(data))
        .catch(error => console.error(error));
    }
  }, [newsIds]);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stories-container">
      <h1>Hacker News Top 100</h1>
      <button onClick={fetchNews} className="update-button">Обновить новости</button>
      <ul className="news-list">
        {newsList.map(news => (
          <li key={news.id} className="news-item">
            <div>
              <h3>{news.title}</h3>
              <p>Рейтинг: {news.score}</p>
              <p>Автор: {news.by}</p>
              <p>Дата публикации: {new Date(news.time * 1000).toLocaleString()}</p>
              <Button onClick={() => routeNavigator.push(`/${news.id}`)} className='update-button' id='button'>Читать далее</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoriesPage;
