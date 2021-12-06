import { useEffect, useState } from "react";
import "./css/App.css";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import { AiFillMessage } from "react-icons/ai";
import SnackBar from "./SnackBar";

const socket = io.connect("https://nodejsserver2021.herokuapp.com/");

function App() {
  //STATE//
  const [name, setName] = useState("");
  const [chat, setChat] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [allChat, setAllChat] = useState([]);
  const [Snack, setSnack] = useState("");
  const room_id = 1;

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const UserData = {
    room_id: room_id,
    message: sendMessage,
    author: name,
    time: formatAMPM(new Date()),
  };

  const sentMessage = async () => {
    if (sendMessage !== "") {
      await socket.emit("myData", UserData);
      setAllChat((list) => [...list, UserData]);
      setSendMessage("");
    }
  };

  const joinRoom = () => {
    if (name !== "" && name.length >= 3) {
      setChat(true);
      socket.emit("join_room", name, room_id);
    }
  };

  ///message///
  useEffect(() => {
    socket.on("dataBack", (data) => {
      setAllChat((list) => [...list, data]);
    });
  }, []);

  ///join notification///
  useEffect(() => {
    socket.on("joinMessage", (joinMessage) => {
      setSnack(joinMessage);
    });
  }, []);

  ///leave notification///
  useEffect(() => {
    socket.on("user_leave", (leaveMessage) => {
      setSnack(leaveMessage);
    });
  }, []);

  const handleKeyPress = (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      sentMessage();
    }
  };

  const HandleJoinRoom = (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      joinRoom();
    }
  };

  return (
    <div>
      {!chat ? (
        <div className="container">
          <div className="join-page">
            <h2>JOIN ROOM</h2>
            <div className="box-wrapper">
              <input
                placeholder="What's your name ?"
                id="join-input"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onKeyPress={HandleJoinRoom}
              />
              <button id="join-btn" onClick={joinRoom}>
                Join Chat
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          {/* <SnackBar />; */}
          <h1>
            <AiFillMessage />
          </h1>
          <div className="chat-box">
            <ScrollToBottom className="scroll">
              {allChat.map((message, index) => (
                <div
                  key={index}
                  className={
                    name !== message.author ? "message-item" : "item-author"
                  }
                >
                  <h3 className={name !== message.author ? "h3" : "h3-author"}>
                    {message.message}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <h4>{name === message.author ? "You" : message.author}</h4>
                    <h5>{message.time}</h5>
                  </div>
                </div>
              ))}
            </ScrollToBottom>
            <div className="sent">
              <input
                placeholder="Write Something ..."
                value={sendMessage}
                onChange={(e) => {
                  setSendMessage(e.target.value);
                }}
                onKeyPress={handleKeyPress}
              />
              <button onClick={sentMessage}>Sent</button>
            </div>
          </div>
          <SnackBar data={Snack} />;
        </div>
      )}
    </div>
  );
}

export default App;
