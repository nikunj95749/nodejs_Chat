import {useState, useEffect} from 'react';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {setInternetAvailability} from '../../store/workOrderForOffline';
import { NativeModules } from 'react-native';

const { NetworkModule } = NativeModules;


const useCheckNetworkInfo = () => {
  const [internetAvailable, setInternetAvailable] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      NetworkModule.isInternetConnected()
      .then((result) => {
        dispatch(setInternetAvailability(result));
        setInternetAvailable(result);
      })
      .catch((error) => {
        console.error(error);
      });
      // NetInfo.fetch().then((state) => {
      //   if (state.isInternetReachable) {
      //     dispatch(setInternetAvailability(true));
      //     setInternetAvailable(true);
      //   } else {
      //     dispatch(setInternetAvailability(false));
      //     setInternetAvailable(false);
      //   }
      // });
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   let unsubscribe = () => {};
  //   NetInfo.fetch().then((state) => {
  //     setTimeout(() => {
  //       if (state.isConnected) {
  //         dispatch(setInternetAvailability(true));
  //         setInternetAvailable(true);
  //       } else {
  //         dispatch(setInternetAvailability(false));
  //         setInternetAvailable(false);
  //       }
  //       unsubscribe = NetInfo.addEventListener((state) => { 
  //         if (state.isInternetReachable) {
  //           dispatch(setInternetAvailability(true));
  //           setInternetAvailable(true);
  //         } else {
  //           dispatch(setInternetAvailability(false));
  //           setInternetAvailable(false);
  //         }
  //       });
  //     }, 1000);
  //   });

  //   return () => {
  //     // unsubscribe();
  //   };
  // }, []);

  return {internetAvailable};
};

export default useCheckNetworkInfo;
