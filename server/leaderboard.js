// Transmit a selection of data into the ether
Meteor.publish('thePlayers', function () {

  // Get the ID of the current user
  var currentUserId = this.userId;

  // Return players "owned" by the current user
  return PlayersList.find({ createdBy: currentUserId });
});

// Methods execute on the server after being triggered from the clien
Meteor.methods({
  'insertPlayerData': function(playerNameVar, playerScoreVar) {
    
    // Get the ID of the current user
    var currentUserId = Meteor.userId();

    // Insert the data of a new player
    PlayersList.insert({
      name: playerNameVar,
      score: playerScoreVar,
      createdBy: currentUserId
    });
  },
  'removePlayerData': function(selectedPlayer) {

    // Get the ID of the current user
    var currentUserId = Meteor.userId();

    // Remove a document from the collection
    PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
  },
  'modifyPlayerScore': function(selectedPlayer, scoreValue) {

    // Get the ID of the current user
    var currentUserId = Meteor.userId();
    
    // Update a document and either increment or decrement the score field
    PlayersList.update({_id: selectedPlayer, createdBy: currentUserId }, { $inc: { score: scoreValue } });
  }
});
