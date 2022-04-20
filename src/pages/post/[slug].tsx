import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react'
import { createClient } from '../../services/prismic';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { RichText } from 'prismic-dom'

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
  // console.log('post', post)

  // Read time - considering human reads 200 words per minute
  const words = post.data.content.reduce((acc, content) => {
    acc += content.heading.split(' ').length

    content.body.map(cont => {
      acc += RichText.asText(cont.text).split(' ').length
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
            {post.first_publication_date}
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
            {paragraph.body.map(textContent => (
              <div 
                key={textContent.text}
                className={styles.textAreaContent}
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(textContent.text) }}
              />
            ))}
          </div>
        ))}
        
      </article>
    </main>
  )
}

export const getStaticPaths = async () => {
  const prismic = createClient();
  const postsResponse = await prismic.getByType('Posts')

  const paths = postsResponse.results.map((post) => {
    return {
      params: {
        slug: post.uid
      }
    }
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params

  const prismic = createClient();
  const response = await prismic.getByUID('Posts', slug.toString())

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      "dd MMM yyyy", { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content.map(paragraph => ({
        heading: paragraph.heading,
        body: [{
          text: paragraph.body
        }],   
      }))      
    }
  }

  // console.log('post', JSON.stringify(post, null, 2))
  return {
    props: { post }
  }
};