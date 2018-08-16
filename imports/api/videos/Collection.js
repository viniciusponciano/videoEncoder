import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { FilesCollection } from 'meteor/ostrio:files';

// const Videos = new Mongo.Collection('videos');
// export default Videos;
export const VideosFile = new FilesCollection({
  collectionName: 'videosFile',
  // collection: Videos,
});
if (Meteor.isServer) {
  VideosFile.storagePath = () => '/home/ubuntu/Uploaded';

  VideosFile.allowClient();

  VideosFile.onBeforeUpload = () => true;

  VideosFile.onInitiateUpload = () => true;

  Meteor.publish('videosFile', function (_id) {
    if (_id) {
      return VideosFile.findOne(_id);
    }
    check(_id, undefined);
    return VideosFile.find().cursor;
  });
  //
  // Meteor.publish('videos', function (_id) {
  //   if (_id) {
  //     return Videos.findOne(_id);
  //   }
  //   check(_id, undefined);
  //   return Videos.find();
  // });

  Meteor.methods({
    'videos.find' (_id) {
      if (_id) {
        return VideosFile.findOne(_id);
      }
      check(_id, undefined);
      return VideosFile.find().cursor;
    },
    // 'videos.insert' (video) {
    //   const type = {
    //     lastModified: Number,
    //     lastModifiedDate: Date,
    //     name: String,
    //     size: Number,
    //     type: String,
    //     webkitRelativePath: String,
    //     uInt8Array: Uint8Array,
    //   };
    //   check(video, type);
    //   return Videos.insert(video);
    // },
    'videos.update' (video) {
      check(video, Object);
      const { _id } = video;
      delete video._id;
      return VideosFile.update({ _id }, video);
    },
    // 'videos.remove' ({ _id }) {
    //   check(_id, String);
    //   return Videos.remove({ _id });
    // },
  });
}
