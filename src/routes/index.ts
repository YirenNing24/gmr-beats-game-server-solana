//** ROUTE FILES
import auth from './auth.routes'
import gacha from './gacha.routes'
import inventory from './inventory.route'
import leaderboards from './leaderboard.routes'
import profile from './profile.routes'
import scores from './scores.routes'
import social from './social.routes'
import store from './store.routes'
import upgrade from './upgrade.routes'
import rewards from './rewards.routes'
import notification from './notification.routes'
import energy from './energy.routes'

//** WEBSOCKET ROUTE FILES
import chat from './chat.routes'
import server from './server.routes'



const routes = (app: any): void => {
    [
        auth,
        gacha,
        inventory,
        profile,
        scores,
        social,
        store,
        leaderboards,
        chat,
        upgrade,
        rewards,
        notification,
        energy,
        server
    ].forEach(route => route(app));
}

export default routes;

