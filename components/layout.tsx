import Head from 'next/head'
import Image from 'next/image';
import { MUX_HOME_PAGE_URL } from '../constants'
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  title?: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  image?: string
  children: React.ReactNode
  loadTwitterWidget?: boolean
}

export default function Layout({
  title,
  description,
  metaTitle = 'Thirteen and Up',
  metaDescription,
  image = 'https://with-mux-video.vercel.app/mux-nextjs-og-image.png',
  children,
}: LayoutProps) {
  const [titleSuffix, setTitleSuffix] = useState('');

  useEffect(() => {
    const suffixes = [
      " with no f*cks",
      " with less sh*t",
      ", a**less",
      " unb*stardized"
    ];
    
    let currentSuffixIndex = 0;
    
    const interval = setInterval(() => {
      setTitleSuffix(suffixes[currentSuffixIndex]);
      currentSuffixIndex = (currentSuffixIndex + 1) % suffixes.length;
    }, 2000); // Change every 2 seconds
  
    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);  

  return (
    <div className="container">
      <Head>
        <title>Thirteen and Up</title>
        <link rel="icon" href="/favicon.ico" />
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {metaTitle && <meta property="twitter:title" content={metaTitle} />}
        {metaDescription && (
          <meta property="og:description" content={description} />
        )}
        {metaDescription && (
          <meta property="twitter:description" content={description} />
        )}
        {image && <meta property="og:image" content={image} />}
      </Head>

      <main>
        <Image src="/logo.png" alt="Logo" width={400} height={400} />
        <h1 className="title">{title}{titleSuffix}</h1>
        <p className="description">{description}</p>
        <div className="grid">{children}</div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          padding: 0 0rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #FBF4E4;
          height: 100vh;
        }

        main {
          padding: 1rem 0 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 1rem;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
          .title {
            font-size: 2.5rem;
          }
          footer {
            height: 60px;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        a {
          color: #ff2b61;
        }

        p {
          line-height: 1.4rem;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
