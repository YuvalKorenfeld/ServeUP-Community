//
//  Operation.swift
//  myapp
//
//  Created by Yuval on 05/12/2023.
//

import Foundation
import WatchConnectivity

@objc
class Operation : NSObject, ObservableObject{
    // Singleton instance
    @objc
    static let shared = Operation()

    // Property 1
    @objc
    let liveGameConnector: LiveGameConnector = LiveGameConnector.shared

    // Property 2
    @objc
   var watchConnector: WatchConnector
  

  
    // Private initializer to enforce singleton pattern
  @objc
  private override init() {
        watchConnector = WatchConnector()
    }
  
  @objc
  func sendDetailsToWatch(){
    let Operation = Operation.shared

    Operation.watchConnector.sendDetailsToWatch()
  }
  
  @objc
  func sendIncScoreToWatch(){
    let Operation = Operation.shared

    Operation.watchConnector.sendIncScoreToWatch()
  }
  
  @objc
  func sendMoveToStartToWatch(){
    let Operation = Operation.shared

    Operation.watchConnector.sendMoveToStartToWatch()
  }
  
  
  @objc
  func sendplayAnotherSetToWatch(){
    let Operation = Operation.shared
    Operation.watchConnector.sendplayAnotherSetToWatch()
  }
  @objc
  func sendsubmitGameToWatch(){
    let Operation = Operation.shared
    Operation.watchConnector.sendsubmitGameToWatch()
  }
  @objc
  func sendviToWatch(){
    let Operation = Operation.shared
    Operation.watchConnector.sendviToWatch()
  }
  @objc
  func sendpauseToWatch(){
    let Operation = Operation.shared
    Operation.watchConnector.sendpauseToWatch()
  }
  @objc
  func sendcontinuePlayToWatch(){
    let Operation = Operation.shared
    Operation.watchConnector.sendcontinuePlayToWatch()
  }
  
}

