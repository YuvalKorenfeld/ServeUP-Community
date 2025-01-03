import SwiftUI


struct LiveGameScreen: View {
    @EnvironmentObject var sharedData: SharedData
    @StateObject var watchConnector = WatchToiOSConnector()
    @StateObject var opponentDetails = OpponentDetails.shared
    @StateObject var navigationTracker = NavigationTracker()

    @State private var isGameStopScreenPressed = false
    @State private var isGameFinishedScreenPressed = false
    @State private var CheckSetScreen = false
    @State private var CheckFinishedSet = false
    @State private var showAlert = false
    @State private var showConfirmationAlert = false
    
    @State var player1CurGameScore = "0"
    @State var player2CurGameScore = "0"

    func ViFunc() {
        //if the current set is the first there is no one who won a set so no winner yet
        if (sharedData.curSetPlayed == 1){
            showAlert = true
            return
        }
        //set 1 already finished and set 2 is currently, check who won first and decalre him winner
        if (sharedData.curSetPlayed == 2){
              //check who won first set and declare him the winner
              if (sharedData.setWinners[0] == 1){
                  sharedData.isPlayer1Won = true
              }
              else{
                  sharedData.isPlayer1Won = false
              }
              //can go to finish screen to declarw winner
              self.isGameFinishedScreenPressed = true
          return
        }
        //this is the third set played now - so must be 1-1 in sets so no winner until finish set 3
        showAlert = true
        return
    }
    
    func stopFunc(){
        if (player1CurGameScore != "0" || player2CurGameScore != "0"){
            showAlert = true
            return
        }
        self.isGameStopScreenPressed = true
    }
    

  
    var body: some View {
            VStack {
                Text(opponentDetails.opponentUsername)
                    .font(.system(size: 22, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 40)
                Text(player2CurGameScore)
                    .font(.system(size: 48, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 20)

                
                HStack {
                    Text(sharedData.player2CurSetScore)
                        .font(.system(size: 40, design: .rounded))
                        .fontWeight(.bold)
                        .foregroundColor(Color.gray)
                        .frame(width: 200, height: 5)
                        .padding(.trailing, 150)
                        
                }
                
                HStack {
                    Rectangle()
                      .fill(Color(red: 0.56, green: 0.56, blue: 0.58))
                      .frame(width: 5, height: 16)
                      .cornerRadius(3)
                      .onTapGesture {
                        stopFunc()
                        if(isGameStopScreenPressed){
                          sendStopToIos()
                        }
                      }
                      .padding(.leading, 150)
                    
                    Rectangle()
                      .fill(Color(red: 0.56, green: 0.56, blue: 0.58))
                      .frame(width: 5, height: 16)
                      .cornerRadius(3)
                      .onTapGesture {
                        stopFunc()
                        if(isGameStopScreenPressed){
                          sendStopToIos()
                        }
                      }
                      .padding(.leading, 1)
                }
                .onTapGesture {
                    stopFunc()
                    if(isGameStopScreenPressed){
                      sendStopToIos()
                    }
                }
                .alert(isPresented: $showAlert) {
                    Alert(
                        title: Text("Not Allowed"),
                        message: Text("You can't stop the match during a game."),
                        dismissButton: .default(Text("OK"))
                    )
                }

                .onAppear {
                                // Observe the notification to move to the start screen
                                NotificationCenter.default.addObserver(
                                    forName: NSNotification.Name("pause"),
                                    object: nil,
                                    queue: .main
                                ) { _ in
                                    // Set shouldNavigate to true to trigger navigation
                                    navigationTracker.pause = true
                                  isGameStopScreenPressed=true
                                }
                            }
                            .sheet(isPresented: $isGameStopScreenPressed) {
                                NavigationView {
                                  GameStopScreen()
                                        .navigationBarHidden(true)
                                }
                            }
            
                Rectangle()
                  .frame(width: 190.00, height: 5.00)
                  .foregroundColor(Color.white)
                  .cornerRadius(3)

                HStack {
                    Rectangle()
                      .fill(Color(red: 0.56, green: 0.56, blue: 0.58))
                      .frame(width: 5, height: 12)
                      .cornerRadius(3)
                      .rotationEffect(.degrees(-38))
                      .onTapGesture {
                          if (sharedData.curSetPlayed == 2){
                            showConfirmationAlert=true
                          }
                          else{
                            ViFunc()
                          if(isGameFinishedScreenPressed){
                            sendviToIos()
                          }
                          }
                      }
                      .padding(.leading, 150)                      

                    
                    Rectangle()
                      .fill(Color(red: 0.56, green: 0.56, blue: 0.58))
                      .frame(width: 5, height: 18)
                      .cornerRadius(3)
                      .rotationEffect(.degrees(30))
                      .onTapGesture {
                          if (sharedData.curSetPlayed == 2){
                            showConfirmationAlert=true
                          }
                          else{
                            ViFunc()
                          if(isGameFinishedScreenPressed){
                            sendviToIos()
                          }
                        }
                      }
                      .padding(.leading, -3)
                      .padding(.top, -1.7)
                }
                .onTapGesture {
                  if (sharedData.curSetPlayed == 2){
                    showConfirmationAlert=true
                  }
                  else{
                    ViFunc()
                  if(isGameFinishedScreenPressed){
                    sendviToIos()
                  }
                  }
                  
                }
                .alert(isPresented: $showAlert) {
                    Alert(
                      title: Text("Not Allowed"),
                      message: Text("You cannot submit the game at this point."),
                        dismissButton: .default(Text("OK"))
                    )
                }
                .alert(isPresented: $showConfirmationAlert) {
                    Alert(
                        title: Text("Submission"),
                        message: Text("Are you sure you want to end the game?"),
                        primaryButton: .default(Text("Submit the game"), action: {
                                      ViFunc()
                                    if(isGameFinishedScreenPressed){
                                      sendviToIos()
                                    }
                                }),
                                secondaryButton: .default(Text("Cancel"), action: {
                
                                })
                    )
                }
                .onAppear {
                                // Observe the notification to move to the start screen
                                NotificationCenter.default.addObserver(
                                    forName: NSNotification.Name("vi"),
                                    object: nil,
                                    queue: .main
                                ) { _ in
                                    // Set shouldNavigate to true to trigger navigation
                                    navigationTracker.vi = true
                                    ViFunc()
                                  //isGameFinishedScreenPressed=true
                                }
                            }
                            .sheet(isPresented: $isGameFinishedScreenPressed) {
                                NavigationView {
                                  FinishedGameScreen()
                                        .navigationBarHidden(true)
                                }
                            }
                
                HStack {
                    Text(sharedData.player1CurSetScore)
                        .font(.system(size: 40, design: .rounded))
                        .fontWeight(.bold)
                        .foregroundColor(Color.gray)
                        .frame(width: 200, height: 5)
                        .padding(.trailing, 150)
                }
                

                
                Text(player1CurGameScore)
                    .font(.system(size: 48, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color(red: 0.84, green: 1, blue: 0.27))
                    .frame(width: 200, height: 26)
                
                Text(" Me")
                    .font(.system(size: 22, design: .rounded))
                    .fontWeight(.semibold)
                    .foregroundColor(Color(red: 0.84, green: 1, blue: 0.27))
                    .frame(width: 200, height: 30)
            }
            .onAppear {
              if (DupCleaner.hasAppeared == false){
                NotificationCenter.default.addObserver(
                    forName: NSNotification.Name("IncrementPlayer2CurGameScore"),
                    object: nil,
                    queue: .main
                ) { _ in
                    IncrementPlayer2CurGameScore()
                }
              }
              DupCleaner.hasAppeared = true
              
              }
              .onDisappear {
                  NotificationCenter.default.removeObserver(
                      self,
                      name: NSNotification.Name("IncrementPlayer2CurGameScore"),
                      object: nil
                  )
              }
                        
            .padding(.horizontal, 20)
            .background(Color(red: 22/255, green: 37/255, blue: 41/255))
            .gesture(
                DragGesture()
                    .onEnded { gesture in
                        if gesture.translation.width > 0 { // slide right
                            IncrementPlayer1CurGameScore()
                          //notify the other watch
                          sendPingToIos()
                        } else if  gesture.translation.width < 0 {// slide left
                           // IncrementPlayer2CurGameScore()
                          //this function will be activated base on the notification fron other watch
                        }
                    }
            )
            .sheet(isPresented: $CheckFinishedSet) {
                NavigationView {
                    
                    FinishSetScreen()
                        .navigationBarHidden(true)
                    }
                     
                    }
            
    }

    func IncrementPlayer2CurGameScore() {
            // Increment the current game score based on tennis scoring
            switch player2CurGameScore {
            case "0", "15":
                player2CurGameScore = String(Int(player2CurGameScore)! + 15)
            case "30":
                player2CurGameScore = String(Int(player2CurGameScore)! + 10)
            case "40":
                if(player1CurGameScore == "40"){
                    // If the score is 40, it can go to game point
                    player2CurGameScore = "Adv"
                }
                else if (player1CurGameScore == "Adv"){
                    player1CurGameScore = "40"
                }
                else{
                    player1CurGameScore = "0"
                    player2CurGameScore = "0"
                    IncrementPlayer2CurSetScore()
                }
            case "Adv":
                    player1CurGameScore = "0"
                    player2CurGameScore = "0"
                    IncrementPlayer2CurSetScore()
            default:
                // If the score is already at game point, no further increment
                break
            }
            //sharedData.opponentDoneAPoint=false
        }
    
    
    func IncrementPlayer1CurGameScore() {
            // Increment the current game score based on tennis scoring
            switch player1CurGameScore {
            case "0", "15":
                player1CurGameScore = String(Int(player1CurGameScore)! + 15)
            case "30":
                player1CurGameScore = String(Int(player1CurGameScore)! + 10)
            case "40":
                if(player2CurGameScore == "40"){
                    // If the score is 40, it can go to game point
                    player1CurGameScore = "Adv"
                }
                else if (player2CurGameScore == "Adv"){
                    player2CurGameScore = "40"
                }
                else{
                    player1CurGameScore = "0"
                    player2CurGameScore = "0"
                    IncrementPlayer1CurSetScore()
                }
            case "Adv":
                    player1CurGameScore = "0"
                    player2CurGameScore = "0"
                    IncrementPlayer1CurSetScore()
            default:
                // If the score is already at game point, no further increment
                break
            }
        }
    
    func CheckifSomeoneWon(SetsPlayed: Int) -> Bool {
 
        if (SetsPlayed == 2){
            if(sharedData.setWinners[0] == 1 && sharedData.setWinners[1] == 1){
                sharedData.isPlayer1Won = true
                return true
            }
            if(sharedData.setWinners[0] == 2 && sharedData.setWinners[1] == 2){
                sharedData.isPlayer1Won = false
                return true
            }
            //they are tied
            return false
        }
        
        else{
            let player1Count = sharedData.setWinners.filter { $0 == 1 }.count
            let player2Count = sharedData.setWinners.filter { $0 == 2 }.count
            
            if player1Count > player2Count {
                sharedData.isPlayer1Won = true
            }
            else {
                sharedData.isPlayer1Won = false
            }
            return true
        }
    }
    
  
    func updateSetScoreAndCheckWin() {
        sharedData.setScores[sharedData.curSetPlayed-1].player1 = sharedData.player1CurSetScore
        sharedData.setScores[sharedData.curSetPlayed-1].player2 = sharedData.player2CurSetScore
        if(sharedData.player1CurSetScore > sharedData.player2CurSetScore){
            sharedData.setWinners[sharedData.curSetPlayed-1] = 1
        }
        else{
            sharedData.setWinners[sharedData.curSetPlayed-1] = 2
        }
    
        if (sharedData.curSetPlayed == 3) {
            if(CheckifSomeoneWon(SetsPlayed: sharedData.curSetPlayed)){
                self.isGameFinishedScreenPressed = true
                return
            }
        }
        
        if (sharedData.curSetPlayed == 2) {
            if(CheckifSomeoneWon(SetsPlayed: sharedData.curSetPlayed)){
                self.isGameFinishedScreenPressed = true
                return
            }
        }
        sharedData.curSetPlayed += 1
        
        // Finish set screen
        self.CheckFinishedSet = true
    }
    
    
    func IncrementPlayer1CurSetScore() {
        // Increment the current set score based on tennis scoring
        guard let currentSetScore = Int(sharedData.player1CurSetScore) else {
            return
        }
        
        guard let currentOpponentSetScore = Int(sharedData.player2CurSetScore) else {
            return
        }
   
        if (currentSetScore < 5){
            sharedData.player1CurSetScore = String(currentSetScore + 1)
        }
        
        if (currentSetScore >= 5){
            //check if player2 is on the same number, or opponent is up by 1 then only increment
            
            //if I lead 5-4, 6-5, 7-6 etc..
            if (currentSetScore == currentOpponentSetScore + 1){

                sharedData.player1CurSetScore = String(currentSetScore + 1)
                updateSetScoreAndCheckWin()
                return
            }
            //it is 5-5,6-6,7-7 etc or he lead me by 1 , 5-6,6-7 etc.
            if (currentSetScore == currentOpponentSetScore){

                sharedData.player1CurSetScore = String(currentSetScore + 1)
                return
            }
            
            //6-2,6-3...
            else{

                sharedData.player1CurSetScore = String(currentSetScore + 1)
                updateSetScoreAndCheckWin()
                return
            }
        }
    }
    
    func IncrementPlayer2CurSetScore() {
    
      
        // Increment the current set score based on tennis scoring
        guard let currentSetScore = Int(sharedData.player2CurSetScore) else {
            return
        }
        
        guard let currentOpponentSetScore = Int(sharedData.player1CurSetScore) else {
            return
        }

        if (currentSetScore < 5){
            sharedData.player2CurSetScore = String(currentSetScore + 1)
        }
        
        if (currentSetScore >= 5){
            //check if player2 is on the same number, or opponent is up by 1 then only increment
            
            //if I lead 5-4, 6-5, 7-6 etc..
            if (currentSetScore == currentOpponentSetScore + 1){
                sharedData.player2CurSetScore = String(currentSetScore + 1)
                updateSetScoreAndCheckWin()
                return
            }
            //it is 5-5,6-6,7-7 etc or he lead me by 1 , 5-6,6-7 etc.
            if (currentSetScore == currentOpponentSetScore){
                sharedData.player2CurSetScore = String(currentSetScore + 1)
                return
            }
            
            //6-2,6-3...
            else{
                sharedData.player2CurSetScore = String(currentSetScore + 1)
                updateSetScoreAndCheckWin()
                return
            }
        }
    }
  
  func sendPingToIos() {
      watchConnector.sendPingToIos(ping: "1")
  }
  
  func sendStopToIos() {
      watchConnector.sendpauseToIos(pause: "pause")
  }
  func sendviToIos() {
      watchConnector.sendviToIos(vi: "vi")
  }
}

struct LiveGameScreen_Previews: PreviewProvider {
    static var previews: some View {
        
        let sharedData = SharedData()
        sharedData.player2Name = "Robert Kyosaki"
        sharedData.player1Name = "Topaz Avraham"
        
        return LiveGameScreen()
            .environmentObject(sharedData)
    }
}
