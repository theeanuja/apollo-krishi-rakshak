# Deployment code sequence

1. `index.html` defines the navigation shell, home screen, three model tabs, feedback tab, voice assistant, and footer.
2. `styles.css` provides the responsive visual system inspired by the supplied GFIS theme reference.
3. `model_adapter.js` contains the approved district registry, model API contract, nearest-district function, and local prototype fallback.
4. `app.js` binds language switching, tab navigation, district inputs, geolocation, Google Maps links, voice recognition, feedback, and result rendering.
5. `OPEN_APOLLO_IN_CHROME.bat` starts a local server and opens Google Chrome.

## API response contract

The frontend expects the backend to return the following shape for rainfall:

```json
{
  "mode": "backend-lstm",
  "district": {"name": "Pune", "region": "Western Maharashtra"},
  "rainfall": [
    {"day": 1, "label": "Mon, 3 Nov", "mm": 6.4, "rainChance": 48}
  ],
  "droughtProbability": 0.41,
  "pestProbability": 0.58
}
```

For drought and pest requests, the same district object and risk fields are used. The API should perform the actual TensorFlow/Keras inference from the preserved Apollo LSTM artifacts and return values with the same units and feature order documented in `08_LSTM_Documentation`.
