//
//  ContentView.swift
//  ServeUPWatch Watch App
//
//  Created by Yuval on 03/12/2023.
//

import SwiftUI
import WatchConnectivity

struct ContentView: View {
    @StateObject var watchConnector = WatchToiOSConnector()
    @StateObject var opponentDetails = OpponentDetails.shared


  
  
    var body: some View {
        VStack {
          

            // Display the opponent's username
            Text(opponentDetails.opponentUsername)

            // Display the opponent's image
          Image(uiImage: opponentDetails._opponentPicImage ?? UIImage()) // Use the UIImage directly
            .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 50, height: 50) // Adjust the size as needed
                .clipShape(Circle()) // Clip the image in a circular shape
                .overlay(Circle().stroke(Color.white, lineWidth: 2)) // Add a white border around the circle
                .shadow(radius: 5) // Add a shadow for a better visual effect
                .padding()

            // Display the opponent's base64 string
            //Text(opponentDetails.opponentPic)

            Button("ping point") {
                // Handle button tap action here
                sendPingToIos()
            }
            .padding()

            Button("end game") {
                // Handle button tap action here
                sendFinalScoreToIos()
            }
            .padding()
        }
        .padding()
        
    }

    func sendPingToIos() {
        watchConnector.sendPingToIos(ping: "1")
    }

    func sendFinalScoreToIos() {
        watchConnector.sendFinalScoreToIos(finalScore: "1-0,6-1,5-3")
    }


}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
