import Comments from "../entities/comment.js";
export const createComment = async (req, res) => {
  try {
    const postComment = new Comments({
      description: req.body.description,
      user: req.user.id,
      post: req.body.post,
      img: req.body.img,
    });

    // Save the post to the database
    await postComment.save();

    res.status(201).json({
      status: "Success",
      messages: "Comment created successfully!",
      data: { postComment },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const getAllCommentByPost = async (req, res) => {
  try {
    const postingId = req.params.id;
    const postingComments = await Comments.find({ post: postingId }).populate(
      "post user"
    );
    res.status(200).json({
      status: "Success",
      messages: "Get postings successfully!",
      data: { postingComments },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    if (req.body.description) {
      comment.description = req.body.description;
    }

    if (req.body.img) {
      comment.img = req.body.img;
    }
    if (req.body.post) {
      comment.post = req.body.post;
    }

    const updatedComment = await comment.save();

    res.status(200).json({ message: "update success", data: updatedComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "No posts found" });
    } else {
      await comment.remove();
      res.status(200).json({
        message: "delete comment success",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
