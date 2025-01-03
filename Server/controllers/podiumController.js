import userService from "../services/userService.js";
import tokenService from "../services/tokenService.js";
export const getPodium = async (req, res) => {
    try {

        const username = await tokenService.isLoggedIn(req.headers.authorization);
        const podium = await userService.getUserPodium(username);
        res.json(podium).status(200).send();
    
    } catch(error) {
        res.status(400).send();
    }

};
