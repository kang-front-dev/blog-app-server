const { reviews } = require('../dataBase');
const { ObjectId } = require('mongodb');

class ReviewService {
  async getAllReviews() {
    const result = await reviews.find().toArray();
    return result
      ? { success: true, reviews: result }
      : { success: false, message: 'Unknown error' };
  }

  async insertReview(reviewInfo) {
    const query = {
      title: reviewInfo.title,
      descr: reviewInfo.descr,
      group: reviewInfo.group,
      tags: reviewInfo.tags,
      imgPath: reviewInfo.imgPath,
      author: reviewInfo.author,
      likes: reviewInfo.likes,
      dislikes: reviewInfo.dislikes,
      views: reviewInfo.views,
      rating: reviewInfo.rating,
      comments: [],
      createDate: reviewInfo.createDate,
    };
    const result = await reviews.insertOne(query);

    return result
      ? { success: true, reviewId: result.insertedId }
      : { success: false, message: 'Unknown error' };
  }

  async deleteReview(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const result = await reviews.deleteOne(query);
    console.log(result,'deleteReview result');
    return result
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }

  async editReview(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const editQuery = {
      $set: {
        title: reviewInfo.title,
        descr: reviewInfo.descr,
        groups: reviewInfo.groups,
        tags: reviewInfo.tags,
        rating: reviewInfo.rating,
      },
    };
    const result = await reviews.findOneAndUpdate(query, editQuery);
    return result
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }

  async getUserReviews(userInfo) {
    const query = {
      author: userInfo.name,
    };
    const result = await reviews.find(query).toArray();

    return result
      ? { success: true, reviews: result }
      : { success: false, message: 'Reviews not found.' };
  }

  async getReview(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const result = await reviews.findOne(query);
    return result
      ? { success: true, reviewData: result }
      : { success: false, message: 'Reviews not found.' };
  }

  async addLike(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const result = await reviews.findOne(query);
    const reviewLikes = result.likes;
    const updateQuery = {
      $set: {
        likes: [...reviewLikes, reviewInfo.username],
      },
    };
    const updateResult = await reviews.updateOne(query, updateQuery);
    return updateResult
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }

  async removeLike(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const result = await reviews.findOne(query);
    const reviewLikes = result.likes;
    const userIndex = reviewLikes.indexOf(reviewInfo.username);
    reviewLikes.splice(userIndex, 1);
    const updateQuery = {
      $set: {
        likes: reviewLikes,
      },
    };
    const updateResult = await reviews.updateOne(query, updateQuery);
    console.log(updateResult, 'addLike result');
    return updateResult
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }

  async addDislike(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const result = await reviews.findOne(query);
    const reviewDislikes = result.dislikes;
    const updateQuery = {
      $set: {
        dislikes: [...reviewDislikes, reviewInfo.username],
      },
    };
    const updateResult = await reviews.updateOne(query, updateQuery);
    console.log(updateResult, 'addDislike result');
    return updateResult
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }

  async removeDislike(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const result = await reviews.findOne(query);
    const reviewDislikes = result.dislikes;
    const userIndex = reviewDislikes.indexOf(reviewInfo.username);
    reviewDislikes.splice(userIndex, 1);
    const updateQuery = {
      $set: {
        dislikes: reviewDislikes,
      },
    };
    const updateResult = await reviews.updateOne(query, updateQuery);
    console.log(updateResult, 'addDislike result');
    return updateResult
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }

  async addView(reviewInfo) {
    const query = {
      _id: new ObjectId(reviewInfo._id),
    };
    const result = await reviews.findOne(query);
    const reviewViews = result.views;
    const updateQuery = {
      $set: {
        views: reviewViews + 1,
      },
    };
    const updateResult = await reviews.updateOne(query, updateQuery);
    console.log(updateResult, 'addView result');
    return updateResult
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }

  async addComment(commentInfo) {
    const query = {
      _id: new ObjectId(commentInfo.reviewId),
    };
    const result = await reviews.findOne(query);
    const updateQuery = {
      $set: {
        comments: [
          ...result.comments,
          {
            date: commentInfo.date,
            content: commentInfo.content,
            author: commentInfo.author,
          },
        ],
      },
    };
    const updateResult = await reviews.updateOne(query, updateQuery);
    console.log(updateResult, 'addComment result');
    return updateResult
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }
  async removeComment(commentInfo) {
    const query = {
      _id: new ObjectId(commentInfo.reviewId),
    };
    const result = await reviews.findOne(query);
    const comments = result.comments;
    comments.splice(commentInfo.itemIndex, 1);
    const updateQuery = {
      $set: {
        comments: [...comments],
      },
    };
    const updateResult = await reviews.updateOne(query, updateQuery);
    console.log(updateResult, 'removeComment result');
    return updateResult
      ? { success: true }
      : { success: false, message: 'Unknown error' };
  }
}

module.exports = new ReviewService();
