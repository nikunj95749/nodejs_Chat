#import "React/RCTBridgeModule.h"
#import "Reachability.h"
#import "NetworkModule.h"

@implementation NetworkModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isInternetConnected:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  Reachability *reachability = [Reachability reachabilityForInternetConnection];
  NetworkStatus networkStatus = [reachability currentReachabilityStatus];
  
  if (networkStatus == NotReachable) {
    resolve(@(NO));
  } else {
    resolve(@(YES));
  }
}

@end
