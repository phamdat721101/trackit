import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { getBlockchain } from './chain'

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors({ origin: '*' }));

app.get('/api/aptos-data', async (req, res) => {
  const blockchain = await getBlockchain("apt")
  const resp = await blockchain.fetchTransaction("0x4e5e85fd647c7e19560590831616a3c021080265576af3182535a1d19e8bc2b3")
  const ai_resp = await blockchain.getAIInsights(resp)
  console.log("Chain data: ", ai_resp.choices[0].message);
  res.json(resp)
  // try {
  //   const response = await axios.get('https://api.nodit.io/aptos/v1/accounts');
  //   res.json(response.data);
  // } catch (error) {
  //   console.error('Error fetching data from Nodit indexer:', error);
  //   res.status(500).json({ error: 'Error fetching data from Nodit indexer' });
  // }
});

app.get('/api/apt-gov', async (req, res) => {
  const blockchain = await getBlockchain("apt")
  const resp = await blockchain.fetchGovernanceVotes();
  console.log("Chain data: ", resp);
  res.json(resp)
  // try {
  //   const response = await axios.get('https://api.nodit.io/aptos/v1/accounts');
  //   res.json(response.data);
  // } catch (error) {
  //   console.error('Error fetching data from Nodit indexer:', error);
  //   res.status(500).json({ error: 'Error fetching data from Nodit indexer' });
  // }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});