import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { FilesCollection } from 'meteor/ostrio:files';

const Videos = new Mongo.Collection('videos');
export default Videos;
export const VideosFile = new FilesCollection({
  collectionName: 'videosFile',
  collection: Videos,
});
if (Meteor.isServer) {
  VideosFile.storagePath = () => '/home/vinicius/Uploaded';

  VideosFile.allowClient();

  VideosFile.onBeforeUpload = (file) => {
    return true;
  };

  VideosFile.onInitiateUpload = (file) => {
    return true;
  };

  Meteor.publish('videosFile', function () {
    return VideosFile.find().cursor;
  });

  Meteor.publish('videos', function (_id) {
    if (_id) {
      return Videos.findOne(_id);
    }
    check(_id, undefined);
    return Videos.find();
  });

  Meteor.methods({
    'videos.find' (_id) {
      if (_id) {
        check(_id, String);
        return Videos.findOne(_id);
      }
      check(_id, undefined);
      return Videos.find();
    },
    'videos.insert' (video) {
      const type = {
        lastModified: Number,
        lastModifiedDate: Date,
        name: String,
        size: Number,
        type: String,
        webkitRelativePath: String,
        uInt8Array: Uint8Array,
      };
      check(video, type);
      return Videos.insert(video);
    },
    'videos.update' (video) {
      check(video, Object);
      return Videos.update(video);
    },
    'videos.remove' ({ _id }) {
      check(_id, String);
      return Videos.remove({ _id });
    },
  });
}
