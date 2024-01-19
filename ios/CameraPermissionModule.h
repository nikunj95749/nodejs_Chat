// CameraPermissionModule.m

#import "React/RCTBridgeModule.h"
#import <AVFoundation/AVFoundation.h>

@interface CameraPermissionModule : NSObject <RCTBridgeModule>
@end

@implementation CameraPermissionModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(checkCameraPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    NSString *result;

    switch (status) {
        case AVAuthorizationStatusAuthorized:
            result = @"granted";
            break;
        case AVAuthorizationStatusNotDetermined:
            result = @"undetermined";
            break;
        case AVAuthorizationStatusDenied:
            result = @"denied";
            break;
        case AVAuthorizationStatusRestricted:
            result = @"restricted";
            break;
    }

    resolve(result);
}

RCT_EXPORT_METHOD(requestCameraPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];

    switch (status) {
        case AVAuthorizationStatusAuthorized:
            resolve(@"granted");
            break;
        case AVAuthorizationStatusNotDetermined:
            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
                if (granted) {
                    resolve(@"granted");
                } else {
                    resolve(@"denied");
                }
            }];
            break;
    }
}

@end
