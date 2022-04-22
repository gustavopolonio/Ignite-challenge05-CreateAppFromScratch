import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getPrismicClient } from '../../services/prismic';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { RichText } from 'prismic-dom'
import Prismic from '@prismicio/client';

import { FiCalendar } from 'react-icons/fi'
import { FiUser } from 'react-icons/fi'
import { FiClock } from 'react-icons/fi'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Carregando...</h1>
  }

  console.log('post', post)

  // Read time - considering human reads 200 words per minute
  const words = post.data.content.reduce((acc, content) => {
    acc += content.heading?.split(' ').length

    content.body.map(cont => {
      acc += cont.text.split(' ').length
    })

    return acc
  }, 0)

  const readTime = Math.ceil(words / 200) // In minutes

  return (
    <main className={styles.container}>
      <img src={post.data.banner.url} alt="main banner" />

      <article className={styles.articleContent}>
        <h1>{post.data.title}</h1>

        <div className={styles.postDetails}>
          <time>
            <FiCalendar />
            { format(
                new Date(post.first_publication_date),
                "dd MMM yyyy",
                { locale: ptBR }) 
            }
          </time>
          <div>
            <FiUser />
            {post.data.author}
          </div>
          <div>
            <FiClock />
            {readTime} min
          </div>
        </div>

        {post.data.content.map(paragraph => (
          <div key={paragraph.heading} className={styles.textArea}>
            <h2>{paragraph.heading}</h2>
            <div 
              className={styles.textAreaContent}
              dangerouslySetInnerHTML={{ __html: RichText.asHtml(paragraph.body) }}
            />
          </div>
        ))}
        
      </article>
    </main>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const postsResponse = await prismic.getByType('Posts', {
  //   pageSize: 1
  // })

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'Posts')],
    {
      fetch: [],
      pageSize: 100,
    }
  );

  // const paths = postsResponse.results.map((post) => {
  //   return {
  //     params: {
  //       slug: post.uid
  //     }
  //   }
  // })

  return {
    paths: postsResponse.results.map(post => ({
      params: { slug: post.uid },
    })),
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params

  const prismic = getPrismicClient();
  // const response = await prismic.getByUID('Posts', slug.toString())
  const response = await prismic.getByUID('Posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      // content: response.data.content.map(paragraph => ({
      //   heading: paragraph.heading,
      //   body: [{
      //     text: paragraph.body
      //   }],   
      // }))      
      content: response.data.content
    }
  }

  // console.log('post', JSON.stringify(post, null, 2))
  return {
    props: { post }
  }
};