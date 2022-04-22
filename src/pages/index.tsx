import { GetStaticProps } from 'next';
import Link from 'next/link'
import { getPrismicClient } from '../services/prismic';
import { useState } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Prismic from '@prismicio/client';
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
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  const [results, setResults] = useState(postsPagination.results)

  async function handleLoadPosts() {
    const nextPageData: PostPagination = await fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        return data
      })

    setNextPage(nextPageData.next_page)

    const nextPagePosts = nextPageData.results.map((post): Post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }
    })

    setResults([...results, ...nextPagePosts])
  }

  return (
    <main>
      <div className={styles.postsContent}>
 
        { results.map(result => (
          <div key={result.uid} className={styles.post}>
            <Link href={`/post/${result.uid}`}>
              <a>{result.data.title}</a>
            </Link>
            <p>{result.data.subtitle}</p>
            <div className={styles.postDetails}>
              <time>
                <FiCalendar />
                { 
                  format(
                    new Date(result.first_publication_date),
                    "dd MMM yyyy",
                    {
                      locale: ptBR
                    }
                  )
                  // result.first_publication_date
                }
              </time>
              <div>
                <FiUser />
                {result.data.author}
              </div>
            </div>
          </div>
        ))} 

        { 
          nextPage && 
          <button 
            type="button" 
            className={styles.loadMorePosts}
            onClick={handleLoadPosts}
          >
            Carregar mais posts
          </button> 
        }
        
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  // const postsResponse = await prismic.getByType('Posts', {
  //   pageSize: 1
  // })

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'Posts')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 3,
    }
  );

  // console.log('post', JSON.stringify(postsResponse, null, 2))
  const next_page = postsResponse.next_page
  // console.log('next_page', next_page)

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  const postsPagination = { next_page, results }

  return {
    props: { postsPagination },
    revalidate: 60 * 60 // 1 hour 
  }
};

