PlayersList = new Mongo.Collection('players'); // global variable

if (Meteor.isClient) {
  // this code only run on the client

  Template.leaderboard.helpers({
    // helper functions go here
    'player': function () {
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

      PlayersList.update(selectedPlayer, { $inc: { score: 5 } });
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');

      PlayersList.update(selectedPlayer, { $inc: { score: -5 } });
    },
    'click .remove': function() {
      var selectedPlayer = Session.get('selectedPlayer');

      if (confirm('Are You sure?')) {
        PlayersList.remove(selectedPlayer);
      }
    }
  });

  Template.addPlayerForm.events({
    'submit form': function (event) {
      event.preventDefault(); // evita o refresh da página

      var playerNameVar = event.target.playerName.value;
      var playerScore = event.target.playerScore.value;

      PlayersList.insert({
        name: playerNameVar,
        score: playerScore
      });
      
      event.target.playerName.value = '';
      event.target.playerScore.value = '';
    }
  });
}

if (Meteor.isServer) {
  // this code only run on the server
}