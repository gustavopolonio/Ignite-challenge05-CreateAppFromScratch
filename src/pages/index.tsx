import { GetStaticProps } from 'next';
import { createClient } from '../services/prismic';

import { FiCalendar } from 'react-icons/fi'
import { FiUser } from 'react-icons/fi'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  return (
    <main>
      <div className={styles.postsContent}>

        { postsPagination.results.map(result => (
          <div key={result.uid} className={styles.post}>
            <a href="#">{result.data.title}</a>
            <p>{result.data.subtitle}</p>
            <div className={styles.postDetails}>
              <time>
                <FiCalendar />
                {result.first_publication_date}
              </time>
              <div>
                <FiUser />
                {result.data.author}
              </div>
            </div>
          </div>
        ))}

        { 
          postsPagination.next_page && 
          <strong className={styles.loadMorePosts}>Carregar mais posts</strong> 
        }
        
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = createClient()
  const postsResponse = await prismic.getByType('Posts', {
    pageSize: 1
  })

  // console.log('post', JSON.stringify(postsResponse, null, 2))
  const next_page = postsResponse.next_page

  const results = postsResponse.results.map(post => {
    return {
      uid: post.slugs,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  const postsPagination = { next_page, results }
  console.log('postsPagination', postsPagination)

  return {
    props: { postsPagination },
    revalidate: 60 * 60 // 1 hour 
  }
};

