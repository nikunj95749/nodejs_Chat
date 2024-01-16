import {Dimensions, PixelRatio} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import { CANCELLED_WO, COMPLETED_WO, IN_PROGRESS_WO, NEW_WO, ORANGE, REVIEWED_WO, RE_SUBMITTED_WO } from './colors';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const IMAGE_ASPECT_RATIO = 16 / 9;
const GUIDELINE_BASE_WIDTH = 375;
const INCREASE_FONT_SIZE_BY_PERCENTAGE = 1.15; // 15%

export const scaleSize = (size) => (WINDOW_WIDTH / GUIDELINE_BASE_WIDTH) * size;

export const responsiveScale = (fontSize) =>
  RFValue(fontSize * INCREASE_FONT_SIZE_BY_PERCENTAGE, WINDOW_WIDTH);

export const scaleFont = (size) =>
  size * INCREASE_FONT_SIZE_BY_PERCENTAGE * PixelRatio.getFontScale();

function dimensions(top, right = top, bottom = top, left = right, property) {
  const styles = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(
  offset = {height: 2, width: 2},
  opacity = 0.2,
  radius = 8,
  color,
) {
  return {
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
    shadowColor: color,
  };
}

export function getWorkOrderStatusColor(status = '') {
  if (status === 'New') {
    return NEW_WO;
  }else if (status === 'InProgress') {
    return IN_PROGRESS_WO;
  }else if (status === 'Completed') {
    return COMPLETED_WO;
  }else if (status === 'ReSubmitted') {
    return RE_SUBMITTED_WO;
  }else if (status === 'Cancelled') {
    return CANCELLED_WO;
  }else if (status === 'Reviewed') {
    return REVIEWED_WO;
  }
  return ORANGE
}

export function centerVertical(blockHeight) {
  return WINDOW_HEIGHT / 2 - blockHeight / 2;
}
