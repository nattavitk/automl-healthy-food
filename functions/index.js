const automl = require('@google-cloud/automl');
const { google } = require('googleapis');

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.postPredictHealthyFood = (req, res) => {
  google.auth.getApplicationDefault((err, authClient, projectId) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //  res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', 'https://storage.googleapis.com');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Authorization');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }

    if (err) {
      console.log('Authentication failed because of ', err);
      res.status(401).send('Authentication failed');
    } else {
      const client = new automl.v1beta1.PredictionServiceClient();
      const { body } = req;

      if (!body) {
        res.status(400).send('Bad Request');
      } else {
        const { project, location, model, payload } = body;
        const formattedName = client.modelPath(project, location, model);
        const request = {
          name: formattedName,
          payload: payload,
        };

        client
          .predict(request)
          .then(responses => {
            const response = responses[0];
            res.status(200).send(JSON.stringify(response));
          })
          .catch(err => {
            console.error(err);
            res.status(400).send('Something broke, does that model exist?');
          });
      }
    }
  });
};
