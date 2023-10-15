import Layout from './layout'
import { MUX_HOME_PAGE_URL } from '../constants'

interface UploadPageProps {
  children: React.ReactNode
}

export default function UploadPage({ children }: UploadPageProps) {
  return (
    <Layout
      title="Make videos safe for kids with one click"
      description="Upload any video to remove swear words and other inappropriate content"
    >
      <div className="wrapper">
        <div className="children">{children}</div>
      </div>
      <style jsx>{`
        .about-mux {
          padding: 0 1rem 1.5rem 1rem;
          max-width: 600px;
        }
        .about-mux {
          line-height: 1.4rem;
        }
        .children {
          text-align: center;
          min-height: 230px;
        }
      `}</style>
    </Layout>
  )
}
