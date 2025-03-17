import express from 'express';
import cors from 'cors';
import recordingRouter from './routes/recording.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', recordingRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});