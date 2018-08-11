import { Mongo } from 'meteor/mongo';

export const Videos = new Mongo.Collection('videos');

if (Meteor.isServer) {
    Meteor.publish('videos', function (_id) {
        if (_id) {
          return Videos.findOne(_id);
        }
        return Videos.find();
    });

    Meteor.methods({
    'videos.find'(_id) {
    if (_id) {
        check(_id, String);
        return Videos.findOne(_id);
    }
        return Videos.find();

      },
     'videos.insert'(video) {
                 check(video, Object);
                 return Videos.insert(video);
               },
               'videos.update'(video) {
                          check(video, Object);
                          return Videos.update(video);
                        },
                        'videos.remove'(video) {
                                   check(video, Object);
                                   return Videos.remove({_id: video._id });
                                 }});
}