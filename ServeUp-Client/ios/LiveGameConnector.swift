//
//  LiveGame.swift
//  myapp
//
//  Created by Yuval on 03/12/2023.
//

import Foundation
import Combine
import WatchConnectivity

//@objc(LiveGameConnector)
@objc
class LiveGameConnector :NSObject, ObservableObject {
  
    // Singleton instance
    @objc
    static let shared = LiveGameConnector()

    // Properties
  @Published var _opponentUsername: String
  @Published var _opponentPic: String
  @Published var _finalGameResult: String
  @Published var _pingPoint: String
  
  @Published var _playAnotherSet: String
  @Published var _submitGame: String
  @Published var _vi: String
  @Published var _pause: String
  @Published var _continuePlay: String

  
    // Private constructor with default values
  @objc
  private override init() {

        _opponentUsername = "no opponent yet"
        _opponentPic = "no opponent pic yet"
        _finalGameResult = "0-0,0-0,0-0"
        _pingPoint = "0"
    
        _playAnotherSet = "false"
        _submitGame = "false"
        _vi = "false"
        _pause = "false"
        _continuePlay = "false"
    }
  

    // Getter and Setter for opponentUsername
    @objc
    var opponentUsername: String {
        get {
            return _opponentUsername
        }
        set {
            _opponentUsername = newValue
        }
    }

    // Getter and Setter for opponentPic
    @objc
    var opponentPic: String {
        get {
            return _opponentPic
        }
        set {
            _opponentPic = newValue
        }
    }

    // Getter and Setter for finalGameResult
    @objc
    var finalGameResult: String {
        get {
            return _finalGameResult
        }
        set {
            _finalGameResult = newValue
        }
    }

    // Getter and Setter for pingPoint
    @objc
    var pingPoint: String {
        get {
            return _pingPoint
        }
        set {
            _pingPoint = newValue
        }
    }
  // Getter and Setter for playAnotherSet
  @objc
  var playAnotherSet: String {
      get {
          return _playAnotherSet
      }
      set {
          _playAnotherSet = newValue
      }
  }

  // Getter and Setter for submitGame
  @objc
  var submitGame: String {
      get {
          return _submitGame
      }
      set {
          _submitGame = newValue
      }
  }

  // Getter and Setter for vi
  @objc
  var vi: String {
      get {
          return _vi
      }
      set {
          _vi = newValue
      }
  }

  // Getter and Setter for pause
  @objc
  var pause: String {
      get {
          return _pause
      }
      set {
          _pause = newValue
      }
  }

  // Getter and Setter for continuePlay
  @objc
  var continuePlay: String {
      get {
          return _continuePlay
      }
      set {
          _continuePlay = newValue
      }
  }

  // Function to reset all properties to their initial values
  @objc
  func cleanAllData() {
      opponentUsername = "no opponent yet"
      opponentPic = "no opponent pic yet"
      finalGameResult = "0-0,0-0,0-0"
      pingPoint = "0"
      playAnotherSet = "false"
      submitGame = "false"
      vi = "false"
      pause = "false"
      continuePlay = "false"
  }
  
  // Function to reset all Navigation properties to their initial values
  @objc
  func cleanAllNavigation() {
    playAnotherSet = "false"
    submitGame = "false"
    vi = "false"
    pause = "false"
    continuePlay = "false"
  }
}
