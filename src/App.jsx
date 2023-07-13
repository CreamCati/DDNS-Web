import './App.css'
import Header from "./components/Header/Header.jsx";
import Domain from "./view/Domain/index.jsx";
import {createContext, useEffect, useRef, useState} from "react";

export const GlobalContext = createContext();

function App() {
    const storedAppServerUrl = localStorage.getItem('appServerUrl');
    const storedSecretId = localStorage.getItem('secretId');
    const storedSecretKey = localStorage.getItem('secretKey');

    const [appServerUrl, setAppServerUrl] = useState(storedAppServerUrl || 'http://localhost:8325');
    const [secretId, setSecretId] = useState(storedSecretId || '');
    const [secretKey, setSecretKey] = useState(storedSecretKey || '');
    useEffect(() => {
        // 在状态值更新后保存到本地存储
        localStorage.setItem('appServerUrl', appServerUrl);
        localStorage.setItem('secretId', secretId);
        localStorage.setItem('secretKey', secretKey);
    }, [appServerUrl,secretId,secretKey]);
    useEffect(() => {
        // 在状态值更新后保存到本地存储
        localStorage.setItem('secretId', secretId);
        localStorage.setItem('secretKey', secretKey);
    }, [secretId,secretKey]);
    return (
        <GlobalContext.Provider value={[appServerUrl, setAppServerUrl,secretId, setSecretId,secretKey, setSecretKey]}>
            <Header/>
            <Domain/>
        </GlobalContext.Provider>
    )
}

export default App
