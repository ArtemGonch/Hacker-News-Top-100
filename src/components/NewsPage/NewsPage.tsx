import { useState, useEffect, useCallback } from 'react'; 
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router'; 
import { Button } from '@vkontakte/vkui'; 
import './NewsPage.css';
 
interface News { 
  id: number; 
  title: string; 
  url: string; 
  time: number; 
  by: string; 
  kids: Array<number>; 
} 
interface Comment { 
  id: number; 
  text: string; 
  by: string;
  kids: Comment[];
} 
 
const NewsPage = () => { 
  const routeNavigator = useRouteNavigator(); 
  const id = useParams<'id'>()?.id; 
  const [news, setNews] = useState<News | null>(null); 
  const [comments, setComments] = useState<Comment[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [newcomments, setNewcomments] = useState<Comment[]>([]);
  const [curcoms, setCurcoms] = useState<number>(-1);
 
  const fetchNewsAndComments = useCallback(async () => {
  await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(async response => await response.json())
    .then((newsData: News) => {
      setNews(newsData);

      const commentPromises = (newsData.kids || []).map(async commentId =>
        await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`).then(response => response.json())
      );

      Promise.all(commentPromises)
        .then(commentsData => {
          setComments(commentsData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
          setLoading(false);
        });
    })
    .catch(error => {
      console.error('Error fetching news:', error);
      setLoading(false);
    });
}, [comments]);
 
  useEffect(() => { 
    fetchNewsAndComments(); 
  }, []); 
  const handleClick = async (curid: any, kids: any) =>{
    const coms = kids.map(async (commentId: any) =>
        await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`).then(response => response.json())
      );
    Promise.all(coms)
        .then(commentsData => {
          setNewcomments(commentsData);
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
          setLoading(false);
        });
      setCurcoms(curid);
    }
 
  return ( 
    <div> 
      <Button onClick={fetchNewsAndComments} className='button'>Обновить комментарии</Button> 
      <Button onClick={() => routeNavigator.push('/')} className='button'>Вернуться к списку новостей</Button> 
      {loading ? ( 
        <p>Загрузка новости и комментариев...</p> 
      ) : ( 
        <div> 
          <a href={news?.url} target="_blank" rel="noopener noreferrer" className="news-link">Ссылка на новость</a> 
          <h1>{news?.title}</h1> 
          <p>Дата: {new Date(news && news.time * 1000 || '').toLocaleDateString()}</p> 
          <p>Автор: {news?.by}</p> 
          <p>Количество комментариев: {comments.length}</p> 
          <ul className="comments-list"> 
            {comments.map(comment => ( 
              <li key={comment.id} className="comment-item"> 
                <p>Автор: {comment?.by}</p> 
                <p>{comment.text}</p>
                {comment.kids && <Button onClick={() => handleClick(comment.id, comment.kids)} className='button' id='newcomment'>Еще</Button>}
                {curcoms === comment.id && <ul className="comments-list"> 
                    {newcomments.map(comment => ( 
                      <li key={comment.id} className="comment-item"> 
                        <p>Автор: {comment?.by}</p> 
                        <p>{comment.text}</p>
                        {comment.kids && <Button onClick={() => handleClick(comment.id, comment.kids)} className='button' id='newcomment'>Еще</Button>}
                      </li> 
                    ))} 
                  </ul> }
              </li> 
            ))} 
          </ul> 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
export default NewsPage;
