# Apollo Krishi Rakshak - LSTM Deployment

## Live website

https://theeanuja.github.io/apollo-krishi-rakshak/

This folder contains the browser deployment interface for only the three approved Apollo signals:

1. District-wise seven-day rainfall prediction.
2. District-wise drought-risk probability.
3. District-wise pest-emergence suitability.

No CNN, generic RNN, or unrelated model is exposed in this interface.

## Included experience

- Theme inspired by the supplied GFIS downloads reference: restrained green, cream, navy, spacious cards, clear signal hierarchy, and practical actions.
- English, Hindi, and Marathi language switching without a page reload.
- District selection across the Maharashtra coverage list.
- Browser geolocation with nearest-district matching and a Google Maps hand-off.
- Voice district search through the Web Speech API when supported by the browser.
- Separate tabs for rainfall, drought risk, pest emergence, and feedback.
- Seven distinct rainfall cards, one for each forecast day.
- Resume-informed footer for Anuja Gurav, including Apollo Continuum cofounder attribution as requested.

## Model connection

`model_adapter.js` calls `POST /api/predict` when a backend is available. The expected request is:

```json
{
  "district": "Pune",
  "region": "Western Maharashtra",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "target": "rainfall",
  "horizon": 7,
  "model_family": "LSTM"
}
```

If the API is unavailable, the interface runs a clearly labelled local prototype mode so the UI, translations, location flow, and recommendations can be reviewed without making a production claim. The existing Apollo `.keras`/`.h5` model artifacts remain in their original Model Creation and Showing Outputs folders; they have not been edited or moved.

The archive documentation records a feature-scaling mismatch that must be resolved before connecting production inference. This deployment therefore keeps the integration boundary explicit rather than silently presenting a heuristic as a live trained-model result.

## Run

Use `OPEN_APOLLO_IN_CHROME.bat` from this folder. It starts a local static server and opens the website in Google Chrome. A local server is used so browser geolocation, voice APIs, and JavaScript module behaviour work consistently.
