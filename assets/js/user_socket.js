// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import {Socket} from "phoenix"
import {
  setState,
  setSetCallback,
  setStartCallback,
  setPauseCallback,
  setResetCallback,
  setResumeCallback,
  showToast,
  showCurrentUser,
  setChatCallback,
  showChat,
} from "./tomer"

// And connect to the path in "lib/tomer_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/tomer_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/tomer_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/tomer_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:
const params = new URL(document.location.toString()).searchParams
const id = params.get("id")
let channel = socket.channel("room:user", {
  id,
  secretKey: window.secretKey,
})

channel.on("get", (e) => {
  setState(e)
})

channel.on("state_changed", (newState) => {
  console.log("State change!", newState)
  setState(newState)
})

channel.on("presence_state", (e) => {
  showCurrentUser(e)
})

channel.on("presence_diff", (e) => {
  showToast(e)
})

channel.on("chat", (e) => {
  if (params.get("chat") === "true") {
    showChat(e.content)
  }
})

function set(_e, hour, minute, second) {
  const epoch = ((((60 * hour) + minute) * 60) + second) * 1000;
  channel.push("set", {
    remainingEpoch: epoch,
  })
}

function start(_e, hour, minute, second) {
  const epoch = ((((60 * hour) + minute) * 60) + second) * 1000;
  channel.push("start", {
    remainingEpoch: epoch,
  })
}

function reset() {
  channel.push("reset", {})
}

function resume() {
  channel.push("resume", {})
}

function pause() {
  channel.push("pause")
}

function setChat(_e, content) {
  channel.push("chat", {
    content,
  })
}

setSetCallback(set)
setStartCallback(start)
setResetCallback(reset)
setResumeCallback(resume)
setPauseCallback(pause)
setChatCallback(setChat)

channel.join()
  .receive("ok", resp => {
    console.log("Joined successfully", resp)
    channel.push("get", {})
  })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
