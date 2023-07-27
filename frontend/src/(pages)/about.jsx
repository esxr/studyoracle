import { Layout, Button, theme } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content } = Layout;
const { useToken } = theme;

import Title from "../components/Title"
import TopBar from "../components/TopBar"

export default function About() {
  const { token } = useToken();

  return (
    <div style={{ height: '100vh' }}>
      <header>
        <title>About - Study Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </header>

      <Layout style={{ height: '100%', overflow: 'scroll' }}>
        <Header style={{ backgroundColor: token.colorAccent }}>
          <header style={{ backgroundColor: token.colorAccent }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title/>
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
            StudyOracle is here to revolutionalize the way you learn and excel!
            <br /><br />
            <li>Extracting data effortlessly from lengthy PDFs ⛏️</li>
            <li>Cross-checking assignment solutions with books 📄</li>
            <li>Harnessing AI to search your personal notes 📝</li>
            <li>Using AI as a second brain 🧠</li>
            <br />
            <br />
            <hr />
            <br />
            <h3>How to Use Study Oracle</h3><br />
            <b>Step 1: </b><i>Upload PDFs:</i> Add study materials, such as textbooks or research papers.<br />
            <b>Step 2: </b><i>Ask Questions:</i> Type clear and specific queries related to your study materials.<br />
            <b>Step 3: </b><i>Retrieve Answers:</i> StudyOracle&apos;s AI bot scans the uploaded PDFs and provides accurate answers to your questions.<br />
            <br />
            <br />
            <hr />
            <br />
            <h3>Help in development</h3>
            <br /><b>Discord Community:</b> Join the <a style={{ color: "blue" }} href="https://discord.gg/TD6HfMaq3R">StudyOracle Discord community</a> for discussions, collaboration, and assistance (moderators wanted).
            <br /><b>Reddit Community:</b> Join the <a style={{ color: "blue" }} href="https://www.reddit.com/r/studyoracle/">StudyOracle Subreddit</a> (moderators wanted).
            <br /><b>WhatsApp Group:</b> Join our <a style={{ color: "blue" }} href="https://chat.whatsapp.com/LBhukxklTQ6IgECB8Fp7BU">WhatsApp Group</a>.
            <br /><b>Email:</b> Email us at <a style={{ color: "blue" }} href="mailto:info@studyoracle.com">info@studyoracle.com</a> with your ideas.
            <br />
            <br />
            StudyOracle simplifies research, saves time, and enhances understanding. It&apos;s your comprehensive study companion, supported by AI and a vibrant community. Empower your academic journey with StudyOracle today.
          </p>
        </Content>
      </Layout>
    </div>
  );
}
