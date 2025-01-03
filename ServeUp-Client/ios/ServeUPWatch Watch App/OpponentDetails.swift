//
//  opponentDetails.swift
//  ServeUPWatch Watch App
//
//  Created by Yuval on 06/12/2023.
//

import Foundation
import Combine
import WatchConnectivity
import SwiftUI


class OpponentDetails :NSObject, ObservableObject {
  
  // Singleton instance
  static let shared = OpponentDetails()
  
  // Properties
  @Published var _opponentUsername: String
  @Published var _opponentPic: String
  @Published var _opponentPicImage: UIImage?
  
  // Private constructor with default values
  private override init() {
    
    _opponentUsername = "no opponent yet"
    _opponentPic = "no opponent pic yet"
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
      convertBase64ToImage()
    }
  }
  
  
  // Function to convert base64 string to Image
  func convertBase64ToImage() {
          DispatchQueue.main.async {
              let base64String = self.opponentPic
              
              if let data = Data(base64Encoded: base64String, options: .ignoreUnknownCharacters),
                 let uiImage = UIImage(data: data) {
                  // Set the UIImage directly
                  self._opponentPicImage = uiImage
              }
          }
      }
  
  func cleanAllData() {
          // Reset properties to their initial values
          opponentUsername = "no opponent yet"
          opponentPic = "no opponent pic yet"
          _opponentPicImage = nil
      }
  
}
