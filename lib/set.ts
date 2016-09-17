import * as _ from 'lodash';

export class SetGameState {
    _id: string;
    room: string;
    cards: Array<string>;
    deck: Array<string>;
    score: { [username: string]: number; };
}

export const SetGameStateCollection = new Mongo.Collection<SetGameState>('gamestate');

let newDeck = ['01', 
'02', '03', '04', '05', '06', '07', '08', '09', '10', '11', 
'12', '13', '14', '15', '16', '17', '18', '19', '20', '21', 
'22', '23', '24', '25', '26', '27', '28', '29', '30', '31', 
'32', '33', '34', '35', '36', '37', '38', '39', '40', '41', 
'42', '43', '44', '45', '46', '47', '48', '49', '50', '51', 
'52', '53', '54', '55', '56', '57', '58', '59', '60', '61', 
'62', '63', '64', '65', '66', '67', '68', '69', '70', '71', 
'72', '73', '74', '75', '76', '77', '78', '79', '80', '81'];

if (Meteor.isServer) {
    Meteor.publish('gamestate', function(room: string) {
        return SetGameStateCollection.find({room: room}, {fields: {cards: 1, score: 1}});
    });
}

Meteor.methods({
    startNew(room: string) {
        if (!Meteor.user() || Meteor.isClient)
            return;
        var state = new SetGameState();
        state.room = room;
        state.deck = _.shuffle(newDeck);
        state.cards = new Array<string>();
        for (let i = 0; i < 12; i++) 
            state.cards.push(state.deck.pop());
        state.score = {};
        SetGameStateCollection.upsert({room: room}, state);
    },

    attemptSet(idx1: number, idx2: number, idx3: number, room: string) {
        if (!Meteor.user() || Meteor.isClient)
            return;
        var state = SetGameStateCollection.findOne({room: room});
        
        let card1 = parseInt(state.cards[idx1]) - 1;
        let card1att1 = card1 % 3;
        let card1att2 = Math.floor(card1 / 3) % 3;
        let card1att3 = Math.floor(card1 / 9) % 3;
        let card1att4 = Math.floor(card1 / 27);
        let card2 = parseInt(state.cards[idx2]) - 1;
        let card2att1 = card2 % 3;
        let card2att2 = Math.floor(card2 / 3) % 3;
        let card2att3 = Math.floor(card2 / 9) % 3;
        let card2att4 = Math.floor(card2 / 27);
        let card3 = parseInt(state.cards[idx3]) - 1;
        let card3att1 = card3 % 3;
        let card3att2 = Math.floor(card3 / 3) % 3;
        let card3att3 = Math.floor(card3 / 9) % 3;
        let card3att4 = Math.floor(card3 / 27);
        
        let att1ok = (card1att1 + card2att1 + card3att1) % 3 == 0; 
        let att2ok = (card1att2 + card2att2 + card3att2) % 3 == 0; 
        let att3ok = (card1att3 + card2att3 + card3att3) % 3 == 0; 
        let att4ok = (card1att4 + card2att4 + card3att4) % 3 == 0;

        if (att1ok && att2ok && att3ok && att4ok) {
            if (Meteor.user().username in state.score) 
                state.score[Meteor.user().username] += 3;
            else
                state.score[Meteor.user().username] = 3;
            if (state.cards.length > 12) {
                state.cards[idx1] = '';
                state.cards[idx2] = '';
                state.cards[idx3] = '';
                state.cards = state.cards.filter(s => s.length != 0);
            } else if (state.deck.length > 0) {
                state.cards[idx1] = state.deck.pop();
                state.cards[idx2] = state.deck.pop();
                state.cards[idx3] = state.deck.pop();
            } else {
                state.cards[idx1] = '';
                state.cards[idx2] = '';
                state.cards[idx3] = '';
            }
            SetGameStateCollection.update({_id: state._id}, state);
        }
    }
});