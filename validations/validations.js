import {body} from "express-validator";

export const loginValidator=[
    body('email').isEmail(),
    body('password').isLength({min: 5}),
]

export const registerValidator=[
    body('email', "not correct email").isEmail(),
    body('password', "password min 5 symbols").isLength({min: 5}),
    body('fullName', "min length is 3").isLength({min: 3}),
    body('avatarUrl', "wrong URL").optional().isURL()
]

export const postCreateValidator=[
    body('title', "make a title").isLength({min: 3}).isString(),
    body('text', "write a text").isLength({min: 10}).isString(),
    body('tags', "wrong format of tags").optional().isString(),
    body('imageUrl', "wrong URL to image").optional().isString()
]

