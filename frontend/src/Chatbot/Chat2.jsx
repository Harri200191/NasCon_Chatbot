import { useState} from "react";
import { BsArrowRightCircleFill, BsFillMicFill   } from "react-icons/bs";   
import { FaRegStopCircle } from "react-icons/fa";
import "./Chat2.scss"; 
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);  
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [responses, setResponses] = useState("Hello there! How can I help you today?");
 
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (userInput.trim() !== "") { 
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userInput, isUser: true },
      ]);
      setUserInput("");  
    }
 
    axios.get(`http://127.0.0.1:5000/api/generate-text/${userInput}`)
      .then((response) => {   
        setResponses(response.data.text);
        console.log('Response:', response.data.text);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.data.text, isUser: false },
        ]);
      })
      .catch((error) => {  
        console.log(error) 
      });  
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
 
      recorder.addEventListener('dataavailable', (e) => {
        setAudioChunks((chunks) => [...chunks, e.data]);
      });
 
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log('Audio Blob:', audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        //console.log('Audio URL:', audioUrl);
        setAudioBlob(audioUrl);
        txtcall(audioUrl);
      });
 
      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
 
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

 

  const stopRecording = () => {  
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } 
  };

  const txtcall = async (audioUrl) => {
    try {
        const formData = new FormData(); 
        formData.append('file', audioUrl);

        axios.post(`http://127.0.0.1:5000/api/speech-to-text`, {audio_url: audioUrl})
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to send audio to backend');
            }

            const data = response.json();
            console.log('Recognized Text:', data.text);
        })

        } catch (error) {
            console.error('Error sending audio to backend:', error);
        } 
  }

  return (
    <div className="main">
        <div className="chatbot-container">
        <div className="chatbot-header">Chatbot</div>
        <div className="chatbot-content"> 
            {messages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? "user" : "bot"}`}>
                <div className={`message-box ${ message.isUser ? "user-box" : "bot-box"}`}>
                {message.text}
                </div>
            </div>
            ))}
        </div>
        <div className="text-area">
            <form className="chat-input" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type your message..."
                value={userInput}
                onChange={handleUserInput}
            />
            <button type="submit">
                <BsArrowRightCircleFill size={23} />
            </button>
            <BsFillMicFill className="speech-icon" onClick={startRecording} />
            <FaRegStopCircle className="stop-icon" onClick={stopRecording}/>
            </form>
    
        </div>
        </div>
    </div>
  );
};

export default Chatbot;


 
 
 