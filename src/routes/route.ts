import { UserController } from "../controllers/userController";
import { SearchController } from "../controllers/searchController";
import { SpamController } from "../controllers/spamController";

export class Route {
  public Route(app): void {

    const asyncErrorHandler = (handler) => {
      return async (req, res, next) => {
        try {
          await handler(req, res, next);
        } catch (err) {
          next(err);
        }
      };
    };

    // User Apis
    app.route('/portal/api/createuser').post(asyncErrorHandler(UserController.createUser));
    app.route('/portal/api/login').post(asyncErrorHandler(UserController.userLogin));

    // Spam Apis
    app.route('/portal/api/spam').post(SpamController.markAsSpam);

    // Seach Apis
    app.route('/portal/api/search/name/:query').get(SearchController.searchByName);
  }
}
