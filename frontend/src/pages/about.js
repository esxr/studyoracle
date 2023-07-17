import Head from 'next/head';
import { Layout, Button, theme } from 'antd';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Title from '@/components/Title';

const { Header, Content } = Layout;
const { useToken } = theme;

export default function About() {
  const { token } = useToken();

  return (
    <div style={{ height: '100vh' }}>
      <Head>
        <title>About - Study Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout style={{ height: '100%' }}>
        <Header style={{ backgroundColor: token.colorAccent }}>
          <header style={{ backgroundColor: token.colorAccent }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title />
              <div style={{ marginLeft: 'auto', marginRight: 16 }}>
                <Link href="/">
                  <div style={{ color: 'white' }}>Back</div>
                </Link>
              </div>
            </div>
          </header>
        </Header>

        <Content style={{ padding: 20 }}>
          <h2 style={{ color: token.colorText }}>About Study Oracle</h2>
          <br />
          <p style={{ color: token.colorText }}>
            StudyOracle is a revolutionary service that enhances studying by using AI technology. Upload PDF files, ask questions, and get relevant answers from the PDFs. It&apos;s perfect for law, medical, and engineering students.

            <br />
            <br />
            <hr />
            <br />
            <h3>Some Usecases</h3>
            - Upload legal documents and case studies. Ask questions about legal concepts or cases to quickly find relevant passages and get concise answers.
            <br />- Upload medical textbooks and research papers. Ask medical queries to receive accurate responses, saving time in finding essential information for coursework or exams.
            <br />- Upload engineering textbooks and manuals. Ask questions about formulas, theories, or problem-solving techniques for step-by-step explanations.

            <br />
            <br />
            <hr />
            <br />
            <h3>How to Use Study Oracle</h3>
            - <b>Upload PDFs:</b> Add study materials, such as textbooks or research papers.
            <br />- <b>Ask Questions:</b> Type clear and specific queries related to your study materials.
            <br />- <b>Retrieve Answers:</b> StudyOracle&apos;s AI bot scans the uploaded PDFs and provides accurate answers to your questions.

            <br />
            <br />
            <hr />
            <br />
            <h3>Additional Resources</h3>
            <br /><b>Discord Community:</b> Join the <a style={{ color: "blue" }} href="https://discord.gg/TD6HfMaq3R">StudyOracle Discord community</a> for discussions, collaboration, and assistance (moderators wanted).
            <br /><b>Reddit Community:</b> Join the <a style={{ color: "blue" }} href="https://www.reddit.com/r/studyoracle/">StudyOracle Subreddit</a> (moderators wanted).
            <br /><b>Collaborate:</b> Email us at <a style={{ color: "blue" }} href="mailto:info@studyoracle.com">info@studyoracle.com</a> with your ideas.
            <br />
            <br />
            StudyOracle simplifies research, saves time, and enhances understanding. It&apos;s your comprehensive study companion, supported by AI and a vibrant community. Empower your academic journey with StudyOracle today.
          </p>
        </Content>
      </Layout>
    </div>
  );
}
