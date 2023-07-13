import React, {useState} from 'react';
import './index.css'
import DomainList from "./domain-list/index.jsx";
import DomainInfo from "./domain-info/index.jsx";
const Domain = () => {
    const [domain,setDomain] = useState('')
    return (
        <div className='domain'>
            <DomainList setDomain={setDomain}/>
            <DomainInfo domain={domain}/>
        </div>
    );
};

export default Domain;

