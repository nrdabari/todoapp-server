

import { check } from "express-validator";

export const LoginSchema=[
    check('password','Password is required').isLength({min:6,max:100}).trim(),

    check('email','email is required').exists().isEmail(),
]