import tokenService from '../services/tokenService.js';
import chatService from "../services/chatService.js"

export async function getChats(req, res) {
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);


    res.json(await chatService.getChats(username));

  } catch (error) {
    res.status(400).send();
  }
}

export async function createChat(req, res) {
  var username="";
  try {
    username = await tokenService.isLoggedIn(req.headers.authorization);
    // Create a new chat based on the request body
  } catch (error) {
    res.status(401).send();
    return;
  }
  try {
    const chat = await chatService.createChat(req, username);
    // Return the created chat as a response
    res.status(201).send(chat);
    return;
  } catch (error) {
    res.status(400).send();
    return;
  }
}

export async function getChatById(req, res) {
  var username="";
  try {
    username = await tokenService.isLoggedIn(req.headers.authorization);
  } catch (error) {
    res.status(401).send();
    return;
  }
  try{
    const chat =  await chatService.getChatById(req.params.id,username);
    res.status(200).send(chat);
  } catch (error) {
    if(error.message==="Unauthorized"){
      res.status(401).send()
    }else{
    res.status(401).send();
    return;
    }
  }
}
export async function deleteChatById(req,res){
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try{
    const deleteStatus =  await chatService.deleteChatById(req.params.id);
    if(deleteStatus.status==204){
      res.status(204).send();
      return;
    }
  } catch (error) {
    res.status(404).json({ title: 'Not Found'});
    return;
  }
}

