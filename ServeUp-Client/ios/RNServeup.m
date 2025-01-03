//  RNServeup.m
//  myapp
//
//  Created by Yuval on 02/12/2023.
//

#import <React/RCTLog.h>
#import "RNServeup.h"
#import "myapp-Swift.h"
#import "myapp-Bridging-Header.h"

@implementation RNServeup

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();

// Property to track if the module has listeners
bool hasListeners = NO;

// Method to send events to JavaScript
- (void)sendEventWithName:(NSString *)eventName body:(id)body {
  if (self.bridge) {
    [self sendEventWithName:eventName body:body];
  }
}

// Method to notify JavaScript about the availability of new events
- (NSArray<NSString *> *)supportedEvents {
  return @[@"addEvent"];
}

// Method to start observing events
- (void)startObserving {
  hasListeners = YES;
}

// Method to stop observing events
- (void)stopObserving {
  hasListeners = NO;
}

RCT_EXPORT_METHOD (addEvent: (NSString *)name location: (NSString *)location)
{
  //RCTLogInfo(@"Pretending to create an event %@", name);
  
  if ([name isEqualToString:@"new"] && [location isEqualToString:@"operation"]) {
    Operation *operation = [Operation shared];
    //[operation sendMoveToStartToWatch];
    
  } else {
    
    if ([name isEqualToString:@"playAnotherSet"] && [location isEqualToString:@"Navigation"]){
      Operation *operation = [Operation shared];
      [operation sendplayAnotherSetToWatch];
      return;
    }
    if ([name isEqualToString:@"submitGame"] && [location isEqualToString:@"Navigation"]){
      Operation *operation = [Operation shared];
      [operation sendsubmitGameToWatch];
      return;
    }
    if ([name isEqualToString:@"vi"] && [location isEqualToString:@"Navigation"]){
      Operation *operation = [Operation shared];
      [operation sendviToWatch];
      return;
    }
    if ([name isEqualToString:@"pause"] && [location isEqualToString:@"Navigation"]){
      Operation *operation = [Operation shared];
      [operation sendpauseToWatch];
      return;
    }
    if ([name isEqualToString:@"continuePlay"] && [location isEqualToString:@"Navigation"]){
      Operation *operation = [Operation shared];
      [operation sendcontinuePlayToWatch];
      return;
    }
    
    
    if([name isEqualToString:@"inc"] && [location isEqualToString:@"score"]){
      Operation *operation = [Operation shared];
      [operation sendIncScoreToWatch];

    }else{
      Operation *operation = [Operation shared];
      LiveGameConnector *liveGameConnector = [LiveGameConnector shared];

      liveGameConnector.opponentUsername = name;
      liveGameConnector.opponentPic = location;
      [operation sendMoveToStartToWatch];
      [operation sendDetailsToWatch];
    }
    
  }
  
  // Check if there are listeners and send the event
  if (hasListeners) {
    [self sendEventWithName:@"addEvent" body:@{@"name": name, @"location": location}];
  }
}

RCT_EXPORT_METHOD(findEvents: (RCTResponseSenderBlock)callback)
{
  LiveGameConnector *liveGameConnector = [LiveGameConnector shared];
  
  if ([liveGameConnector.pingPoint isEqualToString:@"1"]) {
    callback(@[liveGameConnector.pingPoint]);
    liveGameConnector.pingPoint = @"0";
    return;
  }
  
  
  if (![liveGameConnector.playAnotherSet isEqualToString:@"false"]) {
    callback(@[liveGameConnector.playAnotherSet]);
    [liveGameConnector cleanAllNavigation];
    return;
  }
  if (![liveGameConnector.submitGame isEqualToString:@"false"]) {
    callback(@[liveGameConnector.submitGame]);
    [liveGameConnector cleanAllNavigation];
    return;
  }
  if (![liveGameConnector.vi isEqualToString:@"false"]) {
    callback(@[liveGameConnector.vi]);
    [liveGameConnector cleanAllNavigation];
    return;
  }
  if (![liveGameConnector.pause isEqualToString:@"false"]) {
    callback(@[liveGameConnector.pause]);
    [liveGameConnector cleanAllNavigation];
    return;
  }
  if (![liveGameConnector.continuePlay isEqualToString:@"false"]) {
    callback(@[liveGameConnector.continuePlay]);
    [liveGameConnector cleanAllNavigation];
    return;
  }
  
 
  if (![liveGameConnector.finalGameResult isEqualToString:@"0-0,0-0,0-0"]) {
    callback(@[liveGameConnector.finalGameResult]);
    [liveGameConnector cleanAllData];
    return;
  } else {
    callback(@[liveGameConnector.opponentUsername]);
  }
    
  
}

@end
