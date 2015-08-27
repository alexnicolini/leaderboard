PlayersList = new Mongo.Collection('players'); // global variable

if (Meteor.isClient) {

  // this code only run on the client
  Template.leaderboard.helpers({
    // helper functions go here
    'player': function () {
      return PlayersList.find();
    },
    'count': function() {
      return PlayersList.find().count();
    }
  });
}

if (Meteor.isServer) {
  // this code only run on the server
}