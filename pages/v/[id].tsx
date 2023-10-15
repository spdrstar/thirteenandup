import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'
import MuxPlayer from '@mux/mux-player-react'
import Link from 'next/link'
import Layout from '../../components/layout'
import Spinner from '../../components/spinner'
import { MUX_HOME_PAGE_URL } from '../../constants'
import { useRouter } from 'next/router'

type Params = {
  id?: string
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id: playbackId } = params as Params
  const poster = `https://image.mux.com/${playbackId}/thumbnail.png`

  return { props: { playbackId, poster } }
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

type CodeProps = {
  children: React.ReactNode
}

const Code = ({ children }: CodeProps) => (
  <>
    <span className="code">{children}</span>
    <style jsx>{`
      .code {
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
          DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace,
          serif;
        color: #ff2b61;
      }
    `}</style>
  </>
)

export default function Playback({
  playbackId,
  poster,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout
      metaTitle="View this video created by Thirteen and Up"
      image={poster}
      loadTwitterWidget
    >
      <MuxPlayer
        style={{ width: '100%' }}
        playbackId={playbackId}
        metadata={{ player_name: 'with-mux-video' }}
      />
      <p>
        Go{' '}
        <Link href="/" legacyBehavior>
          <a>back home</a>
        </Link>{' '}
        to upload another video.
      </p>
      <div className="about-playback">
        <div className="share-button">
          <a
            className="twitter-share-button"
            data-size="large"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/intent/tweet?text=Check%20out%20the%20video%20I%20uploaded%20with%20Next.js%2C%20%40Vercel%2C%20and%20%40muxhq%20`}
          >
            Tweet this
          </a>
        </div>
      </div>
      <style jsx>{`
        .flash-message {
          position: absolute;
          top: 0;
          background-color: #c1dcc1;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          text-align: center;
          padding: 20px 0;
        }
        .share-button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 40px 0;
        }
      `}</style>
    </Layout>
  )
}
