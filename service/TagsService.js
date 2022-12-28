const { tags } = require('../dataBase');

class TagsService {
  async getAllTags() {
    const tagsRes = await tags.find().toArray();
    return tagsRes
      ? { success: true, tags: tagsRes }
      : { success: false, message: 'Unknown error' };
  }

  async updateTags(tagInfo) {
    const query = {
      tagName: tagInfo.tagName,
    };
    const findResponse = await tags.findOne(query);
    console.log(findResponse, 'find tag res');
    if (findResponse) {
      const updateQuery = {
        $set: {
          useAbility: findResponse.useAbility + 1,
        },
      };
      const updateResponse = await tags.updateOne(query, updateQuery);

      console.log(updateResponse, 'tag update res');

      return updateResponse ? { success: true } : { success: false };
    } else {
      const insertResponse = await tags.insertOne({
        ...query,
        useAbility: 1,
      });

      console.log(insertResponse, 'tag insert res');

      return insertResponse ? { success: true } : { success: false };
    }
  }
}

module.exports = new TagsService();
