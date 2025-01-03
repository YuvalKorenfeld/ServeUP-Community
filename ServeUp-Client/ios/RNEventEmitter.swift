//
//  RNEventEmitter.swift
//  myapp
//
//  Created by Yuval on 10/12/2023.
//
//  RNEventEmitter.swift

import Foundation
import React

@objc(RNEventEmitter)
open class RNEventEmitter :RCTEventEmitter{
  
  public static var emitter: RCTEventEmitter!
  
  override public init() {
    super .init()
    RNEventEmitter.emitter=self
  }
  
  open override func supportedEvents() -> [String]! {
    ["onSent"]
  }
  @objc public override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
