const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  Post = require('../../models/Posts'),
  validatePostInput = require('../../validation/post');

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  const { avatar, name, text } = req.body;
  const post = await Post.create({
    text,
    name,
    avatar,
    user: req.user.id
  });
  res.json(post);
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (e) {
    res.status(404);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(404).json({ noPostFound: 'no post found with that Id' });
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (`${post.user}` === req.user.id) {
      await post.remove();
      res.json({ success: true });
    } else {
      res.status(401).json({ unAuthorized: 'User not authorized' });
    }
  } catch (e) {
    res.status(404).json({ errorDeleting: 'error deleting post' });
  }
});

router.post('/like/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post.likes.find(like => `${like.user}` === req.user.id)) {
      return res.status(400).json({ alreadyLiked: 'User already liked this post.' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post);
  } catch (e) {
    res.status(404).json({ errorDeleting: 'error liking post' });
  }
});

router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.find(like => `${like.user}` === req.user.id)) {
      return res.status(400).json({ notLiked: 'Post not liked' });
    }
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save;
    res.json(post);
  } catch (e) {
    res.status(404).json({ errorDeleting: 'error unliking post' });
  }
});

router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async ({ params, body, user: { id: user } }, res) => {
    const { errors, isValid } = validatePostInput(body);
    if (!isValid) return res.status(400).json(errors);
    try {
      const post = await Post.findById(params.id);
      const { text, name, avatar } = body;
      const newComment = {
        text,
        name,
        avatar,
        user
      };
      await post.comments.unshift(newComment);
      post.save();
      res.json(post);
    } catch (e) {
      res.status(404).json({ postnotfound: 'No Post Found' });
    }
  }
);

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const commentIndex = await post.comments.findIndex(comment => `${comment._id}` === req.params.comment_id);
    if (commentIndex < 0) return res.status(400).json({ commentNotFound: 'No Comment Found' });
    post.comments.splice(commentIndex, 1);
    post.save();
    res.json(post);
  } catch (e) {
    res.status(404).json({ postNotFound: 'No Post Found' });
  }
});

module.exports = router;
