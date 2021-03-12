import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { Socket } from "socket.io-client";
import {
  Message,
  Poste,
  Service,
  useAddMessageMutation,
  useMessagesQuery,
  User,
} from "../graphql/generated";

const EVENT = "new-chat-message"; // Name of the event
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (convUuid: string) => {
  const [messages, setMessages] = useState<
    Array<
      { __typename?: "Message" } & Pick<
        Message,
        "uuid" | "content" | "createdAt" | "updatedAt"
      > & {
          user: { __typename?: "User" } & Pick<
            User,
            "id" | "email" | "firstname" | "lastname" | "profilePicPath"
          > & {
              service: { __typename?: "Service" } & Pick<Service, "name">;
              poste: { __typename?: "Poste" } & Pick<Poste, "name">;
            };
        }
    >
  >([]);

  const [messagesResult] = useMessagesQuery({
    variables: {
      convUuid,
    },
    pause: false, // this query can be done server-side
  });
  useEffect(() => {
    if (messagesResult.data?.messages) {
      setMessages(messagesResult.data?.messages);
    }
  }, []);

  const socketRef = useRef<typeof Socket>();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { convUuid },
    });

    // Listens for incoming messages
    socketRef.current.on(
      EVENT,
      (
        message: { __typename?: "Message" } & Pick<
          Message,
          "uuid" | "content" | "createdAt" | "updatedAt"
        > & {
            user: { __typename?: "User" } & Pick<
              User,
              "id" | "email" | "firstname" | "lastname" | "profilePicPath"
            > & {
                service: { __typename?: "Service" } & Pick<Service, "name">;
                poste: { __typename?: "Poste" } & Pick<Poste, "name">;
              };
          }
      ) => {
        const { __typename, ...selectedFields } = message;
        console.log("== got a new message, adding it ==")
        console.log("messages:")
        console.log(messages)
        console.log("new message:")
        console.log(selectedFields)
        setMessages((messages) => [...messages, selectedFields]);
      }
    );

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [convUuid]);

  // Sending a message to the server that
  // forwards it to all users in the same room
  const [, addMessage] = useAddMessageMutation();

  const sendMessage = async (newMessage: string, userId: number) => {
    const newMessageResult = await addMessage({
      convUuid,
      message: newMessage,
      userId,
    });

    if (newMessageResult.data) {
      const {
        __typename,
        ...selectedEmitFields
      } = newMessageResult.data.addMessage;
      if (socketRef.current) {
        console.log("== emiting message to server")
        console.log(selectedEmitFields)
        socketRef.current.emit(EVENT, selectedEmitFields);
        console.log("==")
      }
    }
  };

  return { messages, sendMessage };
};

export default useChat;
