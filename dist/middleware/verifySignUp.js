"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { AUTHORIZED_USERS } from '../config'
const validatorService = {
//     export const userValidator = (request: Request, response: Response, next: NextFunction) => {
// 	const users: any = AUTHORIZED_USERS.split(',')
// 	const userUploading = users.find((user: any) => user === request.body.UserName)
// 	if (userUploading) {
// 		next()
// 	} else {
// 		response.status(401).json({
// 			status: 'Failed',
// 			message: 'You are not an authorized user',
// 			data: null,
// 		})
// 	}
// }
// 	checkDuplicateUsernameOrEmail: async (request: Request, response: Response, next: NextFunction) => {
//   // Username
//     User.findOne({
//         where: {
//         username: req.body.username
//         }
//     }).then(user => {
//         if (user) {
//         res.status(400).send({
//             message: "Failed! Username is already in use!"
//         });
//         return;
//         }
//         // Email
//         User.findOne({
//         where: {
//             email: req.body.email
//         }
//         }).then(user => {
//         if (user) {
//             res.status(400).send({
//             message: "Failed! Email is already in use!"
//             });
//             return;
//         }
//         next();
//         });
//     });
// },
// checkRolesExisted = (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!ROLES.includes(req.body.roles[i])) {
//         res.status(400).send({
//           message: "Failed! Role does not exist = " + req.body.roles[i]
//         });
//         return;
//       }
//     }
//   }
//   next();
// };
// const verifySignUp = {
//   checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
//   checkRolesExisted: checkRolesExisted
// };
};
