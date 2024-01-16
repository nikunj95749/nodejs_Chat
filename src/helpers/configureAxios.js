import moment from 'moment';
import Qs from 'qs';

// Format nested params correctly
export const configureAxiosParams = (axios) => {
  axios.interceptors.request.use((config) => {
    config.paramsSerializer = (params) => {
      // Qs is already included in the Axios package
      return Qs.stringify(params, {
        arrayFormat: 'brackets',
        encode: false,
      });
    };

    return config;
  });
};

export  function timeRemaining(start, end) {
  // get unix seconds
  
  const began = moment(start,'DD-MM-YYYY h:mm a').unix();
  const stopped = moment(end,'DD-MM-YYYY h:mm a').unix();
  // find difference between unix seconds
  const difference = stopped - began;
  // apply to moment.duration
  const duration = moment.duration(difference, 'seconds');
  // then format the duration
  const h = duration.hours().toString();
  const m = duration.minutes().toString().padStart(2, '0');
  const s = duration.seconds().toString().padStart(2, '0');
  return `${h}:${m}`;
}