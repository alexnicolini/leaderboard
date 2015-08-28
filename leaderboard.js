PlayersList = new Mongo.Collection('players'); // global variable

if (Meteor.isClient) {
  // this code only run on the client

  Template.leaderboard.helpers({
    // helper functions go here
    'player': function () {
      return PlayersList.find();
    },
    'selectedClass': function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return 'selected';
      }
    }
  });

  Template.leaderboard.events({
    'click .player': function () {
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, { $inc: { score: 5 } });
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, { $inc: { score: -5 } });
    }
  });
}

if (Meteor.isServer) {
  // this code only run on the server
}