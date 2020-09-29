import { createContext } from 'react';

const CovidContext = createContext({
  covidData: [],
  setCovidData: () => {},
});

export default CovidContext;
