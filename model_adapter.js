/* Apollo LSTM deployment adapter.
   This browser adapter is intentionally limited to the three approved signals:
   rainfall prediction, drought probability, and pest emergence. If a backend
   is available at /api/predict, it is used; otherwise the local prototype mode
   reproduces the documented risk-indicator logic for interface testing. */
const APOLLO_MODEL_API = window.APOLLO_MODEL_API || '/api/predict';

const APOLLO_DISTRICTS = [
  ['Ahmednagar','Western Maharashtra',19.0948,74.7480],['Akola','Vidarbha',20.7002,77.0082],['Amravati','Vidarbha',20.9374,77.7796],['Aurangabad','Marathwada',19.8762,75.3433],['Beed','Marathwada',18.9894,75.7601],['Bhandara','Vidarbha',21.1702,79.6509],['Buldhana','Vidarbha',20.5293,76.1842],['Chandrapur','Vidarbha',19.9700,79.3000],['Dhule','North Maharashtra',20.9042,74.7749],['Gadchiroli','Vidarbha',20.1809,80.0000],['Gondia','Vidarbha',21.4624,80.2210],['Hingoli','Marathwada',19.7170,77.1500],['Jalgaon','North Maharashtra',21.0077,75.5626],['Jalna','Marathwada',19.8347,75.8816],['Kolhapur','Western Maharashtra',16.7050,74.2433],['Latur','Marathwada',18.4088,76.5604],['Mumbai City','Konkan',19.0760,72.8777],['Mumbai Suburban','Konkan',19.0760,72.8777],['Nagpur','Vidarbha',21.1458,79.0882],['Nanded','Marathwada',19.1383,77.3210],['Nandurbar','North Maharashtra',21.3667,74.2400],['Nashik','North Maharashtra',19.9975,73.7898],['Osmanabad','Marathwada',18.1860,76.0419],['Palghar','Konkan',19.6967,72.7656],['Parbhani','Marathwada',19.2600,76.7800],['Pune','Western Maharashtra',18.5204,73.8567],['Raigad','Konkan',18.5158,73.1822],['Ratnagiri','Konkan',16.9902,73.3120],['Sangli','Western Maharashtra',16.8524,74.5815],['Satara','Western Maharashtra',17.6805,74.0183],['Sindhudurg','Konkan',16.3492,73.5594],['Solapur','Western Maharashtra',17.6599,75.9064],['Thane','Konkan',19.2183,72.9781],['Wardha','Vidarbha',20.7453,78.6022],['Washim','Vidarbha',20.1110,77.1330],['Yavatmal','Vidarbha',20.3888,78.1204],['Maharashtra overview','Maharashtra',19.7515,75.7139]
].map(([name,region,lat,lon])=>({name,region,lat,lon}));

function clamp(value,min=0,max=1){return Math.max(min,Math.min(max,value));}
function hash(text){return [...text].reduce((a,c)=>(a*31+c.charCodeAt(0))%997,17);}
function districtProfile(district){const h=hash(district.name);return {rainBase:4+(h%13), temp:23+(h%11), humidity:46+(h%38), normal:70+(h%80)};}
function dayLabel(offset,locale='en-IN'){return new Intl.DateTimeFormat(locale,{weekday:'short',day:'numeric',month:'short'}).format(new Date(Date.now()+offset*86400000));}
function localPrototype(district,kind){
  const p=districtProfile(district), seed=hash(district.name+kind); const rainfall=[];
  for(let day=1;day<=7;day++){const variation=((seed+day*17)%19)-9; const mm=clamp((p.rainBase+variation/3)/24,0,1)*24; rainfall.push({day, label:dayLabel(day), mm:Number(mm.toFixed(1)), rainChance:Math.round(clamp(mm/18)*100)});}
  const rain30=Math.max(8,p.rainBase*3+((seed%17)-8)); const ratio=clamp(rain30/p.normal,0,2); const drought=clamp(1-ratio); const tempNorm=clamp((p.temp-15)/25); const humidityNorm=clamp(p.humidity/100); const rainFactor=clamp(1-Math.abs(1-ratio)); const pest=clamp(.4*tempNorm+.4*humidityNorm+.2*rainFactor);
  return {mode:'local-prototype',district,kind,rainfall,droughtProbability:Number(drought.toFixed(2)),pestProbability:Number(pest.toFixed(2)),rain30:Number(rain30.toFixed(1)),rainRatio:Number(ratio.toFixed(2)),temperature:p.temp,humidity:p.humidity};
}
async function getApolloPrediction(district,kind){
  try{const response=await fetch(APOLLO_MODEL_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({district:district.name,region:district.region,latitude:district.lat,longitude:district.lon,target:kind,horizon:7,model_family:'LSTM'})});if(!response.ok)throw new Error('API unavailable');const data=await response.json();return {...data,mode:'backend-lstm'};}catch(error){return localPrototype(district,kind);}
}
function nearestApolloDistrict(lat,lon){return APOLLO_DISTRICTS.reduce((best,d)=>{const distance=(d.lat-lat)**2+(d.lon-lon)**2;return distance<best.distance?{district:d,distance}:best;},{district:APOLLO_DISTRICTS[0],distance:Infinity}).district;}
