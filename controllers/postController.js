const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Get list of all posts
exports.post_list = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find();
    res.json(allPosts);
});

// Get a single post
exports.post_detail = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    res.json(post);
})

// Handle Post create on POST
exports.create_post = [ 
    body("title")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Must provide a title."),
    body("text")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Must provide blog text."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            published: req.body.published
        });

        // NOTE TO SELF -- NOT SURE IF THIS IS RIGHT BE SURE TO TEST IT
        if (!errors.isEmpty()) {
            res.json([post, errors.array()]);
            return;
        } else {
            await post.save();
            res.json(post);
        }
    }),
];

// Handle Post Delete on POST
exports.delete_post = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.body.postid);
    await Post.findByIdAndDelete(req.body.postid);
    res.json(post);
});

// Handle Post Update on POST
exports.update_post = [
    body("title")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Must provide a title."),
    body("text")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Must provide blog text."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            published: req.body.published,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.json([post, errors.array()]);
            return;
        } else {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {returnDocument: 'after'});
            res.json(updatedPost);
        };
    }),
];
