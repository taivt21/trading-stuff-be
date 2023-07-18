import Comments from "../entities/comment.js";
export const createComment = async (req, res) => {
  try {
    const postComment = new Comments({
      description: req.body.description,
      user: req.user.id,
      post: req.body.postId,
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
export const getAllComment = async (req, res) => {
  try {
    const postingComments = await Comments.find().populate("post user");
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
    const comment = await Comments.findByIdAndUpdate(
      req.params.id,
      {
        description: req.body.description,
      },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Update success", data: comment });
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
      await comment.deleteOne;
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
