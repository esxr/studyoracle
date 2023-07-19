import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { google } from 'googleapis';

const { OAuth2 } = google.auth;

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile'];

const GoogleAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    const getAuthUrl = async () => {
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });

      router.push(url);
    };

    getAuthUrl();
  }, [router]);

  return null; // or render a loading spinner or message
};

export default GoogleAuth;
