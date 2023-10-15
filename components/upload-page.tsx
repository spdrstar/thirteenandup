import Layout from "./layout";
import { MUX_HOME_PAGE_URL } from "../constants";

interface UploadPageProps {
  children: React.ReactNode;
}

export default function UploadPage({
  children,
}: UploadPageProps) {
  return (
    <Layout
      title="your content"
      description="video censorship with one click"
      showTitle
    >
      <div className="wrapper">
        <div className="children">{children}</div>
      </div>
      <style jsx>{`
        .about-mux {
          padding: 0 1rem 1.5rem 1rem;
          width: 100%;
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
  );
}
