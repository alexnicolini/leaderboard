PlayersList = new Mongo.Collection('players'); // global variable

if (Meteor.isClient) {
  // this code only run on the 

  Meteor.subscribe('thePlayers');

  Template.leaderboard.helpers({
    // helper functions go here
    'player': function () {
      var currentUserId = Meteor.userId();
      return PlayersList.find({}, { sort: { score: -1, name: 1 } });
    },
    'selectedClass': function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return 'selected';
      }
    },
    'showSelectedPlayer': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    },
  });

  Template.leaderboard.events({
    'click .player': function () {
      var playerId = this._id;

      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');

      Meteor.call('modifyPlayerScore', selectedPlayer, 5);
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');

      Meteor.call('modifyPlayerScore', selectedPlayer, -5);
    },
    'click .remove': function() {
      var selectedPlayer = Session.get('selectedPlayer');

      if (confirm('Are You sure?')) {
        Meteor.call('removePlayerData', selectedPlayer);
      }
    }
  });

  Template.addPlayerForm.events({
    // events goes here
    'submit form': function (event) {
      event.preventDefault(); // evita o refresh da página

      var playerNameVar = event.target.playerName.value;
      var playerScoreVar = parseInt(event.target.playerScore.value);

      Meteor.call('insertPlayerData', playerNameVar, playerScoreVar);

      event.target.playerName.value = '';
      event.target.playerScore.value = '';
    }
  });
}

if (Meteor.isServer) {
  // this code only run on the server

  Meteor.publish('thePlayers', function () {
    var currentUserId = this.userId;
    return PlayersList.find({ createdBy: currentUserId });
  });

  Meteor.methods({
    // methods goes here
    'insertPlayerData': function(playerNameVar, playerScoreVar) {
      var currentUserId = Meteor.userId();

      PlayersList.insert({
        name: playerNameVar,
        score: playerScoreVar,
        createdBy: currentUserId
      });
    },
    'removePlayerData': function(selectedPlayer) {
      var currentUserId = Meteor.userId();

      PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
    },
    'modifyPlayerScore': function(selectedPlayer, scoreValue) {
      PlayersList.update({_id: selectedPlayer, createdBy: selectedPlayer }, { $inc: { score: scoreValue } });
    }
  });
}