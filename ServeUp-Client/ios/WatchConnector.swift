//
//  WatchConnector.swift
//  myapp
//
//  Created by Yuval on 05/12/2023.
//

import Foundation
import WatchConnectivity

class WatchConnector: NSObject, WCSessionDelegate, ObservableObject {

  static let shared = WatchConnector()
  var session: WCSession
  
  init(session: WCSession = .default) {
    self.session = session
    super.init()
    session.delegate = self
    session.activate()
  }
  
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    
  }
  
  
  func sessionDidBecomeInactive(_ session: WCSession) {
    
  }
  
  func sessionDidDeactivate(_ session: WCSession) {
    
  }
  
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    //print(message)
    let pingValue = message["ping"]
    let finalScoreValue = message["finalScore"]
    
    let playAnotherSetValue = message["playAnotherSet"]
    let submitGameValue = message["submitGame"]
    let viValue = message["vi"]
    let pauseValue = message["pause"]
    let continuePlayValue = message["continuePlay"]

    let liveGameConnector = LiveGameConnector.shared

    if playAnotherSetValue != nil {
      liveGameConnector.playAnotherSet = "playAnotherSet"
    }
    
    if submitGameValue != nil {
      liveGameConnector.submitGame = "submitGame"
    }
    
    if viValue != nil {
      liveGameConnector.vi = "vi"
    }
    
    if pauseValue != nil {
      liveGameConnector.pause = "pause"
    }
    
    if continuePlayValue != nil {
      liveGameConnector.continuePlay = "continuePlay"
    }
    
    
    if pingValue != nil {
      liveGameConnector.pingPoint = pingValue as! String

    }
    if finalScoreValue != nil{
      liveGameConnector.finalGameResult = finalScoreValue as! String
    }
    
    RNEventEmitter.emitter.sendEvent(withName: "onSent", body: ["Test payload":"Test payload"])
  }
  
  
  func sendDetailsToWatch(){

    let liveGameConnector = LiveGameConnector.shared
    if session.isReachable{

      let data:[String: Any] = [
        "username" : liveGameConnector.opponentUsername,
        "pic" : liveGameConnector.opponentPic
      ]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
  }
  func sendIncScoreToWatch(){

    if session.isReachable{

      let data:[String: Any] = ["IncScore" : "IncScore"]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
  }
  func sendMoveToStartToWatch(){

    if session.isReachable{

      let data:[String: Any] = ["MoveToStart" : "MoveToStart"]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
  }
  
  
  
  func sendplayAnotherSetToWatch(){
    if session.isReachable{
      let data:[String: Any] = ["playAnotherSet" : "playAnotherSet"]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
  }
  
  func sendsubmitGameToWatch(){
    if session.isReachable{
      let data:[String: Any] = ["submitGame" : "submitGame"]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
  }
  func sendviToWatch(){
    if session.isReachable{
      let data:[String: Any] = ["vi" : "vi"]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
  }
  func sendpauseToWatch(){
    if session.isReachable{
      let data:[String: Any] = ["pause" : "pause"]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
  }
  func sendcontinuePlayToWatch(){
    if session.isReachable{
      let data:[String: Any] = ["continuePlay" : "continuePlay"]
      session.sendMessage(data, replyHandler: nil)
    }else{
      print ("session is not reachable")
    }
    
    
  }
  
  
  
}
