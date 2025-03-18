import express from 'express';
import cors from 'cors';
import recordingRouter from './routes/recording.routes';

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:4200', 'https://video-recording-app.app.genez.io'],
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', recordingRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export const handler = app