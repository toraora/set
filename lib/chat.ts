

export class ChatMessage {
    _id: String;
    room: String;
    user: String;
    time: Date;
    message: String;
}

export const ChatMessageCollection = new Mongo.Collection<ChatMessage>('chatmessages');

if (Meteor.isServer) {
    Meteor.publish('chatMessages', function(room: String) {
        return ChatMessageCollection.find({room: room}, {sort: {time: -1}, limit: 10});
    });
}

Meteor.methods({
    sendMessage(message: String, room: String) {
        if (!Meteor.user())
            return;
        var msg = new ChatMessage();
        msg.room = room;
        msg.user = Meteor.user().username;
        msg.time = new Date();
        msg.message = message;
        ChatMessageCollection.insert(msg);
    }
});
