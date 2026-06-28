import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import axios from 'axios';

const GHANAPOST_API_KEY = defineSecret('GHANAPOST_API_KEY');

const GHANA_POST_BASE_URL = 'https://nebula-rain.exe.xyz';

export const ghanaPostProxy = onRequest(
  { secrets: [GHANAPOST_API_KEY] },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      const path = req.path.replace(/^\/?ghanaPostProxy\/?/, '');
      const url = `${GHANA_POST_BASE_URL}/${path}`;

      const response = await axios({
        method: req.method,
        url,
        data: req.body,
        params: req.query,
        headers: {
          'Authorization': `Bearer ${GHANAPOST_API_KEY.value()}`,
          'Content-Type': 'application/json',
        },
      });

      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('[GhanaPost Proxy Error]', error.message);
      res.status(error.response?.status ?? 500).json({
        error: error.message,
        details: error.response?.data,
      });
    }
  }
);