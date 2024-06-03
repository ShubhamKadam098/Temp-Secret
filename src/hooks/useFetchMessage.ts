import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useFetchMessage = (id: string) => {
  const [messageId, setMessageId] = useState(id);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [inputType, setInputType] = useState("text");
  const [isMessageAvailable, setIsMessageAvailable] = useState(true);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setMessageId(id);
    }
  }, [id]);

  const fetchMessage = async () => {
    setIsLoading(true);
    try {
      if (isPasswordRequired && password === "") {
        toast.error("Password is required");
        throw new Error("Password is required");
      }
      const res = await axios.post("/api/secret", {
        id: messageId,
        password: password,
      });
      if (!res.data.success) {
        throw new Error("Error while fetching the data");
      }
      if (res.data.inputType === "link") {
        window.location.href = res.data.message;
        return;
      }
      setMessage(res.data.message);
      setInputType(res.data.inputType);
      setIsPasswordRequired(false);
      toast.success("Message retrieved successfully!");
    } catch (err: any) {
      if (err.response) {
        const { status } = err.response;
        if (status === 401) {
          setIsPasswordRequired(true);
          toast.error("Password required");
        } else if (status === 403) {
          toast.error("Incorrect password");
        } else if (status === 404) {
          setIsMessageAvailable(false);
          toast.error("Message not found");
        } else {
          toast.error("An error occurred while retrieving the message");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    message,
    inputType,
    isMessageAvailable,
    isPasswordRequired,
    isLoading,
    fetchMessage,
  };
};

export default useFetchMessage;
