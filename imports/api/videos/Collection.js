import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { FilesCollection } from 'meteor/ostrio:files';
import { HTTP } from 'meteor/http';

export const Videos = new Mongo.Collection('videos');
export const VideosFile = new FilesCollection({
  collectionName: 'videosFile',
  collection: Videos,
});
if (Meteor.isServer) {
  VideosFile.storagePath = () => `${process.env.HOME}/Uploaded`;

  VideosFile.allowClient();

  VideosFile.onBeforeUpload = () => true;

  VideosFile.onInitiateUpload = () => true;

  VideosFile.onAfterUpload = (fileInserted) => {
    const input = VideosFile.link(fileInserted);
    const url = 'https://app.zencoder.com/api/v2/jobs';
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Zencoder-Api-Key': 'd6fdd6158a1cccfd687a9482cab89e5f',
      },
      data: // HTML5 video. Outputs include a high quality mp4, WebM, OGG and a lower quality
      // mp4.
        {
          input,
          outputs: [
            {
              // Change this to your server: "url": "s3://output-bucket/output-file-name.mp4",
              label: 'mp4 high',
              h264_profile: 'high',
            },
            // {
            //   // Change this to your server: "url": "s3://output-bucket/output-file-name.webm",
            //   label: 'webm',
            //   format: 'webm',
            // },
            // {
            //   // Change this to your server: "url": "s3://output-bucket/output-file-name.ogg",
            //   label: 'ogg',
            //   format: 'ogg',
            // },
            // {
            //   // Change this to your server: "url": "s3://output-bucket/output-file-name-mobile.mp4",
            //   label: 'mp4 low',
            //   size: '640x480',
            // },
          ],
        },

    };
    const callback = (err, res) => {
      if (err) {
        console.log(err);
      }
      const { _id } = fileInserted;
      const videoAtualizado = {
        ...fileInserted,
        meta: res.data.outputs[0],
      };
      delete videoAtualizado._id;
      Videos.update({ _id }, videoAtualizado);
    };
    HTTP.post(url, options, callback);
  };

  Meteor.publish('videosFile', function (_id) {
    if (_id) {
      return VideosFile.find({ _id }).cursor;
    }
    check(_id, undefined);
    return VideosFile.find().cursor;
  });

  Meteor.publish('videos', function (_id) {
    if (_id) {
      return Videos.find({ _id });
    }
    check(_id, undefined);
    return Videos.find();
  });

  Meteor.methods({
    'videos.find' (_id) {
      if (_id) {
        return Videos.find({ _id }).cursor;
      }
      check(_id, undefined);
      return Videos.find().cursor;
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
      const { _id } = video;
      const videoToUpdate = video;
      delete videoToUpdate._id;

      if (videoToUpdate.meta.convertedId) {
        return VideosFile.update({ _id }, videoToUpdate);
      }
      return new Promise((resolve, reject) => {
        const proceedAfterUpload = false;
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'Zencoder-Api-Key': 'd6fdd6158a1cccfd687a9482cab89e5f',
          },
          meta: { isConvertedFile: true },
        };
        VideosFile.storagePath = () => `${process.env.HOME}/Converted`;

        VideosFile
          .load(
            videoToUpdate.meta.url,
            options,
            (err, res) => {
              if (err) {
                reject(err);
              } else {
                videoToUpdate.meta.convertedId = res._id;
                // VideosFile.storagePath = () => `${process.env.HOME}/Uploaded`;
                resolve(VideosFile.update({ _id }, videoToUpdate));
              }
            },
            proceedAfterUpload,
          );
      });
    },
    'videos.remove' ({ _id }) {
      check(_id, String);
      return Videos.remove({ _id });
    },
  });
}
