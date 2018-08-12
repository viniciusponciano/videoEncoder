import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Videos = new Mongo.Collection('videos');

export default Videos;

if (Meteor.isServer) {
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
    'videos.insert'(video) {
      check(video, Object);
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
