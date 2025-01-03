import SwiftUI

struct FinishedGameScreen: View {
    @EnvironmentObject var sharedData: SharedData 
  @StateObject var watchConnector = WatchToiOSConnector()
  @StateObject var opponentDetails = OpponentDetails.shared
  @State private var isSubmitButtonTapped = false
  @StateObject var navigationTracker = NavigationTracker()

  
  func cleanAllData(){
    sharedData.cleanAllData()
    opponentDetails.cleanAllData()
    DupCleaner.hasAppeared = false

  }
  
 
  
  func SubmitToIos() {
    //take the result from SharedData
    // make it in string format
    let formattedString = sharedData.setScores.map { "\($0.player1)-\($0.player2)" }.joined(separator: ",")
    watchConnector.sendFinalScoreToIos(finalScore: formattedString)
    isSubmitButtonTapped = true

   }
  
    func winningPlayerName() -> String {
        if(sharedData.isPlayer1Won){
           return "You"
        }
        return opponentDetails.opponentUsername
    }
  func winningPlayerEmoji() -> String {
      if(sharedData.isPlayer1Won){
         return "🤩"
      }
      return "😓"
  }
    var body: some View {
        NavigationView {
            VStack {
              Text(winningPlayerEmoji())
                  .font(.system(size: 40, design: .rounded))
                  .fontWeight(.semibold)
                  .frame(width: 200, height: 30)

                Text(winningPlayerName())
                    .font(.system(size: 30, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 30)

                Text("Won!")
                    .font(.system(size: 50, design: .rounded))
                    .fontWeight(.bold)
                    .multilineTextAlignment(.center)
                    .foregroundColor(Color(red: 0.84, green: 1, blue: 0.27))
                    .frame(width: 200, height: 60)

              if isSubmitButtonTapped {
                                 NavigationLink(
                                     destination: OpenerScreen()
                                         .navigationBarTitle("") // this must be empty
                                         .navigationBarHidden(true)
                                         .navigationBarBackButtonHidden(true),
                                     isActive: $isSubmitButtonTapped
                                 ) {
                                     EmptyView()
                                 }

                             } else {
                                 Button(action: {
                                     SubmitToIos()
                                   cleanAllData()

                               
                                 }) {
                                     Text("Submit Results")
                                         .font(.system(size: 15, design: .rounded))
                                         .fontWeight(.semibold)
                                         .multilineTextAlignment(.center)
                                         .foregroundColor(Color(red: 0.84, green: 1, blue: 0.27))
                                         .cornerRadius(10)
                                         .frame(width: 200, height: 60)
                                 }
                             }
                         }
            .padding(.horizontal, 20)
            .background(Color(red: 22/255, green: 37/255, blue: 41/255))
            .alert(isPresented: $isSubmitButtonTapped) {
                Alert(
                    title: Text("Submitted successfully"),
                    message: Text("We look forward to seeing you soon..."),
                    dismissButton: .default(Text("Close the app"), action: {
                    exit(0)
                            })
                )
            }
        }
    }
}

struct FinishedGameScreen_Previews: PreviewProvider {
    static var previews: some View {
        
        let sharedData = SharedData()
        sharedData.player1Name = "Topaz Avraham"
        sharedData.player2Name = "Robert Kyosaki"
        sharedData.isPlayer1Won = false

        return FinishedGameScreen()
            .environmentObject(sharedData)
    }
}
