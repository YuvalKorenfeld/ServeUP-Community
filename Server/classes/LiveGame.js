import gameService from "../services/gameService.js";
class LiveGame {
    // Constructor method to initialize the object
    constructor(player1, player2) {
      this.player1 = player1;
      this.player2 = player2;
      this.score1=null;
      this.score2=null;
      this.isPlayer1Won=true;
      this.date = Date.now();

    }

    async culcWinnerAndUpdateDataBase(){
    // has 3 indexes (0:first game, 1:secound game, 2:third game)
    // in each index : 1= player 1 won this game, 2= player 2 won this game , 0= no one won this game
    const sets =[];
    let index = 0;
    const saveScore1= this.score1;

    const pairs = this.score1.split(',');
    pairs.forEach(pair => {
      const [p1s, p2s] = pair.split('-');
      const p1 = parseInt(p1s, 10);
      const p2 = parseInt(p2s, 10);
  
      if (!isNaN(p1) && !isNaN(p2)) {
        if (p1 > p2) {
          sets[index]= 1;
        } else if (p1 < p2) {
          sets[index]= 2;
        } else {
          sets[index]= 0;
        }
      } else {
      }
      index++;
    });


    //there is only one game
    if (sets[1]==0){
       if(sets[0]==1){
        this.isPlayer1Won= true;
       }
        else{
          this.isPlayer1Won= false;
       }
    } else{

  //There was no third game because someone won the first two games
      if (sets[2]==0){
        if(sets[0]==1 && sets[1]==1){
          this.isPlayer1Won= true;  
        }
        if(sets[0]==2 && sets[1]==2){
          this.isPlayer1Won= false;  
        }
      }
      //In his first game someone won and in the second game the opponent won
      // and they went to a third game to determine who won
      else{
        if (sets[2]==1){
          this.isPlayer1Won= true;
        }
        if(sets[2]==2){
          this.isPlayer1Won= false;
        }
      }

    }

    
    //**************************************************************************************** */
    //At this point the final winner has already been determined and the database can now be updated
    const pairsForDB = saveScore1.split(',');
    const setsDB=[];
    pairsForDB.forEach(pair => {
      const [p1sDB, p2sDB] = pair.split('-');
      const p1DB = parseInt(p1sDB, 10);
      const p2DB = parseInt(p2sDB, 10);
      const set = {player1:p1DB,player2:p2DB};
      setsDB.push(set);
    });
    const winner =this.isPlayer1Won? this.player1: this.player2;
    gameService.createGame(this.date,this.player1,this.player2,setsDB,winner);
    
    // in the end we need to remove this live game instance from the live game array
    // so this two opponents will be able to play another time
    }
  }
export default LiveGame;