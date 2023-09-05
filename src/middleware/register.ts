//check to see if email already exists ensureUniqueEmail

//check to see if username already exists ensureUniqueqUsername

// export function ensureCorrectUser(req: Request, res: Response, next: NextFunction) {
//   const id = res.locals.user?.id;
//   if (id && (id === +req.params.id)) {
//     return next();
//   }

//   return next(new UnauthorizedError());
// }