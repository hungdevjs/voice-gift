import express from 'express';
import cors from 'cors';

import routes from './routes/index.js';
import environments from './utils/environments.js';

const { PORT } = environments;

const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.get('/', (req, res) => {
  res.send('OK');
});

app.use('/api', routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
