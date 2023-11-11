// implement your posts router here
const express = require("express");
const Post = require("./posts-model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message: "The posts information could not be retrieved",
      err: err.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The posts information could not be retrieved",
      err: err.message,
    });
  }
});
router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    try {
      Post.insert({ title, contents })
        .then(({ id }) => {
          return Post.findById(id);
        })
        .then((post) => {
          res.status(201).json(post);
        });
    } catch (err) {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message,
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const possiblePost = await Post.findById(req.params.id);
  try {
    if (!possiblePost) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      await Post.remove(req.params.id);
      res.json(possiblePost);
    }
  } catch (err) {
    res.status(500).json({
      message: "The posts information could not be retrieved",
      err: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  }
  try {
    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    }
    await Post.update(req.params.id, req.body);
    const updatedPost = await Post.findById(req.params.id);
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({
      message: "The posts information could not be retrieved",
      err: err.message,
    });
  }
});

router.get("/:id/messages", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      const messages = await Post.findPostComments(req.params.id);
      res.json(messages);
    }
  } catch (err) {
    res.status(500).json({
      message: "The posts information could not be retrieved",
      err: err.message,
    });
  }
});

module.exports = router;
