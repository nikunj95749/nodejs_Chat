import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import FeedBack from '../../../assets/images/FeedBack.svg';
import Help from '../../../assets/images/Help.svg';
import About from '../../../assets/images/About.svg';
import PrivacyPolicy from '../../../assets/images/PrivacyPolicy.svg';
import Report from '../../../assets/images/Report.svg';
import LogOut from '../../../assets/images/LogOut.svg';
import Summary from '../../../assets/images/Summary.svg';
import {ORANGE, WHITE} from '../../../styles';
import { TxtPoppinMedium } from '../../../components/text/TxtPoppinMedium';

export default function MoreInfoItem(props) {
  
  return (
    <TouchableOpacity
      {...props}
      style={{
        width: '95%',
        height:80,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        borderRadius: 8,
        backgroundColor: WHITE,
        marginTop: 15,
      }}>
      <View style={{height: 30, width: 30, marginLeft: 20}}>
        {/* {props?.titleImage}
         */}
        {props?.title === 'Contact Us' && (
          <FeedBack fill={'red'} height={'100%'} width={'100%'} />
        )}
        {props?.title === 'Terms of Use' && <Help height={'100%'} width={'100%'} />}

        {props?.title === 'About' && <About height={'100%'} width={'100%'} />}
        {props?.title === 'Privacy Policy' && (
          <PrivacyPolicy height={'100%'} width={'100%'} />
        )}
        {props?.title === 'Work Order Report' && (
          <Report height={'100%'} width={'100%'} />
        )}
        {props?.title === 'Logout' && <LogOut height={'100%'} width={'100%'} />}
        {props?.title === 'Summary List' && <Summary height={'100%'} width={'100%'} />}

      </View>

      <View style={{justifyContent: 'center', height: '100%', width: '100%'}}>
        <TxtPoppinMedium style={{
            marginLeft: 20,
          }} title={props?.title}/>
      </View>
    </TouchableOpacity>
  );
}
