
import * as express from 'express';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as uuid from 'uuid';
import * as httpContext from 'express-http-context';
const { server, db } = require('./config');
import { Route } from './routes/route'

const route: Route = new Route();

mongoose.connect(db.spamprotect, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
  .then(() => console.log('db connection successful'))
  .catch((err) => console.error("db connection error", err));


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
// app.use(helmet());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const DIST_FOLDER = join(process.cwd(), 'public');

// Run the context for each request. Assign a unique identifier to each request
var requestId = uuid.v1();
app.use(httpContext.middleware);

// Note the dot at the beginning of the path
app.use('/portal', express.static(DIST_FOLDER));
//api route
route.Route(app);

function getUndefined(request, response) {
  response.sendFile(DIST_FOLDER + '/index.html');
}

app.get('/portal/*', getUndefined);
// All regular routes

app.use((err, req, res, next) => {
  var requesterIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  httpContext.set('requestId', requestId);
  httpContext.set('requesterIP', requesterIP);
  next();
  if (!err) {
    next();
  }
  if(err.toString().includes("Not allowed by CORS")){
    res.status(401);
    res.send({ message: 'Cross-origin resource sharing denied' });
  }
  else{
    console.log("Global exception: ",err)
    res.status(500);
    res.send({ message: 'Something went wrong.(Global Exception)' });
  }
});

// Start up the Node server
const appServer = app.listen(server.port, () => {
  console.info(`Node Express server listening on http://localhost:${server.port}`);
});
appServer.setTimeout(0);
