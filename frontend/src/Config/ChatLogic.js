export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender[0] === m.sender[0] &&
      messages[i].sender[0] !== userId
    )
     {
       return 0;
      } else if
     ( i < messages.length - 1 &&
      (messages[i + 1].sender[0] === m.sender[0] ||
        messages[i + 1].sender[0] !== undefined) &&
      messages[i].sender[0] === userId) {
        return 650
      }
  };
  
  export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender[0] !== m.sender[0] ||
        messages[i + 1].sender[0] === undefined) &&
      messages[i].sender[0] !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender[0] !== userId &&
      messages[messages.length - 1].sender[0]
    );
  };
  
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender[0] === m.sender[0];
  };
  
  export const getSender = (loggedUser, users) => {//get name only
    return users[0].id === loggedUser._id ? (users[1].name) : (users[0].name);
  };
  
  export const getSenderFull = (loggedUser, users) => {//get full details
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };