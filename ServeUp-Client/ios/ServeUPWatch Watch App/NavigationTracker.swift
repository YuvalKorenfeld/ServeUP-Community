//
//  NavigationTracker.swift
//  ServeUPWatch Watch App
//
//  Created by Yuval on 18/12/2023.
//

import Foundation
import SwiftUI
class NavigationTracker: ObservableObject {
  
  // Singleton instance
  static let shared = NavigationTracker()
  
  @Published var playAnotherSet = false
  @Published var submitGame = false
  @Published var vi = false
  @Published var pause = false
  @Published var continuePlay = false

  }
