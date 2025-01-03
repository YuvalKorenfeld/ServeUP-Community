
import SwiftUI

struct FinishSetScreen: View {
    @EnvironmentObject var sharedData: SharedData
    @StateObject var watchConnector = WatchToiOSConnector()
    @StateObject var opponentDetails = OpponentDetails.shared
    @StateObject var navigationTracker = NavigationTracker()

  
    @State private var navigateToLiveCheck = false
   // @State private var useOfNavigationLink = false
    @State private var navigateToFinishCheck = false

    @State private var showAlert = false

    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>


    func resultsMe() -> String {
        return sharedData.setScores[0].player1 +
               "  " +
               (sharedData.curSetPlayed < 3 ? "-" : sharedData.setScores[1].player1) +
               "  " +
               (sharedData.curSetPlayed < 4 ? "-" : sharedData.setScores[2].player1)
    }
    
    func resultsOpponent() -> String {
        return sharedData.setScores[0].player2 + "  " + (sharedData.curSetPlayed < 3 ? "-" : sharedData.setScores[1].player2 ) + "  " + (sharedData.curSetPlayed < 4 ? "-" : sharedData.setScores[2].player2)
    }
    
    //only relevant for submiting after first set
    //because after 2 sets if someone was 2-0 it was over already before this screen
    //and also in 3 it was over before
    //here curSetPlayed will be 2, because 1 set is already over
    func SubmitGameFunc() {
        if(sharedData.setWinners[0] == 1){
            sharedData.isPlayer1Won = true
        }
        else{
            sharedData.isPlayer1Won = false
        }
        //if it's been 2 sets and it's tied
        if sharedData.curSetPlayed == 3 {
            showAlert = true
        } else {
            navigateToFinishCheck = true
        }
    }
    
    
    var body: some View {
            VStack {
                Text(opponentDetails.opponentUsername)
                    .font(.system(size: 22, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 40)
                    .offset(y: 40)
                Text(resultsOpponent())
                    .font(.system(size: 32, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 10)
                    .offset(y: 40)
                
                NavigationLink(
                    destination: LiveGameScreen()
                        .navigationBarTitle("") // This must be empty
                        .navigationBarHidden(true)
                        .navigationBarBackButtonHidden(true),
                    isActive: $navigateToLiveCheck
                ) {
                    EmptyView()
                }
                .hidden()

                Button(action: {
                    sendplayAnotherSetToIos()
                    sharedData.player1CurSetScore = "0"
                    sharedData.player2CurSetScore = "0"
                    //navigateToLiveCheck = true
                  presentationMode.wrappedValue.dismiss()


                }) {
                    Text("Play Another Set")
                        .font(.system(size: 15, design: .rounded))
                        .fontWeight(.semibold)
                        .foregroundColor(Color(red: 0.84, green: 1, blue: 0.27))
                        .frame(width: 200, height: 5)
                }
                .controlSize(.mini)
                .offset(y: -10)
                
                NavigationLink(
                    destination: FinishedGameScreen()
                        .navigationBarTitle("") // This must be empty
                        .navigationBarHidden(true)
                        .navigationBarBackButtonHidden(true),
                    isActive: $navigateToFinishCheck
                ) {
                    EmptyView()
                }
                .hidden()

                Button(action: {
                    SubmitGameFunc()
                  if (navigateToFinishCheck == true){
                    sendsubmitGameToIos()
                  }
                }) {
                    Text("Submit Game")
                        .font(.system(size: 15, design: .rounded))
                        .fontWeight(.semibold)
                        .foregroundColor(Color(red: 0.84, green: 1, blue: 0.27))
                        .frame(width: 200, height: 5)
                }
                .controlSize(.mini)
                .offset(y: -68)
                .alert(isPresented: $showAlert) {
                    Alert(
                        title: Text("Not Allowed"),
                        message: Text("You cannot submit the game at this point."),
                        dismissButton: .default(Text("OK"))
                    )
                }
                
                Text(resultsMe())
                    .font(.system(size: 32, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 10)
                    .offset(y: -60)
                
                Text("Me")
                    .font(.system(size: 22, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 10)
                    .offset(y: -40)
                
            }
            .padding(.horizontal, 20)
            .background(Color(red: 22/255, green: 37/255, blue: 41/255))
          
        
        .onAppear {
                        // Observe the notification to move to the start screen
                        NotificationCenter.default.addObserver(
                            forName: NSNotification.Name("playAnotherSet"),
                            object: nil,
                            queue: .main
                        ) { _ in
                            // Set shouldNavigate to true to trigger navigation
                          sharedData.player1CurSetScore = "0"
                          sharedData.player2CurSetScore = "0"
                          //navigateToLiveCheck = true
                          presentationMode.wrappedValue.dismiss()

                        }
          
                        NotificationCenter.default.addObserver(
                            forName: NSNotification.Name("submitGame"),
                            object: nil,
                            queue: .main
                        ) { _ in
                            // Set shouldNavigate to true to trigger navigation
                          if(sharedData.setWinners[0] == 1){
                              sharedData.isPlayer1Won = true
                          }
                          else{
                              sharedData.isPlayer1Won = false
                          }
                          navigateToFinishCheck = true
                        }
                    }
    }
  func sendplayAnotherSetToIos() {
    watchConnector.sendplayAnotherSetToIos(playAnotherSet : "playAnotherSet")
  }
  func sendsubmitGameToIos() {
      watchConnector.sendsubmitGameToIos(submitGame: "submitGame")

  }
}

struct FinishSetScreen_Previews: PreviewProvider {
    static var previews: some View {
        let sharedData = SharedData() // Assuming SharedData is ObservableObject
        sharedData.setScores = [(player1: "1", player2: "2"), (player1: "3", player2: "4"), (player1: "5", player2: "6")]
        
        return FinishSetScreen()
            .environmentObject(sharedData)
    }
}


