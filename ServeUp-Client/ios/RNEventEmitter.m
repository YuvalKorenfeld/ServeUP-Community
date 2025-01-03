//
//  RCTEventEmitter.m
//  myapp
//
//  Created by Yuval on 10/12/2023.
//
//  RCTEventEmitter.m

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE (RNEventEmitter, RCTEventEmitter)
    RCT_EXTERN_METHOD(supportedEvents)
@end
